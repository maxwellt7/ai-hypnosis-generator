# AI Hypnosis Generator - Complete Project Plan

## 🎯 Project Overview

An AI-powered hypnosis journey generator that creates personalized 7-day hypnosis programs based on user intake, goals, and intentions. The system uses multi-agent AI workflows to research, draft, evaluate, and produce custom audio hypnosis tracks.

### Tech Stack Summary
- **Frontend**: Vite + React, deployed on Vercel
- **Backend**: Node.js/Express, deployed on Railway
- **Workflow**: n8n for AI orchestration
- **Databases**: 
  - Supabase/MongoDB Atlas (structured data)
  - Pinecone (vector embeddings)
  - MongoDB (script staging)
- **AI Models**: OpenAI, Anthropic, DeepSeek
- **Embeddings**: Cohere (1024 dimensions)
- **Audio**: ElevenLabs TTS
- **Storage**: Google Drive
- **Notifications**: Gmail

---

## 📋 Phase 1: Project Setup & Infrastructure

### 1.1 Repository Structure
```
meditation-generator/
├── frontend/                 # Vite + React app
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service layer
│   │   ├── store/           # State management
│   │   ├── utils/           # Utility functions
│   │   └── assets/          # Images, fonts, etc.
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Node.js API server
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── models/          # Data models
│   │   ├── middleware/      # Auth, validation, etc.
│   │   ├── utils/           # Helper functions
│   │   └── config/          # Configuration
│   ├── package.json
│   └── server.js
│
├── n8n-workflows/           # n8n workflow exports
│   ├── main-workflow.json
│   ├── agents/              # Agent node configurations
│   └── prompts/             # AI prompts library
│
├── docs/                    # Documentation
│   ├── api/                 # API documentation
│   ├── architecture/        # System design docs
│   ├── deployment/          # Deployment guides
│   └── user-guides/         # End-user documentation
│
├── scripts/                 # Utility scripts
│   ├── setup-db.js         # Database initialization
│   ├── seed-data.js        # Sample data seeding
│   └── migrate.js          # Migration scripts
│
├── .env.example            # Environment variables template
├── .gitignore
├── README.md
└── package.json            # Root package.json for monorepo
```

### 1.2 Environment Setup

#### Required Services & Accounts
1. **Supabase** (or MongoDB Atlas)
   - Create project
   - Note connection string & API keys
   
2. **Pinecone**
   - Create account
   - Set up 4 indices (1024 dimensions, cosine similarity):
     - `user-information`
     - `core-hypnosis-knowledge`
     - `past-creations`
     - `interest-trends`

3. **MongoDB Atlas**
   - Create cluster for script staging
   - Create database: `hypnosis-scripts`
   - Collections: `drafts`, `sections`, `evaluations`

4. **OpenAI, Anthropic, DeepSeek**
   - Obtain API keys for each service

5. **Cohere**
   - Get API key for embeddings

6. **ElevenLabs**
   - Create account
   - Get API key
   - Select/create voice IDs

7. **Google Cloud**
   - Enable Drive API
   - Enable Gmail API
   - Create service account
   - Download credentials JSON

8. **n8n**
   - Self-host on Railway or use n8n Cloud
   - Configure webhook URLs

9. **Vercel**
   - Connect GitHub repo
   - Configure frontend deployment

10. **Railway**
    - Create project for backend
    - Configure environment variables

### 1.3 Environment Variables

Create `.env` files for each service:

#### Frontend `.env`
```bash
VITE_API_URL=https://your-backend.railway.app
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

#### Backend `.env`
```bash
# Server
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app

# Database
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-supabase-service-key
MONGODB_URI=your-mongodb-connection-string
MONGODB_SCRIPTS_URI=your-scripts-mongodb-uri

# Pinecone
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=your-pinecone-environment
PINECONE_INDEX_USER_INFO=user-information
PINECONE_INDEX_KNOWLEDGE=core-hypnosis-knowledge
PINECONE_INDEX_CREATIONS=past-creations
PINECONE_INDEX_TRENDS=interest-trends

# AI Models
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
DEEPSEEK_API_KEY=your-deepseek-key
COHERE_API_KEY=your-cohere-key

# ElevenLabs
ELEVENLABS_API_KEY=your-elevenlabs-key
ELEVENLABS_VOICE_ID=your-default-voice-id

