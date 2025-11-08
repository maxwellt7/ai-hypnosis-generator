# Backend Project Plan - AI Hypnosis Generator

## 🎯 Technology Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: JavaScript (ES6+)
- **Primary Database**: Supabase (PostgreSQL)
- **Script Storage**: MongoDB Atlas
- **Vector Database**: Pinecone
- **Authentication**: JWT + bcrypt
- **Validation**: Joi or Zod
- **Email**: Nodemailer (Gmail)
- **File Storage**: Google Drive API
- **AI Integration**: OpenAI, Anthropic, DeepSeek SDKs
- **Embeddings**: Cohere SDK
- **Audio**: ElevenLabs SDK
- **Workflow**: n8n webhook integration
- **Deployment**: Railway
- **Monitoring**: Winston (logging)

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Database connections
│   │   ├── pinecone.js          # Pinecone client
│   │   ├── mongodb.js           # MongoDB client
│   │   ├── supabase.js          # Supabase client
│   │   ├── ai-models.js         # AI SDK configurations
│   │   ├── google-apis.js       # Google Drive/Gmail setup
│   │   └── env.js               # Environment validation
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Profile.js
│   │   ├── Journey.js
│   │   ├── JourneyDay.js
│   │   ├── JournalEntry.js
│   │   └── UserStats.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── profile.routes.js
│   │   ├── journey.routes.js
│   │   ├── journal.routes.js
│   │   ├── stats.routes.js
│   │   ├── admin.routes.js
│   │   └── webhook.routes.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── profile.controller.js
│   │   ├── journey.controller.js
│   │   ├── journal.controller.js
│   │   ├── stats.controller.js
│   │   ├── admin.controller.js
│   │   └── webhook.controller.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── profile.service.js
│   │   ├── journey.service.js
│   │   ├── journal.service.js
│   │   ├── stats.service.js
│   │   ├── pinecone.service.js
│   │   ├── mongodb.service.js
│   │   ├── n8n.service.js
│   │   ├── email.service.js
│   │   ├── drive.service.js
│   │   └── ai.service.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── admin.middleware.js
│   │   ├── validation.middleware.js
│   │   ├── error.middleware.js
│   │   ├── rateLimit.middleware.js
│   │   └── logger.middleware.js
│   │
│   ├── utils/
│   │   ├── logger.js
│   │   ├── errors.js
│   │   ├── validators.js
│   │   ├── helpers.js
│   │   └── constants.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── profile.validator.js
│   │   ├── journey.validator.js
│   │   └── journal.validator.js
│   │
│   └── app.js                   # Express app setup
│
├── scripts/
│   ├── setup-database.js        # Initialize Supabase tables
│   ├── setup-pinecone.js        # Create Pinecone indices
│   ├── seed-knowledge.js        # Seed hypnosis knowledge base
│   └── migrate.js               # Database migrations
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── .gitignore
├── package.json
├── server.js                    # Entry point
└── README.md
```

---

## 🔐 Authentication System

### JWT Strategy

```javascript
// services/auth.service.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';

export class AuthService {
  async register({ email, password, name }) {
    // Check if user exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      throw new Error('User already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert({ email, password_hash: passwordHash, name })
      .select()
      .single();

    if (error) throw error;

    // Create profile
    await supabase
      .from('profiles')
      .insert({ user_id: user.id });

    // Create stats
    await supabase
      .from('user_stats')
      .insert({ user_id: user.id });

    // Generate token
    const token = this.generateToken(user);

    return { user: this.sanitizeUser(user), token };
  }

  async login({ email, password }) {
    // Get user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user);

    return { user: this.sanitizeUser(user), token };
  }

  generateToken(user) {
    return jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  sanitizeUser(user) {
    const { password_hash, ...sanitized } = user;
    return sanitized;
  }
}
```

### Auth Middleware

```javascript
// middleware/auth.middleware.js
import { AuthService } from '../services/auth.service.js';

const authService = new AuthService();

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = authService.verifyToken(token);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', req.userId)
      .single();

    if (!user?.is_admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Access denied' });
  }
};
```

---

## 📊 Database Services

### Supabase Service

```javascript
// services/profile.service.js
import { supabase } from '../config/supabase.js';
import { pineconeService } from './pinecone.service.js';

