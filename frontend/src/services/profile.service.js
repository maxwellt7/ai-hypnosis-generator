import api from './api';

export const profileService = {
  async getProfile() {
    const response = await api.get('/api/profile');
    return response.data.profile;
  },

  async updateProfile(data) {
    const response = await api.put('/api/profile', data);
    return response.data.profile;
  },

  async completeOnboarding(data) {
    const response = await api.post('/api/profile/onboarding', data);
    return response.data.profile;
  },

  async getOnboarding() {
    const response = await api.get('/api/profile/onboarding');
    return response.data;
  },
};

export default profileService;