# Google APIs
GOOGLE_CREDENTIALS_JSON=path-to-service-account.json
GOOGLE_DRIVE_FOLDER_ID=your-drive-folder-id

# Gmail
GMAIL_USER=your-gmail-address
GMAIL_APP_PASSWORD=your-app-password

# n8n
N8N_WEBHOOK_URL=your-n8n-webhook-url
N8N_API_KEY=your-n8n-api-key

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
```

---

## 📋 Phase 2: Database Design

### 2.1 Supabase Schema (Primary Database)

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  preference_time_of_day VARCHAR(50), -- morning, afternoon, evening, night
  preference_duration INTEGER, -- minutes
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_data JSONB, -- Store 20-question responses
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Journeys Table
```sql
CREATE TABLE journeys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  goal TEXT NOT NULL,
  intention TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'creating', -- creating, ready, completed
  journey_data JSONB, -- 7-day plan structure
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Journey Days Table
```sql
CREATE TABLE journey_days (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journey_id UUID REFERENCES journeys(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  title VARCHAR(255),
  description TEXT,
  script_text TEXT,
  audio_url VARCHAR(500),
  duration_seconds INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Journal Entries Table
```sql
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  journey_day_id UUID REFERENCES journey_days(id) ON DELETE SET NULL,
  entry_text TEXT NOT NULL,
  mood_rating INTEGER, -- 1-10 scale
  insights JSONB, -- AI-extracted insights
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### User Stats Table
```sql
CREATE TABLE user_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_minutes_listened INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  last_session_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2.2 Pinecone Indices Structure

#### Index 1: user-information
```javascript
{
  dimensions: 1024,
  metric: 'cosine',
  metadata_config: {
    indexed: ['user_id', 'data_type', 'timestamp', 'journey_id']
  }
}
// Namespaces: user-{userId}
// Metadata fields:
// - user_id: UUID
// - data_type: 'profile' | 'onboarding' | 'goal' | 'intention'
// - timestamp: ISO string
// - journey_id: UUID (if applicable)
// - raw_text: original text
```

#### Index 2: core-hypnosis-knowledge
```javascript
{
  dimensions: 1024,
  metric: 'cosine',
  metadata_config: {
    indexed: ['category', 'technique', 'source', 'rating']
  }
}
// Namespaces: 'induction' | 'deepener' | 'suggestion' | 'awakening' | 'theory'
// Metadata fields:
// - category: string
// - technique: string (e.g., 'progressive_relaxation', 'visualization')
// - source: string (book, video, expert)
// - rating: number (quality score)
// - structure: JSON (recommended script structure)
// - keywords: array of strings
```

#### Index 3: past-creations
```javascript
{
  dimensions: 1024,
  metric: 'cosine',
  metadata_config: {
    indexed: ['interest', 'rating', 'user_id', 'created_date']
  }
}
// Namespaces: interest categories (e.g., 'weight-loss', 'abundance', 'confidence')
// Metadata fields:
// - interest: string
// - user_id: UUID
// - journey_id: UUID
// - rating: number (evaluation score)
// - duration: number (minutes)
// - effectiveness: number (user feedback)
// - script_elements: JSON
```

#### Index 4: interest-trends
```javascript
{
  dimensions: 1024,
  metric: 'cosine',
  metadata_config: {
    indexed: ['interest', 'sub_interest', 'duration', 'popularity']
  }
}
// Namespaces: main interests
// Metadata fields:
// - interest: string
// - sub_interest: string (nuance)
// - duration: number
// - popularity: number (usage count)
// - success_rate: number
// - optimal_structure: JSON
// - key_elements: array
```

### 2.3 MongoDB Collections (Script Staging)

#### Database: hypnosis-scripts

##### Collection: drafts
```javascript
{
  _id: ObjectId,
  journeyId: String,
  userId: String,
  dayNumber: Number,
  version: Number,
  status: String, // 'draft', 'evaluating', 'approved', 'rejected'
  sections: {
    intention: String,
    calibration: String,
    induction: String,
    deepener: String,
    futurePacing: String,
    awakening: String
  },
  metadata: {
    goal: String,
    intention: String,
    duration: Number,
    keywords: [String],
    hypnoticElements: [String]
  },
  evaluationScore: Number,
  evaluationFeedback: String,
  createdAt: Date,
  updatedAt: Date
}
```

##### Collection: sections
```javascript
{
  _id: ObjectId,
  draftId: ObjectId,
  sectionType: String, // 'intention', 'induction', etc.
  text: String,
  audioUrl: String,
  audioMetadata: {
    voiceId: String,
    model: String,
    duration: Number,
    fileSize: Number
  },
  createdAt: Date
}
```

##### Collection: evaluations
```javascript
{
  _id: ObjectId,
  draftId: ObjectId,
  evaluator: String, // 'ai' or 'human'
  score: Number, // 1-10
  criteria: {
    structure: Number,
    language: Number,
    hypnoticElements: Number,
    personalization: Number,
    flow: Number
  },
  feedback: String,
  suggestions: [String],
  approved: Boolean,
  createdAt: Date
}
```

---

## 📋 Phase 3: API Design

### 3.1 Authentication Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

### 3.2 Profile Endpoints

```
GET    /api/profile
PUT    /api/profile
POST   /api/profile/onboarding
GET    /api/profile/onboarding
```

### 3.3 Journey Endpoints

```
POST   /api/journeys              # Create new journey
GET    /api/journeys              # List user's journeys
GET    /api/journeys/:id          # Get specific journey
PUT    /api/journeys/:id          # Update journey
DELETE /api/journeys/:id          # Delete journey
GET    /api/journeys/:id/days     # Get all days for journey
GET    /api/journeys/:id/days/:dayNumber  # Get specific day
POST   /api/journeys/:id/days/:dayNumber/complete  # Mark day complete
```

### 3.4 Journal Endpoints

```
POST   /api/journal               # Create entry
GET    /api/journal               # List entries
GET    /api/journal/:id           # Get specific entry
PUT    /api/journal/:id           # Update entry
DELETE /api/journal/:id           # Delete entry
```

### 3.5 Stats Endpoints

```
GET    /api/stats                 # Get user stats
GET    /api/stats/streaks         # Get streak information
GET    /api/stats/improvements    # Get AI-analyzed improvements
```

### 3.6 Admin Endpoints

```
GET    /api/admin/users           # List all users
GET    /api/admin/users/:id       # Get user details
GET    /api/admin/analytics       # System analytics
GET    /api/admin/journeys        # All journeys overview
```

### 3.7 Webhook Endpoints (for n8n)

```
POST   /api/webhooks/n8n/journey-complete    # Journey generation complete
POST   /api/webhooks/n8n/audio-ready         # Audio file ready
POST   /api/webhooks/n8n/error               # Error notification
```

---

## 📋 Phase 4: Frontend Architecture

### 4.1 Page Structure

```
/                           # Landing page
/login                      # Login page
/register                   # Registration page
/onboarding                 # 20-question intake
/create-journey             # Journey creation form
/journey/:id/creating       # Loading screen
/dashboard                  # Main dashboard
/dashboard/journey/:id      # Journey detail view
/dashboard/profile          # Profile view/edit
/dashboard/stats            # Stats & insights
/dashboard/journal          # Journal list
/dashboard/journal/new      # New journal entry
/dashboard/journal/:id      # View/edit entry
/dashboard/settings         # User settings
/admin                      # Admin panel
/admin/users                # User management
/admin/analytics            # Analytics dashboard
```

### 4.2 Component Library

#### Core Components
- `Button`, `Input`, `Select`, `Textarea`, `Checkbox`, `Radio`
- `Card`, `Modal`, `Drawer`, `Tooltip`, `Dropdown`
- `Navbar`, `Sidebar`, `Footer`
- `LoadingSpinner`, `ProgressBar`, `Skeleton`
- `Alert`, `Toast`, `Badge`

#### Feature Components
- `OnboardingQuiz` - Multi-step form with AI suggestions
- `JourneyCard` - Display journey overview
- `DayCard` - Individual day in journey
- `AudioPlayer` - Custom audio player with progress
- `StatsWidget` - Display various statistics
- `StreakCalendar` - Visual streak tracker
- `JournalEntry` - Journal entry display/edit
- `ProfileForm` - Profile editing form
- `AdminTable` - User data table
- `ChartWidget` - Various chart types for analytics

### 4.3 State Management

Using React Context + Hooks or Zustand:

```javascript
// stores/authStore.js
{
  user: null,
  token: null,
  isAuthenticated: false,
  login: (credentials) => {},
  logout: () => {},
  register: (userData) => {}
}

