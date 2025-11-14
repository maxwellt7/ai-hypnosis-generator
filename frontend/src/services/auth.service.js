import api from './api';

export const authService = {
  async register(data) {
    const response = await api.post('/api/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/api/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  async logout() {
    await api.post('/api/auth/logout');
    localStorage.removeItem('token');
  },

  async getMe() {
    const response = await api.get('/api/auth/me');
    return response.data.user;
  },

  async changePassword(data) {
    const response = await api.post('/api/auth/change-password', data);
    return response.data;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};

export default authService;

