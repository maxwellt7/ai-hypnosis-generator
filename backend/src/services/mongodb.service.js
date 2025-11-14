import { getMongoDb } from '../config/mongodb.js';
import { ObjectId } from 'mongodb';
import { logger } from '../utils/logger.js';
import { NotFoundError } from '../utils/errors.js';

export class MongoDBService {
  // Draft operations
  async saveDraft(draftData) {
    try {
      const db = getMongoDb();
      const drafts = db.collection('drafts');

      const result = await drafts.insertOne({
        ...draftData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      logger.info(`Draft saved: ${result.insertedId}`);
      return result.insertedId;
    } catch (error) {
      logger.error('Error saving draft:', error);
      throw error;
    }
  }

  async getDraft(draftId) {
    try {
      const db = getMongoDb();
      const drafts = db.collection('drafts');

      const draft = await drafts.findOne({ _id: new ObjectId(draftId) });
      
      if (!draft) {
        throw new NotFoundError('Draft');
      }

      return draft;
    } catch (error) {
      logger.error('Error getting draft:', error);
      throw error;
    }
  }

  async getDraftsByJourney(journeyId) {
    try {
      const db = getMongoDb();
      const drafts = db.collection('drafts');

      return await drafts.find({ journeyId }).toArray();
    } catch (error) {
      logger.error('Error getting drafts by journey:', error);
      throw error;
    }
  }

  async updateDraft(draftId, updates) {
    try {
      const db = getMongoDb();
      const drafts = db.collection('drafts');

      const result = await drafts.updateOne(
        { _id: new ObjectId(draftId) },
        {
          $set: {
            ...updates,
            updatedAt: new Date(),
          },
        }
      );

      if (result.matchedCount === 0) {
        throw new NotFoundError('Draft');
      }

      logger.info(`Draft updated: ${draftId}`);
      return result;
    } catch (error) {
      logger.error('Error updating draft:', error);
      throw error;
    }
  }

  async deleteDraft(draftId) {
    try {
      const db = getMongoDb();
      const drafts = db.collection('drafts');

      const result = await drafts.deleteOne({ _id: new ObjectId(draftId) });

      if (result.deletedCount === 0) {
        throw new NotFoundError('Draft');
      }

      logger.info(`Draft deleted: ${draftId}`);
    } catch (error) {
      logger.error('Error deleting draft:', error);
      throw error;
    }
  }

  // Section operations
  async saveSection(sectionData) {
    try {
      const db = getMongoDb();
      const sections = db.collection('sections');

      const result = await sections.insertOne({
        ...sectionData,
        createdAt: new Date(),
      });

      logger.info(`Section saved: ${result.insertedId}`);
      return result.insertedId;
    } catch (error) {
      logger.error('Error saving section:', error);
      throw error;
    }
  }

  async getSection(sectionId) {
    try {
      const db = getMongoDb();
      const sections = db.collection('sections');

      const section = await sections.findOne({ _id: new ObjectId(sectionId) });
      
      if (!section) {
        throw new NotFoundError('Section');
      }

      return section;
    } catch (error) {
      logger.error('Error getting section:', error);
      throw error;
    }
  }

  async getSectionsByDraft(draftId) {
    try {
      const db = getMongoDb();
      const sections = db.collection('sections');

      return await sections.find({ draftId: new ObjectId(draftId) }).toArray();
    } catch (error) {
      logger.error('Error getting sections by draft:', error);
      throw error;
    }
  }

  // Evaluation operations
  async saveEvaluation(evaluationData) {
    try {
      const db = getMongoDb();
      const evaluations = db.collection('evaluations');

      const result = await evaluations.insertOne({
        ...evaluationData,
        createdAt: new Date(),
      });

      logger.info(`Evaluation saved: ${result.insertedId}`);
      return result.insertedId;
    } catch (error) {
      logger.error('Error saving evaluation:', error);
      throw error;
    }
  }

  async getEvaluations(draftId) {
    try {
      const db = getMongoDb();
      const evaluations = db.collection('evaluations');

      return await evaluations
        .find({ draftId: new ObjectId(draftId) })
        .sort({ createdAt: -1 })
        .toArray();
    } catch (error) {
      logger.error('Error getting evaluations:', error);
      throw error;
    }
  }

  async getLatestEvaluation(draftId) {
    try {
      const db = getMongoDb();
      const evaluations = db.collection('evaluations');

      return await evaluations
        .findOne({ draftId: new ObjectId(draftId) })
        .sort({ createdAt: -1 });
    } catch (error) {
      logger.error('Error getting latest evaluation:', error);
      throw error;
    }
  }
}

export const mongodbService = new MongoDBService();
export default mongodbService;