// stores/profileStore.js
{
  profile: null,
  onboardingData: null,
  fetchProfile: () => {},
  updateProfile: (data) => {},
  completeOnboarding: (responses) => {}
}

// stores/journeyStore.js
{
  journeys: [],
  currentJourney: null,
  fetchJourneys: () => {},
  createJourney: (data) => {},
  fetchJourneyDetails: (id) => {},
  markDayComplete: (journeyId, dayNumber) => {}
}

// stores/journalStore.js
{
  entries: [],
  createEntry: (data) => {},
  fetchEntries: () => {},
  updateEntry: (id, data) => {},
  deleteEntry: (id) => {}
}

// stores/statsStore.js
{
  stats: null,
  streaks: null,
  improvements: [],
  fetchStats: () => {}
}
```

---

## 📋 Phase 5: n8n Workflow Design

See separate `N8N_WORKFLOW_PLAN.md` for detailed workflow architecture.

---

## 📋 Phase 6: Deployment Strategy

### 6.1 Frontend Deployment (Vercel)

1. Connect GitHub repository
2. Configure build settings:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Set environment variables
4. Enable automatic deployments on push to `main`
5. Configure custom domain (optional)

### 6.2 Backend Deployment (Railway)

1. Create new project
2. Connect GitHub repository
3. Configure:
   - Root Directory: `backend`
   - Start Command: `npm start`
4. Set all environment variables
5. Configure health check endpoint: `/health`
6. Set up automatic deployments

### 6.3 n8n Deployment (Railway or n8n Cloud)

**Option A: Railway**
1. Deploy n8n using Docker
2. Configure persistent volume for data
3. Set up webhook URLs
4. Import workflow JSON files

**Option B: n8n Cloud**
1. Create account
2. Import workflows
3. Configure credentials
4. Set up webhook URLs

### 6.4 Database Deployment

- **Supabase**: Already hosted
- **MongoDB Atlas**: Already hosted
- **Pinecone**: Already hosted

---

## 📋 Phase 7: Testing Strategy

### 7.1 Frontend Testing
- Unit tests: Vitest + React Testing Library
- E2E tests: Playwright or Cypress
- Visual regression: Chromatic (optional)

### 7.2 Backend Testing
- Unit tests: Jest
- Integration tests: Supertest
- API tests: Postman collections

### 7.3 Workflow Testing
- n8n workflow testing with sample data
- Manual QA checklist for each workflow path

---

## 📋 Phase 8: Monitoring & Maintenance

### 8.1 Monitoring
- Frontend: Vercel Analytics
- Backend: Railway logs + Sentry
- n8n: Built-in execution logs
- Database: Native monitoring tools

### 8.2 Backup Strategy
- Supabase: Automatic backups
- MongoDB: Scheduled backups
- Pinecone: Export vectors periodically
- Google Drive: Redundant storage

### 8.3 Maintenance Tasks
- Weekly: Review error logs
- Monthly: Database optimization, cost review
- Quarterly: Security audit, dependency updates
- Annually: Architecture review

---

## 📋 Timeline Estimate

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Setup & Infrastructure | 1 week | - |
| Database Design & Setup | 3 days | Phase 1 |
| Backend API Development | 2 weeks | Phase 2 |
| Frontend Development | 3 weeks | Phase 3 |
| n8n Workflow Creation | 2 weeks | Phase 2, 3 |
| Integration & Testing | 1 week | Phase 4, 5 |
| Deployment & QA | 3 days | Phase 6 |
| Polish & Launch | 1 week | Phase 7 |
| **Total** | **~8-10 weeks** | |

---

## 📋 Success Metrics

### Technical Metrics
- API response time < 200ms (p95)
- Workflow completion rate > 95%
- Audio generation time < 5 minutes per track
- System uptime > 99.5%

### User Metrics
- Onboarding completion rate > 80%
- Journey completion rate > 60%
- User retention (7-day) > 50%
- Average session duration > 15 minutes

### Business Metrics
- User acquisition cost
- Lifetime value
- Churn rate
- Net Promoter Score (NPS)

---

## 🚀 Next Steps

1. Review and approve this plan
2. Set up all required service accounts
3. Create `.env` files with credentials
4. Initialize Git repository
5. Begin Phase 1: Project Setup

---

**Document Version**: 1.0  
**Last Updated**: November 8, 2025  
**Owner**: Max Mayes

