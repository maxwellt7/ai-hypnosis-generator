# AI Models Integration Guide - AI Hypnosis Generator

## Overview

This guide covers the integration of all AI models and services used in the hypnosis generator:

1. **OpenAI** (GPT-4) - Main text generation
2. **Anthropic** (Claude) - Alternative text generation & evaluation
3. **DeepSeek** - Specialized analysis
4. **Cohere** - Embeddings generation
5. **ElevenLabs** - Text-to-speech
6. **OpenAI Whisper** - Audio transcription

---

## 1. OpenAI Integration

### Setup

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Go to API Keys
4. Click "Create new secret key"
5. Name it "Hypnosis Generator"
6. Copy and save the key (you won't see it again)

### Models Used

- **GPT-4 Turbo**: Main script generation, knowledge extraction
- **GPT-3.5 Turbo**: Fallback for less critical tasks
- **Whisper**: Audio transcription

### Configuration

```javascript
// config/openai.js
import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Recommended settings for different tasks
export const OPENAI_CONFIGS = {
  knowledgeExtraction: {
    model: 'gpt-4-turbo-preview',
    temperature: 0.7,
    max_tokens: 2000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  },
  
  scriptGeneration: {
    model: 'gpt-4-turbo-preview',
    temperature: 0.75,
    max_tokens: 1500,
    top_p: 0.95,
    frequency_penalty: 0.3,
    presence_penalty: 0.3,
  },
  
  keywordGeneration: {
    model: 'gpt-4-turbo-preview',
    temperature: 0.8,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0.5,
    presence_penalty: 0.2,
  },
  
  awakening: {
    model: 'gpt-4-turbo-preview',
    temperature: 0.6,
    max_tokens: 500,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  },
};
```

### Usage Examples

#### Basic Completion

```javascript
const response = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  messages: [
    {
      role: 'system',
      content: 'You are an expert hypnotherapist...'
    },
    {
      role: 'user',
      content: 'Create an induction script for...'
    }
  ],
  ...OPENAI_CONFIGS.scriptGeneration
});

const script = response.choices[0].message.content;
```

#### Streaming Response

```javascript
const stream = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  messages: [...],
  stream: true,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || '';
  process.stdout.write(content);
}
```

#### JSON Mode

```javascript
const response = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  messages: [
    {
      role: 'system',
      content: 'You are a helpful assistant. Respond in JSON format.'
    },
    {
      role: 'user',
      content: 'Extract keywords from this text...'
    }
  ],
  response_format: { type: 'json_object' },
});

const data = JSON.parse(response.choices[0].message.content);
```

#### Whisper Transcription

```javascript
import fs from 'fs';

const transcription = await openai.audio.transcriptions.create({
  file: fs.createReadStream('audio.mp3'),
  model: 'whisper-1',
  language: 'en',
  response_format: 'json',
  temperature: 0,
});

console.log(transcription.text);
```

### Error Handling

```javascript
async function callOpenAI(messages, config) {
  try {
    const response = await openai.chat.completions.create({
      messages,
      ...config
    });
    return response.choices[0].message.content;
  } catch (error) {
    if (error.status === 429) {
      // Rate limit - wait and retry
      await new Promise(resolve => setTimeout(resolve, 5000));
      return callOpenAI(messages, config);
    } else if (error.status === 500) {
      // Server error - retry once
      return callOpenAI(messages, config);
    } else {
      console.error('OpenAI error:', error);
      throw error;
    }
  }
}
```

### Cost Optimization

```javascript
// Estimate cost before making call
function estimateCost(model, inputTokens, outputTokens) {
  const pricing = {
    'gpt-4-turbo-preview': { input: 0.01, output: 0.03 }, // per 1K tokens
    'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
  };
  
  const rates = pricing[model];
  const cost = (inputTokens / 1000 * rates.input) + 
               (outputTokens / 1000 * rates.output);
  
  return cost;
}

// Use GPT-3.5 for simpler tasks
function selectModel(taskComplexity) {
  if (taskComplexity === 'high') {
    return 'gpt-4-turbo-preview';
  } else {
    return 'gpt-3.5-turbo';
  }
}
```

---

## 2. Anthropic (Claude) Integration

### Setup

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to API Keys
4. Click "Create Key"
5. Copy and save the key

### Models Used

- **Claude 3 Opus**: Highest quality, complex tasks
- **Claude 3 Sonnet**: Balanced performance/cost
- **Claude 3 Haiku**: Fast, simple tasks

### Configuration

```javascript
// config/anthropic.js
import Anthropic from '@anthropic-ai/sdk';

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const ANTHROPIC_CONFIGS = {
  evaluation: {
    model: 'claude-3-opus-20240229',
    max_tokens: 2000,
    temperature: 0.3,
  },
  
  structureDesign: {
    model: 'claude-3-sonnet-20240229',
    max_tokens: 1500,
    temperature: 0.6,
  },
  
  hypnoticElements: {
    model: 'claude-3-sonnet-20240229',
    max_tokens: 1500,
    temperature: 0.7,
  },
  
  induction: {
    model: 'claude-3-sonnet-20240229',
    max_tokens: 1200,
    temperature: 0.7,
  },
  
  deepener: {
    model: 'claude-3-sonnet-20240229',
    max_tokens: 800,
    temperature: 0.7,
  },
};
```

### Usage Examples

#### Basic Message

```javascript
const message = await anthropic.messages.create({
  model: 'claude-3-sonnet-20240229',
  max_tokens: 1500,
  temperature: 0.7,
  system: 'You are an expert hypnotherapist...',
  messages: [
    {
      role: 'user',
      content: 'Create a deepener script for...'
    }
  ]
});

const script = message.content[0].text;
```

#### Streaming

```javascript
const stream = await anthropic.messages.stream({
  model: 'claude-3-sonnet-20240229',
  max_tokens: 1500,
  messages: [...],
});

stream.on('text', (text) => {
  console.log(text);
});

const finalMessage = await stream.finalMessage();
```

#### With System Prompts

```javascript
const message = await anthropic.messages.create({
  model: 'claude-3-opus-20240229',
  max_tokens: 2000,
  temperature: 0.3,
  system: `You are an expert evaluator of hypnosis scripts.
  
  Evaluate based on:
  1. Structure and flow
  2. Language patterns
  3. Hypnotic elements
  4. Personalization
  5. Overall effectiveness
  
  Provide scores (1-10) for each criterion and overall score.`,
  messages: [
    {
      role: 'user',
      content: `Evaluate this script:\n\n${script}`
    }
  ]
});
```

### Error Handling

```javascript
async function callClaude(systemPrompt, userPrompt, config) {
  try {
    const message = await anthropic.messages.create({
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      ...config
    });
    return message.content[0].text;
  } catch (error) {
    if (error.status === 429) {
      // Rate limit
      await new Promise(resolve => setTimeout(resolve, 10000));
      return callClaude(systemPrompt, userPrompt, config);
    } else if (error.status === 529) {
      // Overloaded
      await new Promise(resolve => setTimeout(resolve, 5000));
      return callClaude(systemPrompt, userPrompt, config);
    } else {
      console.error('Anthropic error:', error);
      throw error;
    }
  }
}
```

---

## 3. DeepSeek Integration

### Setup

1. Go to [platform.deepseek.com](https://platform.deepseek.com)
2. Sign up or log in
3. Get API key

### Configuration

```javascript
// config/deepseek.js
import axios from 'axios';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function callDeepSeek(messages, config = {}) {
  const response = await axios.post(
    DEEPSEEK_API_URL,
    {
      model: 'deepseek-chat',
      messages,
      temperature: config.temperature || 0.5,
      max_tokens: config.max_tokens || 1500,
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      }
    }
  );
  
  return response.data.choices[0].message.content;
}
```

### Usage

```javascript
const response = await callDeepSeek([
  {
    role: 'system',
    content: 'You are a neuroscience expert...'
  },
  {
    role: 'user',
    content: 'Explain why this hypnosis approach works...'
  }
], {
  temperature: 0.5,
  max_tokens: 1500
});
```

---

## 4. Cohere Integration (Embeddings)

### Setup

1. Go to [cohere.com](https://cohere.com)
2. Sign up or log in
3. Dashboard → API Keys
4. Copy API key

### Configuration

```javascript
// config/cohere.js
import { CohereClient } from 'cohere-ai';

export const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export const COHERE_CONFIG = {
  model: 'embed-english-v3.0',
  inputType: 'search_document', // or 'search_query'
  embeddingTypes: ['float'],
  dimensions: 1024, // Must match Pinecone
};
```

### Usage Examples

#### Generate Embeddings

```javascript
async function generateEmbedding(text, inputType = 'search_document') {
  const response = await cohere.embed({
    texts: [text],
    model: 'embed-english-v3.0',
    inputType,
    embeddingTypes: ['float']
  });
  
  return response.embeddings.float[0];
}

// For documents (storing in Pinecone)
const docEmbedding = await generateEmbedding(
  'User wants to lose weight and feel confident',
  'search_document'
);

// For queries (searching Pinecone)
const queryEmbedding = await generateEmbedding(
  'weight loss confidence',
  'search_query'
);
```

#### Batch Embeddings

```javascript
async function generateBatchEmbeddings(texts) {
  const response = await cohere.embed({
    texts,
    model: 'embed-english-v3.0',
    inputType: 'search_document',
    embeddingTypes: ['float']
  });
  
  return response.embeddings.float;
}

const texts = [
  'First document...',
  'Second document...',
  'Third document...'
];

const embeddings = await generateBatchEmbeddings(texts);
// Returns array of 1024-dimensional vectors
```

### Error Handling

```javascript
async function safeGenerateEmbedding(text, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await generateEmbedding(text);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

---

## 5. ElevenLabs Integration (TTS)

### Setup

1. Go to [elevenlabs.io](https://elevenlabs.io)
2. Sign up or log in
3. Profile → API Key
4. Copy API key
5. VoiceLab → Choose or create voice → Copy Voice ID

### Configuration

```javascript
// config/elevenlabs.js
import axios from 'axios';

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

export const ELEVENLABS_CONFIG = {
  voiceId: process.env.ELEVENLABS_VOICE_ID,
  model: 'eleven_monolingual_v1',
  voiceSettings: {
    stability: 0.75,
    similarity_boost: 0.75,
    style: 0.5,
    use_speaker_boost: true
  }
};
```

### Usage Examples

#### Generate Speech

```javascript
async function generateSpeech(text, voiceId = ELEVENLABS_CONFIG.voiceId) {
  const response = await axios.post(
    `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
    {
      text,
      model_id: ELEVENLABS_CONFIG.model,
      voice_settings: ELEVENLABS_CONFIG.voiceSettings
    },
    {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      responseType: 'arraybuffer'
    }
  );
  
  return response.data; // Audio buffer
}

// Save to file
import fs from 'fs';

const audioBuffer = await generateSpeech('Welcome to your hypnosis session...');
fs.writeFileSync('output.mp3', audioBuffer);
```

#### Stream Speech

```javascript
async function streamSpeech(text, voiceId, outputPath) {
  const response = await axios.post(
    `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}/stream`,
    {
      text,
      model_id: ELEVENLABS_CONFIG.model,
      voice_settings: ELEVENLABS_CONFIG.voiceSettings
    },
    {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      responseType: 'stream'
    }
  );
  
  const writer = fs.createWriteStream(outputPath);
  response.data.pipe(writer);
  
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}
```

#### Get Voice List

```javascript
async function getVoices() {
  const response = await axios.get(
    `${ELEVENLABS_API_URL}/voices`,
    {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
      }
    }
  );
  
  return response.data.voices;
}

const voices = await getVoices();
voices.forEach(voice => {
  console.log(`${voice.name}: ${voice.voice_id}`);
});
```

#### Optimize for Hypnosis

```javascript
export const HYPNOSIS_VOICE_SETTINGS = {
  // Calm, soothing voice
  calm: {
    stability: 0.85,
    similarity_boost: 0.70,
    style: 0.3,
    use_speaker_boost: true
  },
  
  // Energizing voice (for morning sessions)
  energizing: {
    stability: 0.65,
    similarity_boost: 0.80,
    style: 0.6,
    use_speaker_boost: true
  },
  
  // Deep, relaxing voice (for sleep)
  deep: {
    stability: 0.90,
    similarity_boost: 0.65,
    style: 0.2,
    use_speaker_boost: true
  }
};

async function generateHypnosisAudio(text, mood = 'calm') {
  return await axios.post(
    `${ELEVENLABS_API_URL}/text-to-speech/${ELEVENLABS_CONFIG.voiceId}`,
    {
      text,
      model_id: ELEVENLABS_CONFIG.model,
      voice_settings: HYPNOSIS_VOICE_SETTINGS[mood]
    },
    {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      responseType: 'arraybuffer'
    }
  );
}
```

### Error Handling

```javascript
async function safeGenerateSpeech(text, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await generateSpeech(text);
    } catch (error) {
      if (error.response?.status === 429) {
        // Rate limit
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else if (i === retries - 1) {
        throw error;
      }
    }
  }
}
```

---

## 6. Unified AI Service

Create a unified service that abstracts all AI providers:

```javascript
// services/ai.service.js
import { openai, OPENAI_CONFIGS } from '../config/openai.js';
import { anthropic, ANTHROPIC_CONFIGS } from '../config/anthropic.js';
import { callDeepSeek } from '../config/deepseek.js';
import { cohere } from '../config/cohere.js';
import { generateSpeech } from '../config/elevenlabs.js';

export class AIService {
  // Text generation with fallback
  async generateText(prompt, task, provider = 'openai') {
    try {
      if (provider === 'openai') {
        return await this.callOpenAI(prompt, task);
      } else if (provider === 'anthropic') {
        return await this.callAnthropic(prompt, task);
      } else if (provider === 'deepseek') {
        return await callDeepSeek([
          { role: 'system', content: prompt.system },
          { role: 'user', content: prompt.user }
        ]);
      }
    } catch (error) {
      console.error(`${provider} failed, trying fallback...`);
      // Fallback to different provider
      if (provider === 'openai') {
        return await this.callAnthropic(prompt, task);
      } else {
        return await this.callOpenAI(prompt, task);
      }
    }
  }
  
  async callOpenAI(prompt, task) {
    const config = OPENAI_CONFIGS[task] || OPENAI_CONFIGS.scriptGeneration;
    const response = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user }
      ],
      ...config
    });
    return response.choices[0].message.content;
  }
  
  async callAnthropic(prompt, task) {
    const config = ANTHROPIC_CONFIGS[task] || ANTHROPIC_CONFIGS.structureDesign;
    const message = await anthropic.messages.create({
      system: prompt.system,
      messages: [{ role: 'user', content: prompt.user }],
      ...config
    });
    return message.content[0].text;
  }
  
  async generateEmbedding(text, inputType = 'search_document') {
    const response = await cohere.embed({
      texts: [text],
      model: 'embed-english-v3.0',
      inputType,
      embeddingTypes: ['float']
    });
    return response.embeddings.float[0];
  }
  
  async textToSpeech(text, voiceSettings = 'calm') {
    return await generateSpeech(text, voiceSettings);
  }
}

export const aiService = new AIService();
```

---

## 7. Cost Management

### Track Usage

```javascript
// utils/cost-tracker.js
export class CostTracker {
  constructor() {
    this.costs = {
      openai: 0,
      anthropic: 0,
      deepseek: 0,
      cohere: 0,
      elevenlabs: 0
    };
  }
  
  trackOpenAI(model, inputTokens, outputTokens) {
    const pricing = {
      'gpt-4-turbo-preview': { input: 0.01, output: 0.03 },
      'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
    };
    const rates = pricing[model];
    const cost = (inputTokens / 1000 * rates.input) + 
                 (outputTokens / 1000 * rates.output);
    this.costs.openai += cost;
    return cost;
  }
  
  trackAnthropic(model, inputTokens, outputTokens) {
    const pricing = {
      'claude-3-opus-20240229': { input: 0.015, output: 0.075 },
      'claude-3-sonnet-20240229': { input: 0.003, output: 0.015 },
    };
    const rates = pricing[model];
    const cost = (inputTokens / 1000 * rates.input) + 
                 (outputTokens / 1000 * rates.output);
    this.costs.anthropic += cost;
    return cost;
  }
  
  trackElevenLabs(characters) {
    // $0.30 per 1000 characters
    const cost = (characters / 1000) * 0.30;
    this.costs.elevenlabs += cost;
    return cost;
  }
  
  getTotalCost() {
    return Object.values(this.costs).reduce((a, b) => a + b, 0);
  }
  
  getReport() {
    return {
      ...this.costs,
      total: this.getTotalCost()
    };
  }
}
```

### Set Budgets

```javascript
// middleware/budget.middleware.js
const DAILY_BUDGET = 50; // $50 per day
let dailySpend = 0;
let lastReset = new Date().toDateString();

export function checkBudget(req, res, next) {
  const today = new Date().toDateString();
  
  if (today !== lastReset) {
    dailySpend = 0;
    lastReset = today;
  }
  
  if (dailySpend >= DAILY_BUDGET) {
    return res.status(429).json({
      error: 'Daily budget exceeded',
      message: 'Please try again tomorrow'
    });
  }
  
  next();
}
```

---

## 8. Environment Variables Summary

```bash
# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# DeepSeek
DEEPSEEK_API_KEY=...

# Cohere
COHERE_API_KEY=...

# ElevenLabs
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=...
```

---

## 9. Testing

```javascript
// test-ai-services.js
import { aiService } from './services/ai.service.js';

async function testAll() {
  console.log('Testing AI services...\n');
  
  // Test OpenAI
  console.log('1. Testing OpenAI...');
  const openaiResult = await aiService.generateText({
    system: 'You are a helpful assistant.',
    user: 'Say hello!'
  }, 'scriptGeneration', 'openai');
  console.log('✓ OpenAI:', openaiResult.substring(0, 50) + '...\n');
  
  // Test Anthropic
  console.log('2. Testing Anthropic...');
  const anthropicResult = await aiService.generateText({
    system: 'You are a helpful assistant.',
    user: 'Say hello!'
  }, 'structureDesign', 'anthropic');
  console.log('✓ Anthropic:', anthropicResult.substring(0, 50) + '...\n');
  
  // Test Cohere
  console.log('3. Testing Cohere...');
  const embedding = await aiService.generateEmbedding('test text');
  console.log('✓ Cohere: Generated', embedding.length, 'dimensions\n');
  
  // Test ElevenLabs
  console.log('4. Testing ElevenLabs...');
  const audio = await aiService.textToSpeech('Hello world');
  console.log('✓ ElevenLabs: Generated', audio.length, 'bytes\n');
  
  console.log('All tests passed! ✓');
}

testAll().catch(console.error);
```

---

**Document Version**: 1.0  
**Last Updated**: November 8, 2025  
**Owner**: Max Mayes

