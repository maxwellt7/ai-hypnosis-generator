/**
 * N8N Journey Service
 * Handles integration with n8n workflow for journey generation
 */

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://your-n8n.com/webhook/journey-create';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Create a new journey and trigger n8n workflow
 * @param {Object} journeyData - Journey creation data
 * @returns {Promise<Object>} Created journey with ID
 */
export const createJourneyWithN8N = async (journeyData) => {
  try {
    console.log('Creating journey:', journeyData);

    // First, create journey record in backend (to get journeyId)
    const backendResponse = await fetch(`${API_BASE_URL}/api/journeys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        goal: journeyData.goal,
        intention: journeyData.intention,
        duration: journeyData.duration || 15,
        userProfile: journeyData.userProfile
      })
    });

    if (!backendResponse.ok) {
      throw new Error('Failed to create journey in backend');
    }

    const journey = await backendResponse.json();
    console.log('Journey created in backend:', journey);

    // Prepare n8n payload
    const n8nPayload = {
      journeyId: journey.id,
      userId: journey.userId,
      goal: journeyData.goal,
      intention: journeyData.intention,
      duration: journeyData.duration || 15,
      userProfile: {
        name: journey.userName || 'User',
        preference_time_of_day: journeyData.userProfile?.timePreference || 'evening',
        preference_duration: journeyData.duration || 15,
        onboarding_data: journeyData.userProfile?.onboardingData || {}
      },
      userContext: journeyData.userContext || []
    };

    console.log('Triggering n8n workflow:', n8nPayload);

    // Trigger n8n workflow
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(n8nPayload)
    });

    if (!n8nResponse.ok) {
      console.error('N8N workflow trigger failed:', n8nResponse.status);
      throw new Error('Failed to trigger journey generation workflow');
    }

    const n8nResult = await n8nResponse.json();
    console.log('N8N workflow triggered:', n8nResult);

    return {
      success: true,
      journeyId: journey.id,
      message: 'Journey generation started',
      journey: journey
    };

  } catch (error) {
    console.error('Error creating journey with n8n:', error);
    throw error;
  }
};

/**
 * Poll journey status until completion
 * @param {string} journeyId - Journey ID to poll
 * @param {function} onUpdate - Callback for status updates
 * @param {number} maxAttempts - Maximum poll attempts
 * @returns {Promise<Object>} Complete journey data
 */
export const pollJourneyStatus = async (
  journeyId, 
  onUpdate = () => {}, 
  maxAttempts = 180 // 15 minutes at 5-second intervals
) => {
  let attempts = 0;

  const poll = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/journeys/${journeyId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch journey status');
      }

      const journey = await response.json();
      console.log(`Poll attempt ${attempts + 1}: Status = ${journey.status}`);

      // Call update callback
      onUpdate(journey);

      // Check if complete
      if (journey.status === 'completed') {
        console.log('Journey generation complete!');
        return journey;
      }

      // Check if error
      if (journey.status === 'error' || journey.status === 'failed') {
        throw new Error(journey.error || 'Journey generation failed');
      }

      // Check max attempts
      if (attempts >= maxAttempts) {
        throw new Error('Journey generation timed out');
      }

      // Continue polling
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      return poll();

    } catch (error) {
      console.error('Error polling journey status:', error);
      throw error;
    }
  };

  return poll();
};

/**
 * Get journey details
 * @param {string} journeyId - Journey ID
 * @returns {Promise<Object>} Journey details
 */
export const getJourney = async (journeyId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/journeys/${journeyId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch journey');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching journey:', error);
    throw error;
  }
};

/**
 * Get all user journeys
 * @returns {Promise<Array>} List of journeys
 */
export const getUserJourneys = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/journeys`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch journeys');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching journeys:', error);
    throw error;
  }
};

/**
 * Cancel journey generation
 * @param {string} journeyId - Journey ID to cancel
 * @returns {Promise<Object>} Cancellation result
 */
export const cancelJourney = async (journeyId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/journeys/${journeyId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to cancel journey');
    }

    return await response.json();
  } catch (error) {
    console.error('Error cancelling journey:', error);
    throw error;
  }
};

export default {
  createJourneyWithN8N,
  pollJourneyStatus,
  getJourney,
  getUserJourneys,
  cancelJourney
};