export class ProfileService {
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async completeOnboarding(userId, onboardingData) {
    // Save to Supabase
    const { data, error } = await supabase
      .from('profiles')
      .update({
        onboarding_completed: true,
        onboarding_data: onboardingData,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    // Store in Pinecone for semantic search
    await pineconeService.upsertUserInformation(userId, {
      type: 'onboarding',
      data: onboardingData
    });

    return data;
  }
}
```

### Pinecone Service

```javascript
// services/pinecone.service.js
import { Pinecone } from '@pinecone-database/pinecone';
import { CohereClient } from 'cohere-ai';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export class PineconeService {
  constructor() {
    this.userInfoIndex = pinecone.index(process.env.PINECONE_INDEX_USER_INFO);
    this.knowledgeIndex = pinecone.index(process.env.PINECONE_INDEX_KNOWLEDGE);
    this.creationsIndex = pinecone.index(process.env.PINECONE_INDEX_CREATIONS);
    this.trendsIndex = pinecone.index(process.env.PINECONE_INDEX_TRENDS);
  }

  async generateEmbedding(text) {
    const response = await cohere.embed({
      texts: [text],
      model: 'embed-english-v3.0',
      inputType: 'search_document',
      embeddingTypes: ['float']
    });
    
    return response.embeddings.float[0];
  }

  async upsertUserInformation(userId, data) {
    const text = this.formatUserData(data);
    const embedding = await this.generateEmbedding(text);

    await this.userInfoIndex.namespace(`user-${userId}`).upsert([
      {
        id: `${userId}-${data.type}-${Date.now()}`,
        values: embedding,
        metadata: {
          user_id: userId,
          data_type: data.type,
          timestamp: new Date().toISOString(),
          raw_text: text,
          ...data.metadata
        }
      }
    ]);
  }

  async searchUserInformation(userId, query, topK = 5) {
    const embedding = await this.generateEmbedding(query);

    const results = await this.userInfoIndex.namespace(`user-${userId}`).query({
      vector: embedding,
      topK,
      includeMetadata: true
    });

    return results.matches;
  }

  async searchKnowledgeBase(query, namespace, topK = 10) {
    const embedding = await this.generateEmbedding(query);

    const results = await this.knowledgeIndex.namespace(namespace).query({
      vector: embedding,
      topK,
      includeMetadata: true
    });

    return results.matches;
  }

  async upsertCreation(journeyId, data) {
    const text = this.formatCreationData(data);
    const embedding = await this.generateEmbedding(text);

    await this.creationsIndex.namespace(data.interest).upsert([
      {
        id: journeyId,
        values: embedding,
        metadata: {
          journey_id: journeyId,
          user_id: data.userId,
          interest: data.interest,
          rating: data.rating,
          duration: data.duration,
          created_date: new Date().toISOString(),
          script_elements: JSON.stringify(data.scriptElements)
        }
      }
    ]);
  }

  async searchSimilarCreations(interest, query, topK = 5) {
    const embedding = await this.generateEmbedding(query);

    const results = await this.creationsIndex.namespace(interest).query({
      vector: embedding,
      topK,
      includeMetadata: true,
      filter: { rating: { $gte: 8 } } // Only high-quality creations
    });

    return results.matches;
  }

  formatUserData(data) {
    // Convert user data to searchable text
    if (data.type === 'onboarding') {
      return Object.entries(data.data)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
    }
    return JSON.stringify(data);
  }

  formatCreationData(data) {
    return `
      Goal: ${data.goal}
      Intention: ${data.intention}
      Interest: ${data.interest}
      Duration: ${data.duration} minutes
      Elements: ${data.scriptElements.join(', ')}
    `.trim();
  }
}

export const pineconeService = new PineconeService();
```

### MongoDB Service (Script Staging)

```javascript
// services/mongodb.service.js
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_SCRIPTS_URI);
let db;

export class MongoDBService {
  async connect() {
    if (!db) {
      await client.connect();
      db = client.db('hypnosis-scripts');
    }
    return db;
  }

