import { MongoClient } from 'mongodb';
import { logger } from '../utils/logger.js';

const MONGODB_URI = process.env.MONGODB_SCRIPTS_URI;

if (!MONGODB_URI) {
  logger.error('MongoDB configuration missing');
  throw new Error('MONGODB_SCRIPTS_URI must be set');
}

let client;
let db;

export const connectMongoDB = async () => {
  try {
    if (!client) {
      client = new MongoClient(MONGODB_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
      });
      
      await client.connect();
      db = client.db('hypnosis-scripts');
      
      logger.info('✅ MongoDB connection successful');
    }
    return db;
  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
};

export const getMongoDb = () => {
  if (!db) {
    throw new Error('MongoDB not connected. Call connectMongoDB() first.');
  }
  return db;
};

export const closeMongoConnection = async () => {
  if (client) {
    await client.close();
    client = null;
    db = null;
    logger.info('MongoDB connection closed');
  }
};

// Test connection
export const testMongoConnection = async () => {
  try {
    const database = await connectMongoDB();
    await database.admin().ping();
    logger.info('✅ MongoDB ping successful');
    return true;
  } catch (error) {
    logger.error('❌ MongoDB ping failed:', error.message);
    return false;
  }
};

export default { connectMongoDB, getMongoDb, closeMongoConnection, testMongoConnection };

