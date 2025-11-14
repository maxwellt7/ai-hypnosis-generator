import { supabase } from '../config/supabase.js';
import { logger } from '../utils/logger.js';
import { NotFoundError } from '../utils/errors.js';

export class StatsService {
  async getUserStats(userId) {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw new NotFoundError('User stats');

      return data;
    } catch (error) {
      logger.error('Error getting user stats:', error);
      throw error;
    }
  }

  async getStreakInfo(userId) {
    try {
      const { data: stats, error } = await supabase
        .from('user_stats')
        .select('current_streak, longest_streak, last_session_date')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      // Calculate days until streak break
      const today = new Date();
      const lastSession = stats.last_session_date 
        ? new Date(stats.last_session_date) 
        : null;

      let daysUntilBreak = null;
      if (lastSession) {
        const tomorrow = new Date(lastSession);
        tomorrow.setDate(tomorrow.getDate() + 2); // Streak breaks if no session tomorrow
        const diffTime = tomorrow - today;
        daysUntilBreak = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      }

      return {
        currentStreak: stats.current_streak,
        longestStreak: stats.longest_streak,
        lastSessionDate: stats.last_session_date,
        daysUntilBreak,
      };
    } catch (error) {
      logger.error('Error getting streak info:', error);
      throw error;
    }
  }

  async getListeningHistory(userId, days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('journey_days')
        .select(`
          completed_at,
          duration_seconds,
          journey_id,
          journeys!inner(user_id)
        `)
        .eq('journeys.user_id', userId)
        .eq('completed', true)
        .gte('completed_at', startDate.toISOString())
        .order('completed_at', { ascending: true });

      if (error) throw error;

      // Group by date
      const historyByDate = {};
      
      data.forEach(day => {
        const date = day.completed_at.split('T')[0];
        if (!historyByDate[date]) {
          historyByDate[date] = {
            date,
            totalMinutes: 0,
            sessions: 0,
          };
        }
        historyByDate[date].totalMinutes += Math.floor((day.duration_seconds || 0) / 60);
        historyByDate[date].sessions += 1;
      });

      return Object.values(historyByDate);
    } catch (error) {
      logger.error('Error getting listening history:', error);
      throw error;
    }
  }

  async getJourneyStats(userId) {
    try {
      const { data: journeys, error } = await supabase
        .from('journeys')
        .select(`
          id,
          status,
          created_at,
          journey_days (
            completed
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      const stats = {
        totalJourneys: journeys.length,
        completedJourneys: 0,
        inProgressJourneys: 0,
        totalDaysCompleted: 0,
        completionRate: 0,
      };

      journeys.forEach(journey => {
        const completedDays = journey.journey_days.filter(d => d.completed).length;
        const totalDays = journey.journey_days.length;

        stats.totalDaysCompleted += completedDays;

        if (completedDays === totalDays && totalDays > 0) {
          stats.completedJourneys += 1;
        } else if (completedDays > 0) {
          stats.inProgressJourneys += 1;
        }
      });

      if (stats.totalJourneys > 0) {
        stats.completionRate = (stats.completedJourneys / stats.totalJourneys * 100).toFixed(1);
      }

      return stats;
    } catch (error) {
      logger.error('Error getting journey stats:', error);
      throw error;
    }
  }

  async getTimeOfDayDistribution(userId, days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('journey_days')
        .select(`
          completed_at,
          journeys!inner(user_id)
        `)
        .eq('journeys.user_id', userId)
        .eq('completed', true)
        .gte('completed_at', startDate.toISOString());

      if (error) throw error;

      const distribution = {
        morning: 0,   // 6am-12pm
        afternoon: 0, // 12pm-6pm
        evening: 0,   // 6pm-10pm
        night: 0,     // 10pm-6am
      };

      data.forEach(day => {
        const hour = new Date(day.completed_at).getHours();
        
        if (hour >= 6 && hour < 12) {
          distribution.morning += 1;
        } else if (hour >= 12 && hour < 18) {
          distribution.afternoon += 1;
        } else if (hour >= 18 && hour < 22) {
          distribution.evening += 1;
        } else {
          distribution.night += 1;
        }
      });

      return distribution;
    } catch (error) {
      logger.error('Error getting time distribution:', error);
      throw error;
    }
  }
}

export const statsService = new StatsService();
export default statsService;

