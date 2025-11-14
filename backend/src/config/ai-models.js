import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { CohereClient } from 'cohere-ai';
import { logger } from '../utils/logger.js';

// OpenAI Configuration
export const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

if (!openai) {
  logger.warn('⚠️  OpenAI API key not configured');
}

// Anthropic (Claude) Configuration
export const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

if (!anthropic) {
  logger.warn('⚠️  Anthropic API key not configured');
}

// Cohere (Embeddings) Configuration
export const cohere = process.env.COHERE_API_KEY
  ? new CohereClient({ token: process.env.COHERE_API_KEY })
  : null;

if (!cohere) {
  logger.warn('⚠️  Cohere API key not configured');
}

// ElevenLabs Configuration
export const elevenlabs = {
  apiKey: process.env.ELEVENLABS_API_KEY,
  voiceId: process.env.ELEVENLABS_VOICE_ID,
  baseUrl: 'https://api.elevenlabs.io/v1',
};

if (!elevenlabs.apiKey) {
  logger.warn('⚠️  ElevenLabs API key not configured');
}

// Helper functions for AI operations
export const generateText = async (prompt, model = 'gpt-4', options = {}) => {
  if (!openai) {
    throw new Error('OpenAI not configured');
  }

  const response = await openai.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    temperature: options.temperature || 0.7,
    max_tokens: options.maxTokens || 2000,
    ...options,
  });

  return response.choices[0].message.content;
};

export const generateTextClaude = async (prompt, model = 'claude-3-opus-20240229', options = {}) => {
  if (!anthropic) {
    throw new Error('Anthropic not configured');
  }

  const response = await anthropic.messages.create({
    model,
    max_tokens: options.maxTokens || 2000,
    messages: [{ role: 'user', content: prompt }],
    temperature: options.temperature || 0.7,
    ...options,
  });

  return response.content[0].text;
};

export const generateEmbedding = async (text) => {
  if (!cohere) {
    throw new Error('Cohere not configured');
  }

  const response = await cohere.embed({
    texts: [text],
    model: 'embed-english-v3.0',
    inputType: 'search_document',
    embeddingTypes: ['float']
  });

  return response.embeddings.float[0];
};

export const generateQueryEmbedding = async (text) => {
  if (!cohere) {
    throw new Error('Cohere not configured');
  }

  const response = await cohere.embed({
    texts: [text],
    model: 'embed-english-v3.0',
    inputType: 'search_query',
    embeddingTypes: ['float']
  });

  return response.embeddings.float[0];
};

export default {
  openai,
  anthropic,
  cohere,
  elevenlabs,
  generateText,
  generateTextClaude,
  generateEmbedding,
  generateQueryEmbedding,
};

