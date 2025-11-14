import { getUserInfoIndex, getKnowledgeIndex, getCreationsIndex, getTrendsIndex } from '../config/pinecone.js';
import { generateEmbedding, generateQueryEmbedding } from '../config/ai-models.js';
import { logger } from '../utils/logger.js';

export class PineconeService {
  constructor() {
    this.userInfoIndex = getUserInfoIndex();
    this.knowledgeIndex = getKnowledgeIndex();
    this.creationsIndex = getCreationsIndex();
    this.trendsIndex = getTrendsIndex();
  }

  // User Information Operations
  async upsertUserInformation(userId, data) {
    try {
      const text = this.formatUserData(data);
      const embedding = await generateEmbedding(text);

      const vectorId = `${userId}-${data.type}-${Date.now()}`;
      
      await this.userInfoIndex.namespace(`user-${userId}`).upsert([
        {
          id: vectorId,
          values: embedding,
          metadata: {
            user_id: userId,
            data_type: data.type,
            timestamp: new Date().toISOString(),
            raw_text: text,
            ...data.metadata,
          },
        },
      ]);

      logger.info(`User information stored in Pinecone: ${userId}`);
      return vectorId;
    } catch (error) {
      logger.error('Error upserting user information:', error);
      throw error;
    }
  }

  async searchUserInformation(userId, query, topK = 5) {
    try {
      const embedding = await generateQueryEmbedding(query);

      const results = await this.userInfoIndex.namespace(`user-${userId}`).query({
        vector: embedding,
        topK,
        includeMetadata: true,
      });

      return results.matches;
    } catch (error) {
      logger.error('Error searching user information:', error);
      throw error;
    }
  }

  // Knowledge Base Operations
  async searchKnowledgeBase(query, namespace = 'general', topK = 10) {
    try {
      const embedding = await generateQueryEmbedding(query);

      const results = await this.knowledgeIndex.namespace(namespace).query({
        vector: embedding,
        topK,
        includeMetadata: true,
      });

      return results.matches;
    } catch (error) {
      logger.error('Error searching knowledge base:', error);
      throw error;
    }
  }

  async upsertKnowledge(namespace, id, text, metadata = {}) {
    try {
      const embedding = await generateEmbedding(text);

      await this.knowledgeIndex.namespace(namespace).upsert([
        {
          id,
          values: embedding,
          metadata: {
            ...metadata,
            text,
            timestamp: new Date().toISOString(),
          },
        },
      ]);

      logger.info(`Knowledge stored: ${namespace}/${id}`);
    } catch (error) {
      logger.error('Error upserting knowledge:', error);
      throw error;
    }
  }

  // Past Creations Operations
  async upsertCreation(journeyId, data) {
    try {
      const text = this.formatCreationData(data);
      const embedding = await generateEmbedding(text);
      const namespace = data.interest || 'general';

      await this.creationsIndex.namespace(namespace).upsert([
        {
          id: journeyId,
          values: embedding,
          metadata: {
            journey_id: journeyId,
            user_id: data.userId,
            interest: data.interest,
            goal: data.goal,
            rating: data.rating,
            duration: data.duration,
            created_date: new Date().toISOString(),
            script_elements: JSON.stringify(data.scriptElements || {}),
          },
        },
      ]);

      logger.info(`Creation stored: ${journeyId}`);
    } catch (error) {
      logger.error('Error upserting creation:', error);
      throw error;
    }
  }

  async searchSimilarCreations(interest, query, topK = 5, minRating = 8) {
    try {
      const embedding = await generateQueryEmbedding(query);

      const results = await this.creationsIndex.namespace(interest).query({
        vector: embedding,
        topK,
        includeMetadata: true,
        filter: {
          rating: { $gte: minRating },
        },
      });

      return results.matches;
    } catch (error) {
      logger.error('Error searching similar creations:', error);
      throw error;
    }
  }

  // Trends Operations
  async upsertTrend(interest, data) {
    try {
      const text = this.formatTrendData(data);
      const embedding = await generateEmbedding(text);
      const trendId = `${interest}-${data.subInterest}-${Date.now()}`;

      await this.trendsIndex.namespace(interest).upsert([
        {
          id: trendId,
          values: embedding,
          metadata: {
            interest,
            sub_interest: data.subInterest,
            duration: data.duration,
            popularity: data.popularity || 1,
            success_rate: data.successRate || 0,
            timestamp: new Date().toISOString(),
          },
        },
      ]);

      logger.info(`Trend stored: ${trendId}`);
    } catch (error) {
      logger.error('Error upserting trend:', error);
      throw error;
    }
  }

  // Utility functions
  formatUserData(data) {
    if (data.type === 'onboarding') {
      return Object.entries(data.data)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join('\n');
    }
    return JSON.stringify(data);
  }

  formatCreationData(data) {
    return `
      Goal: ${data.goal}
      Intention: ${data.intention || 'Not specified'}
      Interest: ${data.interest}
      Duration: ${data.duration} minutes
      Rating: ${data.rating}/10
    `.trim();
  }

  formatTrendData(data) {
    return `
      Interest: ${data.interest}
      Sub-interest: ${data.subInterest}
      Duration: ${data.duration} minutes
      Popularity: ${data.popularity}
    `.trim();
  }
}

export const pineconeService = new PineconeService();
export default pineconeService;

