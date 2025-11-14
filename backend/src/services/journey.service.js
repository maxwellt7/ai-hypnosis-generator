import { supabase } from '../config/supabase.js';
import { n8nService } from './n8n.service.js';
import { pineconeService } from './pinecone.service.js';
import { logger } from '../utils/logger.js';
import { NotFoundError, AuthorizationError } from '../utils/errors.js';
import { JOURNEY_STATUS } from '../utils/constants.js';

export class JourneyService {
  async createJourney(userId, journeyData) {
    try {
      // Create journey record
      const { data: journey, error } = await supabase
        .from('journeys')
        .insert({
          user_id: userId,
          goal: journeyData.goal,
          intention: journeyData.intention,
          status: JOURNEY_STATUS.CREATING,
          journey_data: {
            duration: journeyData.duration || 15,
            preferences: journeyData.preferences || {},
          },
        })
        .select()
        .single();

      if (error) throw error;

      // Get user profile for context
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Get user information from Pinecone
      const userContext = await pineconeService.searchUserInformation(
        userId,
        `${journeyData.goal} ${journeyData.intention}`,
        5
      );

      // Trigger n8n workflow for journey generation
      await n8nService.triggerJourneyCreation({
        journeyId: journey.id,
        userId,
        goal: journeyData.goal,
        intention: journeyData.intention,
        duration: journeyData.duration || profile?.preference_duration || 15,
        userProfile: profile,
        userContext: userContext?.map(m => m.metadata) || [],
      });

      logger.info(`Journey created: ${journey.id} for user: ${userId}`);
      return journey;
    } catch (error) {
      logger.error('Error creating journey:', error);
      throw error;
    }
  }

  async getJourney(journeyId, userId) {
    try {
      const { data, error } = await supabase
        .from('journeys')
        .select(`
          *,
          journey_days (
            id,
            day_number,
            title,
            description,
            audio_url,
            duration_seconds,
            completed,
            completed_at,
            created_at
          )
        `)
        .eq('id', journeyId)
        .single();

      if (error) throw new NotFoundError('Journey');

      // Verify ownership
      if (data.user_id !== userId) {
        throw new AuthorizationError();
      }

      // Sort days by day_number
      if (data.journey_days) {
        data.journey_days.sort((a, b) => a.day_number - b.day_number);
      }

      return data;
    } catch (error) {
      logger.error('Error getting journey:', error);
      throw error;
    }
  }

  async listJourneys(userId, options = {}) {
    try {
      let query = supabase
        .from('journeys')
        .select(`
          *,
          journey_days (
            id,
            day_number,
            completed
          )
        `)
        .eq('user_id', userId);

      // Apply filters
      if (options.status) {
        query = query.eq('status', options.status);
      }

      // Apply sorting
      query = query.order('created_at', { ascending: false });

      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data;
    } catch (error) {
      logger.error('Error listing journeys:', error);
      throw error;
    }
  }

  async getJourneyDay(journeyId, dayNumber, userId) {
    try {
      // First verify journey ownership
      const { data: journey } = await supabase
        .from('journeys')
        .select('user_id')
        .eq('id', journeyId)
        .single();

      if (!journey || journey.user_id !== userId) {
        throw new AuthorizationError();
      }

      // Get the specific day
      const { data, error } = await supabase
        .from('journey_days')
        .select('*')
        .eq('journey_id', journeyId)
        .eq('day_number', dayNumber)
        .single();

      if (error) throw new NotFoundError('Journey day');

      return data;
    } catch (error) {
      logger.error('Error getting journey day:', error);
      throw error;
    }
  }

  async markDayComplete(journeyId, dayNumber, userId) {
    try {
      // Verify journey ownership
      const { data: journey } = await supabase
        .from('journeys')
        .select('user_id')
        .eq('id', journeyId)
        .single();

      if (!journey || journey.user_id !== userId) {
        throw new AuthorizationError();
      }

      // Get the day
      const { data: day, error: dayError } = await supabase
        .from('journey_days')
        .select('*')
        .eq('journey_id', journeyId)
        .eq('day_number', dayNumber)
        .single();

      if (dayError) throw new NotFoundError('Journey day');

      // Mark as complete
      const { data: updated, error } = await supabase
        .from('journey_days')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq('id', day.id)
        .select()
        .single();

      if (error) throw error;

      // Update user stats
      await this.updateUserStats(userId, day.duration_seconds || 0);

      // Check if journey is complete
      await this.checkJourneyCompletion(journeyId);

      logger.info(`Day ${dayNumber} marked complete for journey: ${journeyId}`);
      return updated;
    } catch (error) {
      logger.error('Error marking day complete:', error);
      throw error;
    }
  }

  async updateUserStats(userId, durationSeconds) {
    try {
      const durationMinutes = Math.floor(durationSeconds / 60);
      const today = new Date().toISOString().split('T')[0];

      // Get current stats
      const { data: stats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!stats) return;

      // Calculate streak
      let newStreak = stats.current_streak;
      const lastSession = stats.last_session_date;

      if (lastSession) {
        const lastDate = new Date(lastSession);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
          // Same day, no change to streak
        } else if (diffDays === 1) {
          // Consecutive day, increment streak
          newStreak += 1;
        } else {
          // Streak broken, reset
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      const longestStreak = Math.max(stats.longest_streak, newStreak);

      // Update stats
      await supabase
        .from('user_stats')
        .update({
          current_streak: newStreak,
          longest_streak: longestStreak,
          total_minutes_listened: stats.total_minutes_listened + durationMinutes,
          total_sessions: stats.total_sessions + 1,
          last_session_date: today,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      logger.info(`Stats updated for user: ${userId}`);
    } catch (error) {
      logger.error('Error updating user stats:', error);
      // Don't throw - stats update shouldn't fail the main operation
    }
  }

  async checkJourneyCompletion(journeyId) {
    try {
      // Get all days for the journey
      const { data: days } = await supabase
        .from('journey_days')
        .select('completed')
        .eq('journey_id', journeyId);

      if (!days || days.length === 0) return;

      // Check if all days are completed
      const allComplete = days.every(day => day.completed);

      if (allComplete) {
        await supabase
          .from('journeys')
          .update({
            status: JOURNEY_STATUS.COMPLETED,
            updated_at: new Date().toISOString(),
          })
          .eq('id', journeyId);

        logger.info(`Journey completed: ${journeyId}`);
      }
    } catch (error) {
      logger.error('Error checking journey completion:', error);
    }
  }

  async deleteJourney(journeyId, userId) {
    try {
      // Verify ownership
      const { data: journey } = await supabase
        .from('journeys')
        .select('user_id')
        .eq('id', journeyId)
        .single();

      if (!journey || journey.user_id !== userId) {
        throw new AuthorizationError();
      }

      // Delete journey (cascade will delete journey_days)
      const { error } = await supabase
        .from('journeys')
        .delete()
        .eq('id', journeyId);

      if (error) throw error;

      logger.info(`Journey deleted: ${journeyId}`);
    } catch (error) {
      logger.error('Error deleting journey:', error);
      throw error;
    }
  }
}

export const journeyService = new JourneyService();
export default journeyService;

