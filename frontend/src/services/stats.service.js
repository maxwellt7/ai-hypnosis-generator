import api from './api';

export const statsService = {
  async getStats() {
    const response = await api.get('/api/stats');
    return response.data.stats;
  },

  async getStreaks() {
    const response = await api.get('/api/stats/streaks');
    return response.data;
  },

  async getHistory(days = 30) {
    const response = await api.get('/api/stats/history', { params: { days } });
    return response.data.history;
  },

  async getJourneyStats() {
    const response = await api.get('/api/stats/journeys');
    return response.data;
  },

  async getTimeDistribution(days = 30) {
    const response = await api.get('/api/stats/time-distribution', { params: { days } });
    return response.data.distribution;
  },
};

export default statsService;

