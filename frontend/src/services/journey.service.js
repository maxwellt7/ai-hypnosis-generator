import api from './api';

export const journeyService = {
  async createJourney(data) {
    const response = await api.post('/api/journeys', data);
    return response.data.journey;
  },

  async listJourneys(params = {}) {
    const response = await api.get('/api/journeys', { params });
    return response.data.journeys;
  },

  async getJourney(id) {
    const response = await api.get(`/api/journeys/${id}`);
    return response.data.journey;
  },

  async getJourneyDay(journeyId, dayNumber) {
    const response = await api.get(`/api/journeys/${journeyId}/days/${dayNumber}`);
    return response.data.day;
  },

  async markDayComplete(journeyId, dayNumber) {
    const response = await api.post(`/api/journeys/${journeyId}/days/${dayNumber}/complete`);
    return response.data.day;
  },

  async deleteJourney(id) {
    await api.delete(`/api/journeys/${id}`);
  },
};

export default journeyService;

