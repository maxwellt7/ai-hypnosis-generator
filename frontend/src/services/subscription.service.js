import api from './api';

export const subscriptionService = {
  async getStatus() {
    return api.get('/api/subscriptions/status');
  },

  async startCheckout() {
    const data = await api.post('/api/subscriptions/checkout');
    return data.url;
  },

  async openPortal() {
    const data = await api.post('/api/subscriptions/portal');
    return data.url;
  },
};
