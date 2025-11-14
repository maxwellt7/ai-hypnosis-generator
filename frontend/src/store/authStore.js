import { create } from 'zustand';
import { authService } from '../services/auth.service';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // Initialize auth state from token
  initialize: async () => {
    try {
      if (authService.isAuthenticated()) {
        const user = await authService.getMe();
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      set({ isLoading: false });
    }
  },

  // Login
  login: async (credentials) => {
    const response = await authService.login(credentials);
    set({ user: response.user, isAuthenticated: true });
    return response;
  },

  // Register
  register: async (userData) => {
    const response = await authService.register(userData);
    set({ user: response.user, isAuthenticated: true });
    return response;
  },

  // Logout
  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },

  // Update user
  updateUser: (updater) => {
    set((state) => ({
      user: typeof updater === 'function' ? updater(state.user) : updater
    }));
  },
}));

export default useAuthStore;

