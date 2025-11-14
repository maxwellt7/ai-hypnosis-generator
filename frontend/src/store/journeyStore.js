import { create } from 'zustand';
import { journeyService } from '../services/journey.service';

export const useJourneyStore = create((set, get) => ({
  journeys: [],
  currentJourney: null,
  isLoading: false,
  error: null,

  // Fetch all journeys
  fetchJourneys: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const journeys = await journeyService.listJourneys(params);
      set({ journeys, isLoading: false });
      return journeys;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Fetch single journey
  fetchJourney: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const journey = await journeyService.getJourney(id);
      set({ currentJourney: journey, isLoading: false });
      return journey;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Create journey
  createJourney: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const journey = await journeyService.createJourney(data);
      set({ 
        journeys: [journey, ...get().journeys],
        currentJourney: journey,
        isLoading: false 
      });
      return journey;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Mark day complete
  markDayComplete: async (journeyId, dayNumber) => {
    try {
      const updatedDay = await journeyService.markDayComplete(journeyId, dayNumber);
      
      // Update current journey if it's loaded
      const currentJourney = get().currentJourney;
      if (currentJourney && currentJourney.id === journeyId) {
        const updatedDays = currentJourney.journey_days.map(day =>
          day.day_number === dayNumber ? { ...day, ...updatedDay } : day
        );
        set({
          currentJourney: {
            ...currentJourney,
            journey_days: updatedDays,
          },
        });
      }
      
      return updatedDay;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Delete journey
  deleteJourney: async (id) => {
    try {
      await journeyService.deleteJourney(id);
      set({
        journeys: get().journeys.filter(j => j.id !== id),
        currentJourney: get().currentJourney?.id === id ? null : get().currentJourney,
      });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useJourneyStore;

