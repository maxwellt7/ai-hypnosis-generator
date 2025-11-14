import { Pinecone } from '@pinecone-database/pinecone';
import { logger } from '../utils/logger.js';

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_ENVIRONMENT = process.env.PINECONE_ENVIRONMENT;

if (!PINECONE_API_KEY) {
  logger.error('Pinecone configuration missing');
  throw new Error('PINECONE_API_KEY must be set');
}

// Initialize Pinecone client
export const pinecone = new Pinecone({
  apiKey: PINECONE_API_KEY,
  environment: PINECONE_ENVIRONMENT,
});

// Get index references
export const getUserInfoIndex = () => {
  const indexName = process.env.PINECONE_INDEX_USER_INFO || 'user-information';
  return pinecone.index(indexName);
};

export const getKnowledgeIndex = () => {
  const indexName = process.env.PINECONE_INDEX_KNOWLEDGE || 'core-hypnosis-knowledge';
  return pinecone.index(indexName);
};

export const getCreationsIndex = () => {
  const indexName = process.env.PINECONE_INDEX_CREATIONS || 'past-creations';
  return pinecone.index(indexName);
};

export const getTrendsIndex = () => {
  const indexName = process.env.PINECONE_INDEX_TRENDS || 'interest-trends';
  return pinecone.index(indexName);
};

// Test connection
export const testPineconeConnection = async () => {
  try {
    const indexes = await pinecone.listIndexes();
    logger.info('✅ Pinecone connection successful');
    logger.info(`Found ${indexes.indexes?.length || 0} Pinecone indexes`);
    return true;
  } catch (error) {
    logger.error('❌ Pinecone connection failed:', error.message);
    return false;
  }
};

export default pinecone;

