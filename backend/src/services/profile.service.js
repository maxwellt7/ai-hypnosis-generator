import { supabase } from '../config/supabase.js';
import { pineconeService } from './pinecone.service.js';
import { logger } from '../utils/logger.js';
import { NotFoundError } from '../utils/errors.js';

export class ProfileService {
  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw new NotFoundError('Profile');

      return data;
    } catch (error) {
      logger.error('Error getting profile:', error);
      throw error;
    }
  }

  async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      logger.info(`Profile updated for user: ${userId}`);
      return data;
    } catch (error) {
      logger.error('Error updating profile:', error);
      throw error;
    }
  }

  async completeOnboarding(userId, onboardingData) {
    try {
      // Update profile with onboarding data
      const { data, error } = await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
          onboarding_data: onboardingData,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      // Store onboarding data in Pinecone for semantic search
      await pineconeService.upsertUserInformation(userId, {
        type: 'onboarding',
        data: onboardingData,
        metadata: {
          completed_at: new Date().toISOString(),
        },
      });

      logger.info(`Onboarding completed for user: ${userId}`);
      return data;
    } catch (error) {
      logger.error('Error completing onboarding:', error);
      throw error;
    }
  }

  async getOnboardingData(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_data, onboarding_completed')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      logger.error('Error getting onboarding data:', error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();
export default profileService;

