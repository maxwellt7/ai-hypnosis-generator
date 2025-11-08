import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
  },
  
  mongodb: {
    uri: process.env.MONGODB_URI,
    scriptsUri: process.env.MONGODB_SCRIPTS_URI,
  },
  
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
    indices: {
      userInfo: process.env.PINECONE_INDEX_USER_INFO || 'user-information',
      knowledge: process.env.PINECONE_INDEX_KNOWLEDGE || 'core-hypnosis-knowledge',
      creations: process.env.PINECONE_INDEX_CREATIONS || 'past-creations',
      trends: process.env.PINECONE_INDEX_TRENDS || 'interest-trends',
    },
  },
  
  ai: {
    openaiKey: process.env.OPENAI_API_KEY,
    anthropicKey: process.env.ANTHROPIC_API_KEY,
    deepseekKey: process.env.DEEPSEEK_API_KEY,
    cohereKey: process.env.COHERE_API_KEY,
  },
  
  elevenlabs: {
    apiKey: process.env.ELEVENLABS_API_KEY,
    voiceId: process.env.ELEVENLABS_VOICE_ID,
  },
  
  google: {
    credentialsJson: process.env.GOOGLE_CREDENTIALS_JSON,
    driveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID,
  },
  
  gmail: {
    user: process.env.GMAIL_USER,
    appPassword: process.env.GMAIL_APP_PASSWORD,
  },
  
  n8n: {
    webhookUrl: process.env.N8N_WEBHOOK_URL,
    apiKey: process.env.N8N_API_KEY,
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'change-this-secret-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
};

// Validate required environment variables
export function validateEnv() {
  const required = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_KEY',
    'JWT_SECRET',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

