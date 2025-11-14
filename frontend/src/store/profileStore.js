import { create } from 'zustand';
import { profileService } from '../services/profile.service';

export const useProfileStore = create((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,

  // Fetch profile
  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const profile = await profileService.getProfile();
      set({ profile, isLoading: false });
      return profile;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Update profile
  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await profileService.updateProfile(data);
      set({ profile, isLoading: false });
      return profile;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Complete onboarding
  completeOnboarding: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await profileService.completeOnboarding(data);
      set({ profile, isLoading: false });
      return profile;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useProfileStore;