  async saveDraft(draftData) {
    const database = await this.connect();
    const drafts = database.collection('drafts');

    const result = await drafts.insertOne({
      ...draftData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return result.insertedId;
  }

  async getDraft(draftId) {
    const database = await this.connect();
    const drafts = database.collection('drafts');
    return await drafts.findOne({ _id: draftId });
  }

  async updateDraft(draftId, updates) {
    const database = await this.connect();
    const drafts = database.collection('drafts');

    return await drafts.updateOne(
      { _id: draftId },
      { $set: { ...updates, updatedAt: new Date() } }
    );
  }

  async saveSection(sectionData) {
    const database = await this.connect();
    const sections = database.collection('sections');

    const result = await sections.insertOne({
      ...sectionData,
      createdAt: new Date()
    });

    return result.insertedId;
  }

  async getSection(sectionId) {
    const database = await this.connect();
    const sections = database.collection('sections');
    return await sections.findOne({ _id: sectionId });
  }

  async getSectionsByDraft(draftId) {
    const database = await this.connect();
    const sections = database.collection('sections');
    return await sections.find({ draftId }).toArray();
  }

  async saveEvaluation(evaluationData) {
    const database = await this.connect();
    const evaluations = database.collection('evaluations');

    const result = await evaluations.insertOne({
      ...evaluationData,
      createdAt: new Date()
    });

    return result.insertedId;
  }

  async getEvaluations(draftId) {
    const database = await this.connect();
    const evaluations = database.collection('evaluations');
    return await evaluations.find({ draftId }).toArray();
  }
}

export const mongodbService = new MongoDBService();
```

---

## 🚀 Journey Creation Flow

### Journey Service

```javascript
// services/journey.service.js
import { supabase } from '../config/supabase.js';
import { n8nService } from './n8n.service.js';
import { pineconeService } from './pinecone.service.js';

export class JourneyService {
  async createJourney(userId, journeyData) {
    // 1. Create journey record
    const { data: journey, error } = await supabase
      .from('journeys')
      .insert({
        user_id: userId,
        goal: journeyData.goal,
        intention: journeyData.intention,
        status: 'creating',
        journey_data: {}
      })
      .select()
      .single();

    if (error) throw error;

    // 2. Get user profile and onboarding data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    // 3. Search user information in Pinecone
    const userContext = await pineconeService.searchUserInformation(
      userId,
      `${journeyData.goal} ${journeyData.intention}`,
      5
    );

    // 4. Trigger n8n workflow
    await n8nService.triggerJourneyCreation({
      journeyId: journey.id,
      userId,
      goal: journeyData.goal,
      intention: journeyData.intention,
      duration: journeyData.duration || profile.preference_duration || 15,
      userProfile: profile,
      userContext: userContext.map(m => m.metadata)
    });

    return journey;
  }

  async getJourney(journeyId, userId) {
    const { data, error } = await supabase
      .from('journeys')
      .select(`
        *,
        journey_days (*)
      `)
      .eq('id', journeyId)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async listJourneys(userId) {
    const { data, error } = await supabase
      .from('journeys')
      .select('*, journey_days (id, day_number, completed)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async markDayComplete(journeyId, dayNumber, userId) {
    // Get the day
    const { data: day, error: dayError } = await supabase
      .from('journey_days')
      .select('*, journeys!inner(user_id)')
      .eq('journey_id', journeyId)
      .eq('day_number', dayNumber)
      .single();

    if (dayError) throw dayError;
    if (day.journeys.user_id !== userId) {
      throw new Error('Unauthorized');
    }

    // Mark complete
    const { data: updated, error } = await supabase
      .from('journey_days')
      .update({
        completed: true,
        completed_at: new Date().toISOString()
      })
      .eq('id', day.id)
      .select()
      .single();

    if (error) throw error;

    // Update user stats
    await this.updateStats(userId, day.duration_seconds);

    return updated;
  }

  async updateStats(userId, durationSeconds) {
    const durationMinutes = Math.floor(durationSeconds / 60);
    const today = new Date().toISOString().split('T')[0];

    const { data: stats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    let newStreak = stats.current_streak;
    const lastSession = stats.last_session_date;

    if (lastSession) {
      const lastDate = new Date(lastSession);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Same day, no change to streak
      } else if (diffDays === 1) {
        // Consecutive day, increment streak
        newStreak += 1;
      } else {
        // Streak broken, reset
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    const longestStreak = Math.max(stats.longest_streak, newStreak);

    await supabase
      .from('user_stats')
      .update({
        current_streak: newStreak,
        longest_streak: longestStreak,
        total_minutes_listened: stats.total_minutes_listened + durationMinutes,
        total_sessions: stats.total_sessions + 1,
        last_session_date: today
      })
      .eq('user_id', userId);
  }
}

export const journeyService = new JourneyService();
```

### n8n Service

```javascript
// services/n8n.service.js
import axios from 'axios';

export class N8NService {
  constructor() {
    this.webhookUrl = process.env.N8N_WEBHOOK_URL;
    this.apiKey = process.env.N8N_API_KEY;
  }

  async triggerJourneyCreation(payload) {
    try {
      const response = await axios.post(
        `${this.webhookUrl}/journey-create`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('n8n trigger error:', error);
      throw new Error('Failed to trigger workflow');
    }
  }

  async getWorkflowStatus(journeyId) {
    try {
      const response = await axios.get(
        `${this.webhookUrl}/journey-status/${journeyId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('n8n status check error:', error);
      throw new Error('Failed to check workflow status');
    }
  }
}

export const n8nService = new N8NService();
```

---

## 🎣 Webhook Handler

### Webhook Controller

```javascript
// controllers/webhook.controller.js
import { supabase } from '../config/supabase.js';
import { pineconeService } from '../services/pinecone.service.js';
import { emailService } from '../services/email.service.js';

export class WebhookController {
  async handleJourneyComplete(req, res) {
    try {
      const { journeyId, userId, days, metadata } = req.body;

      // Update journey status
      await supabase
        .from('journeys')
        .update({
          status: 'ready',
          journey_data: metadata,
          updated_at: new Date().toISOString()
        })
        .eq('id', journeyId);

      // Create journey days
      for (const day of days) {
        await supabase
          .from('journey_days')
          .insert({
            journey_id: journeyId,
            day_number: day.dayNumber,
            title: day.title,
            description: day.description,
            script_text: day.scriptText,
            audio_url: day.audioUrl,
            duration_seconds: day.durationSeconds
          });
      }

      // Store in Pinecone
      await pineconeService.upsertCreation(journeyId, {
        userId,
        interest: metadata.interest,
        goal: metadata.goal,
        intention: metadata.intention,
        duration: metadata.duration,
        rating: metadata.evaluationScore,
        scriptElements: metadata.hypnoticElements
      });

      // Send email notification
      const { data: user } = await supabase
        .from('users')
        .select('email, name')
        .eq('id', userId)
        .single();

      await emailService.sendJourneyReadyEmail(user.email, {
        name: user.name,
        journeyId,
        goal: metadata.goal
      });

      res.json({ success: true });
    } catch (error) {
      console.error('Journey complete webhook error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async handleAudioReady(req, res) {
    try {
      const { journeyId, dayNumber, audioUrl, durationSeconds } = req.body;

      await supabase
        .from('journey_days')
        .update({
          audio_url: audioUrl,
          duration_seconds: durationSeconds
        })
        .eq('journey_id', journeyId)
        .eq('day_number', dayNumber);

      res.json({ success: true });
    } catch (error) {
      console.error('Audio ready webhook error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async handleError(req, res) {
    try {
      const { journeyId, error: errorMessage } = req.body;

      await supabase
        .from('journeys')
        .update({
          status: 'error',
          journey_data: { error: errorMessage },
          updated_at: new Date().toISOString()
        })
        .eq('id', journeyId);

      res.json({ success: true });
    } catch (error) {
      console.error('Error webhook error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}
```

---

## 📧 Email Service

```javascript
// services/email.service.js
import nodemailer from 'nodemailer';

export class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }

  async sendJourneyReadyEmail(to, data) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3b82f6;">Your Hypnosis Journey is Ready! 🎉</h1>
        <p>Hi ${data.name},</p>
        <p>Great news! Your personalized 7-day hypnosis journey for <strong>${data.goal}</strong> is now ready.</p>
        <p>
          <a href="${process.env.FRONTEND_URL}/dashboard/journey/${data.journeyId}" 
             style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Start Your Journey
          </a>
        </p>
        <p>We recommend listening at the same time each day for best results.</p>
        <p>Happy listening!</p>
        <p style="color: #6b7280; font-size: 14px;">
          The Hypnosis Generator Team
        </p>
      </div>
    `;

    await this.transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject: 'Your Hypnosis Journey is Ready!',
      html
    });
  }

  async sendDailyReminder(to, data) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Time for Today's Session 🧘</h2>
        <p>Hi ${data.name},</p>
        <p>Day ${data.dayNumber} of your journey awaits!</p>
        <p><strong>Today's Focus:</strong> ${data.dayTitle}</p>
        <p>
          <a href="${process.env.FRONTEND_URL}/dashboard" 
             style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Listen Now
          </a>
        </p>
        <p>Current Streak: ${data.streak} days 🔥</p>
      </div>
    `;

    await this.transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject: `Day ${data.dayNumber}: ${data.dayTitle}`,
      html
    });
  }
}

export const emailService = new EmailService();
```

---

## 🛣️ API Routes

### Main App Setup

```javascript
// app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorMiddleware } from './middleware/error.middleware.js';
import { loggerMiddleware } from './middleware/logger.middleware.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import journeyRoutes from './routes/journey.routes.js';
import journalRoutes from './routes/journal.routes.js';
import statsRoutes from './routes/stats.routes.js';
import adminRoutes from './routes/admin.routes.js';
import webhookRoutes from './routes/webhook.routes.js';

const app = express();

// Security
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(loggerMiddleware);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/journeys', journeyRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/webhooks', webhookRoutes);

// Error handling
app.use(errorMiddleware);

export default app;
```

### Example Route File

```javascript
// routes/journey.routes.js
import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { JourneyController } from '../controllers/journey.controller.js';
import { validateJourneyCreation } from '../validators/journey.validator.js';

const router = express.Router();
const journeyController = new JourneyController();

router.post(
  '/',
  authenticate,
  validateJourneyCreation,
  journeyController.create
);

router.get(
  '/',
  authenticate,
  journeyController.list
);

router.get(
  '/:id',
  authenticate,
  journeyController.get
);

router.get(
  '/:id/days',
  authenticate,
  journeyController.getDays
);

router.post(
  '/:id/days/:dayNumber/complete',
  authenticate,
  journeyController.markDayComplete
);

export default router;
```

---

## 📦 Package.json

```json
{
  "name": "hypnosis-generator-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "setup:db": "node scripts/setup-database.js",
    "setup:pinecone": "node scripts/setup-pinecone.js",
    "seed:knowledge": "node scripts/seed-knowledge.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint .",
    "format": "prettier --write \"src/**/*.js\""
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "joi": "^17.11.0",
    "@supabase/supabase-js": "^2.39.0",
    "mongodb": "^6.3.0",
    "@pinecone-database/pinecone": "^1.1.2",
    "cohere-ai": "^7.6.2",
    "openai": "^4.24.1",
    "@anthropic-ai/sdk": "^0.9.1",
    "axios": "^1.6.2",
    "nodemailer": "^6.9.7",
    "googleapis": "^129.0.0",
    "winston": "^3.11.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "eslint": "^8.55.0",
    "prettier": "^3.1.1"
  }
}
```

---

## 🚀 Deployment (Railway)

### Railway Configuration

1. **Create `railway.json`:**

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

2. **Environment Variables** (set in Railway dashboard):
   - All variables from `.env.example`

3. **Health Check Endpoint**: `/health`

4. **Automatic Deployments**: Enable on push to `main` branch

---

## ✅ Development Checklist

### Phase 1: Setup (Days 1-2)
- [ ] Initialize Node.js project
- [ ] Install dependencies
- [ ] Set up folder structure
- [ ] Configure environment variables
- [ ] Set up database connections
- [ ] Test Supabase connection
- [ ] Test MongoDB connection
- [ ] Test Pinecone connection
- [ ] Initialize logging

### Phase 2: Authentication (Days 3-4)
- [ ] Implement user registration
- [ ] Implement login
- [ ] Implement JWT generation/verification
- [ ] Create auth middleware
- [ ] Add password reset flow
- [ ] Test all auth endpoints

### Phase 3: Profile & Onboarding (Days 5-6)
- [ ] Create profile endpoints
- [ ] Implement onboarding completion
- [ ] Store onboarding data in Pinecone
- [ ] Test profile CRUD operations

### Phase 4: Journey Management (Days 7-10)
- [ ] Create journey endpoints
- [ ] Implement n8n webhook trigger
- [ ] Create webhook handlers
- [ ] Implement journey status polling
- [ ] Test journey creation flow
- [ ] Test journey completion flow

### Phase 5: Stats & Journal (Days 11-12)
- [ ] Create stats endpoints
- [ ] Implement streak calculation
- [ ] Create journal endpoints
- [ ] Add AI insights for journal
- [ ] Test stats updates

### Phase 6: Admin Panel (Days 13-14)
- [ ] Create admin endpoints
- [ ] Implement user management
- [ ] Add analytics endpoints
- [ ] Test admin access control

### Phase 7: Email & Notifications (Day 15)
- [ ] Set up nodemailer
- [ ] Create email templates
- [ ] Implement journey ready email
- [ ] Implement daily reminders
- [ ] Test email delivery

### Phase 8: Testing & Deployment (Days 16-17)
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Test all API endpoints
- [ ] Deploy to Railway
- [ ] Configure production environment
- [ ] Test production deployment

---

**Document Version**: 1.0  
**Last Updated**: November 8, 2025  
**Owner**: Max Mayes

