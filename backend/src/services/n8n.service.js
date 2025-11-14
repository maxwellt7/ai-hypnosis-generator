import axios from 'axios';
import { logger } from '../utils/logger.js';

export class N8NService {
  constructor() {
    this.webhookUrl = process.env.N8N_WEBHOOK_URL;
    this.apiKey = process.env.N8N_API_KEY;
  }

  async triggerJourneyCreation(payload) {
    try {
      if (!this.webhookUrl) {
        logger.warn('n8n webhook URL not configured');
        return null;
      }

      const response = await axios.post(
        `${this.webhookUrl}/journey-create`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          timeout: 30000, // 30 second timeout
        }
      );

      logger.info(`n8n workflow triggered for journey: ${payload.journeyId}`);
      return response.data;
    } catch (error) {
      logger.error('Error triggering n8n workflow:', error.message);
      throw new Error('Failed to trigger journey creation workflow');
    }
  }

  async getWorkflowStatus(journeyId) {
    try {
      if (!this.webhookUrl) {
        logger.warn('n8n webhook URL not configured');
        return null;
      }

      const response = await axios.get(
        `${this.webhookUrl}/journey-status/${journeyId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Error getting workflow status:', error.message);
      throw new Error('Failed to get workflow status');
    }
  }

  async cancelWorkflow(journeyId) {
    try {
      if (!this.webhookUrl) {
        logger.warn('n8n webhook URL not configured');
        return null;
      }

      const response = await axios.post(
        `${this.webhookUrl}/journey-cancel`,
        { journeyId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          timeout: 10000,
        }
      );

      logger.info(`n8n workflow cancelled for journey: ${journeyId}`);
      return response.data;
    } catch (error) {
      logger.error('Error cancelling workflow:', error.message);
      throw new Error('Failed to cancel workflow');
    }
  }
}

export const n8nService = new N8NService();
export default n8nService;

