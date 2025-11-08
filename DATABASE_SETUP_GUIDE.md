# Database Setup Guide - AI Hypnosis Generator

## Overview

This guide walks you through setting up all three database systems:
1. **Supabase** (PostgreSQL) - Primary structured data
2. **Pinecone** - Vector embeddings for semantic search
3. **MongoDB Atlas** - Script staging and temporary storage

---

## 1. Supabase Setup

### Step 1: Create Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: `hypnosis-generator`
   - **Database Password**: (generate strong password)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait 2-3 minutes for provisioning

### Step 2: Get Connection Details

1. Go to Project Settings → API
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: For frontend
   - **service_role key**: For backend (keep secret!)

### Step 3: Create Tables

Go to SQL Editor and run these commands:

#### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(50),
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster email lookups
CREATE INDEX idx_users_email ON users(email);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own data
CREATE POLICY users_select_own ON users
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can only update their own data
CREATE POLICY users_update_own ON users
  FOR UPDATE USING (auth.uid() = id);
```

#### Profiles Table

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  preference_time_of_day VARCHAR(50),
  preference_duration INTEGER,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for user_id lookups
CREATE INDEX idx_profiles_user_id ON profiles(user_id);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own profile
CREATE POLICY profiles_select_own ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY profiles_update_own ON profiles
  FOR UPDATE USING (auth.uid() = user_id);
```

#### Journeys Table

```sql
CREATE TABLE journeys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  goal TEXT NOT NULL,
  intention TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'creating',
  journey_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_journeys_user_id ON journeys(user_id);
CREATE INDEX idx_journeys_status ON journeys(status);
CREATE INDEX idx_journeys_created_at ON journeys(created_at DESC);

-- Enable RLS
ALTER TABLE journeys ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY journeys_select_own ON journeys
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY journeys_insert_own ON journeys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY journeys_update_own ON journeys
  FOR UPDATE USING (auth.uid() = user_id);
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
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(journey_id, day_number)
);

-- Indexes
CREATE INDEX idx_journey_days_journey_id ON journey_days(journey_id);
CREATE INDEX idx_journey_days_day_number ON journey_days(day_number);

-- Enable RLS
ALTER TABLE journey_days ENABLE ROW LEVEL SECURITY;

-- Policy: Users can access days for their own journeys
CREATE POLICY journey_days_select_own ON journey_days
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM journeys
      WHERE journeys.id = journey_days.journey_id
      AND journeys.user_id = auth.uid()
    )
  );

CREATE POLICY journey_days_update_own ON journey_days
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM journeys
      WHERE journeys.id = journey_days.journey_id
      AND journeys.user_id = auth.uid()
    )
  );
```

#### Journal Entries Table

```sql
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  journey_day_id UUID REFERENCES journey_days(id) ON DELETE SET NULL,
  entry_text TEXT NOT NULL,
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
  insights JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX idx_journal_entries_created_at ON journal_entries(created_at DESC);
CREATE INDEX idx_journal_entries_journey_day_id ON journal_entries(journey_day_id);

-- Enable RLS
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY journal_entries_select_own ON journal_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY journal_entries_insert_own ON journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY journal_entries_update_own ON journal_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY journal_entries_delete_own ON journal_entries
  FOR DELETE USING (auth.uid() = user_id);
```

#### User Stats Table

```sql
CREATE TABLE user_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_minutes_listened INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  last_session_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index
CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);

-- Enable RLS
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Policy
CREATE POLICY user_stats_select_own ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY user_stats_update_own ON user_stats
  FOR UPDATE USING (auth.uid() = user_id);
```

### Step 4: Create Functions

#### Update Updated_At Timestamp

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journeys_updated_at
  BEFORE UPDATE ON journeys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at
  BEFORE UPDATE ON journal_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON user_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Step 5: Seed Admin User (Optional)

```sql
-- Insert admin user (replace with your details)
INSERT INTO users (email, password_hash, name, is_admin)
VALUES (
  'admin@example.com',
  '$2b$10$...', -- Generate this with bcrypt
  'Admin User',
  TRUE
);

-- Get the user ID and create profile
INSERT INTO profiles (user_id)
SELECT id FROM users WHERE email = 'admin@example.com';

-- Create stats
INSERT INTO user_stats (user_id)
SELECT id FROM users WHERE email = 'admin@example.com';
```

### Step 6: Test Connection

```javascript
// test-supabase.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_SERVICE_KEY'
);

// Test query
const { data, error } = await supabase
  .from('users')
  .select('*')
  .limit(1);

if (error) {
  console.error('Error:', error);
} else {
  console.log('Success! Connection working.');
  console.log('Data:', data);
}
```

---

## 2. Pinecone Setup

### Step 1: Create Account

1. Go to [pinecone.io](https://www.pinecone.io)
2. Sign up for free account
3. Verify email

### Step 2: Create Indices

You need to create 4 separate indices. For each:

1. Go to "Indexes" in dashboard
2. Click "Create Index"
3. Fill in details (see below)
4. Click "Create Index"

#### Index 1: user-information

```yaml
Name: user-information
Dimensions: 1024
Metric: cosine
Pod Type: s1.x1 (starter)
Replicas: 1
Pods: 1
Metadata Config:
  - user_id
  - data_type
  - timestamp
  - journey_id
```

#### Index 2: core-hypnosis-knowledge

```yaml
Name: core-hypnosis-knowledge
Dimensions: 1024
Metric: cosine
Pod Type: s1.x1 (starter)
Replicas: 1
Pods: 1
Metadata Config:
  - category
  - technique
  - source
  - rating
```

#### Index 3: past-creations

```yaml
Name: past-creations
Dimensions: 1024
Metric: cosine
Pod Type: s1.x1 (starter)
Replicas: 1
Pods: 1
Metadata Config:
  - interest
  - rating
  - user_id
  - created_date
```

#### Index 4: interest-trends

```yaml
Name: interest-trends
Dimensions: 1024
Metric: cosine
Pod Type: s1.x1 (starter)
Replicas: 1
Pods: 1
Metadata Config:
  - interest
  - sub_interest
  - duration
  - popularity
```

### Step 3: Get API Key

1. Go to "API Keys" in dashboard
2. Copy your API key
3. Note your environment (e.g., `us-west1-gcp`)

### Step 4: Test Connection

```javascript
// test-pinecone.js
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: 'YOUR_PINECONE_API_KEY',
});

// Test connection
const index = pinecone.index('user-information');

// Test upsert
await index.namespace('test').upsert([
  {
    id: 'test-1',
    values: Array(1024).fill(0.1), // Dummy vector
    metadata: {
      user_id: 'test-user',
      data_type: 'test',
      timestamp: new Date().toISOString()
    }
  }
]);

console.log('Success! Pinecone working.');

// Clean up
await index.namespace('test').deleteAll();
```

### Step 5: Seed Core Knowledge (Optional)

Create a script to populate the `core-hypnosis-knowledge` index with foundational hypnosis techniques:

```javascript
// seed-hypnosis-knowledge.js
import { Pinecone } from '@pinecone-database/pinecone';
import { CohereClient } from 'cohere-ai';

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });
const index = pinecone.index('core-hypnosis-knowledge');

const knowledgeBase = [
  {
    category: 'induction',
    technique: 'progressive_relaxation',
    text: 'Progressive muscle relaxation involves systematically tensing and releasing muscle groups...',
    source: 'Clinical Hypnosis Textbook',
    rating: 9
  },
  {
    category: 'deepener',
    technique: 'staircase_deepener',
    text: 'The staircase deepener uses imagery of descending stairs to deepen the hypnotic state...',
    source: 'Hypnotherapy Scripts',
    rating: 8.5
  },
  // Add more knowledge entries...
];

for (const item of knowledgeBase) {
  // Generate embedding
  const response = await cohere.embed({
    texts: [item.text],
    model: 'embed-english-v3.0',
    inputType: 'search_document',
    embeddingTypes: ['float']
  });
  
  const embedding = response.embeddings.float[0];
  
  // Upsert to Pinecone
  await index.namespace(item.category).upsert([{
    id: `${item.category}-${item.technique}`,
    values: embedding,
    metadata: {
      category: item.category,
      technique: item.technique,
      source: item.source,
      rating: item.rating,
      text: item.text
    }
  }]);
  
  console.log(`Seeded: ${item.technique}`);
}

console.log('Knowledge base seeded successfully!');
```

---

## 3. MongoDB Atlas Setup

### Step 1: Create Cluster

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Click "Build a Database"
4. Choose "Shared" (free tier)
5. Select:
   - **Provider**: AWS
   - **Region**: Closest to your users
   - **Cluster Name**: `hypnosis-scripts`
6. Click "Create Cluster"

### Step 2: Configure Access

#### Database User

1. Go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `hypnosis-app`
5. Password: (generate strong password)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

#### Network Access

1. Go to "Network Access"
2. Click "Add IP Address"
3. For development: "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add specific IP addresses
5. Click "Confirm"

### Step 3: Get Connection String

1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Driver: Node.js
4. Copy connection string:
   ```
   mongodb+srv://hypnosis-app:<password>@hypnosis-scripts.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your database user password

### Step 4: Create Database and Collections

```javascript
// setup-mongodb.js
import { MongoClient } from 'mongodb';

const uri = 'YOUR_MONGODB_CONNECTION_STRING';
const client = new MongoClient(uri);

async function setup() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('hypnosis-scripts');
    
    // Create collections
    await db.createCollection('drafts');
    await db.createCollection('sections');
    await db.createCollection('evaluations');
    await db.createCollection('workflow_logs');
    
    console.log('Collections created');
    
    // Create indexes
    
    // Drafts indexes
    await db.collection('drafts').createIndex({ journeyId: 1 });
    await db.collection('drafts').createIndex({ userId: 1 });
    await db.collection('drafts').createIndex({ status: 1 });
    await db.collection('drafts').createIndex({ createdAt: -1 });
    
    // Sections indexes
    await db.collection('sections').createIndex({ draftId: 1 });
    await db.collection('sections').createIndex({ sectionType: 1 });
    
    // Evaluations indexes
    await db.collection('evaluations').createIndex({ draftId: 1 });
    await db.collection('evaluations').createIndex({ score: -1 });
    
    // Workflow logs indexes
    await db.collection('workflow_logs').createIndex({ journeyId: 1 });
    await db.collection('workflow_logs').createIndex({ timestamp: -1 });
    await db.collection('workflow_logs').createIndex({ status: 1 });
    
    console.log('Indexes created');
    
    // Create validation schemas
    await db.command({
      collMod: 'drafts',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['journeyId', 'userId', 'dayNumber', 'status'],
          properties: {
            journeyId: { bsonType: 'string' },
            userId: { bsonType: 'string' },
            dayNumber: { bsonType: 'int', minimum: 1, maximum: 7 },
            version: { bsonType: 'int' },
            status: { enum: ['draft', 'evaluating', 'approved', 'rejected'] },
            sections: { bsonType: 'object' },
            evaluationScore: { bsonType: 'double', minimum: 0, maximum: 10 },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' }
          }
        }
      }
    });
    
    console.log('Validation schemas applied');
    console.log('MongoDB setup complete!');
    
  } catch (error) {
    console.error('Setup error:', error);
  } finally {
    await client.close();
  }
}

setup();
```

### Step 5: Test Connection

```javascript
// test-mongodb.js
import { MongoClient } from 'mongodb';

const uri = 'YOUR_MONGODB_CONNECTION_STRING';
const client = new MongoClient(uri);

async function test() {
  try {
    await client.connect();
    console.log('Connected successfully');
    
    const db = client.db('hypnosis-scripts');
    
    // Test insert
    const result = await db.collection('drafts').insertOne({
      journeyId: 'test-journey',
      userId: 'test-user',
      dayNumber: 1,
      version: 1,
      status: 'draft',
      sections: {},
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Test document inserted:', result.insertedId);
    
    // Clean up
    await db.collection('drafts').deleteOne({ _id: result.insertedId });
    console.log('Test document deleted');
    
    console.log('MongoDB test successful!');
    
  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await client.close();
  }
}

test();
```

---

## 4. Environment Variables Summary

After completing all setups, you should have these environment variables:

### Backend `.env`

```bash
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Pinecone
PINECONE_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
PINECONE_ENVIRONMENT=us-west1-gcp
PINECONE_INDEX_USER_INFO=user-information
PINECONE_INDEX_KNOWLEDGE=core-hypnosis-knowledge
PINECONE_INDEX_CREATIONS=past-creations
PINECONE_INDEX_TRENDS=interest-trends

# MongoDB
MONGODB_SCRIPTS_URI=mongodb+srv://hypnosis-app:password@hypnosis-scripts.xxxxx.mongodb.net/hypnosis-scripts?retryWrites=true&w=majority

# Cohere (for embeddings)
COHERE_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Frontend `.env`

```bash
# Supabase (public keys only)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 5. Verification Checklist

- [ ] Supabase project created
- [ ] All Supabase tables created
- [ ] Supabase RLS policies enabled
- [ ] Supabase connection tested
- [ ] Pinecone account created
- [ ] All 4 Pinecone indices created
- [ ] Pinecone connection tested
- [ ] MongoDB Atlas cluster created
- [ ] MongoDB database user created
- [ ] MongoDB network access configured
- [ ] MongoDB collections created
- [ ] MongoDB indexes created
- [ ] MongoDB connection tested
- [ ] All environment variables documented
- [ ] Test scripts run successfully

---

## 6. Backup & Maintenance

### Supabase Backups

- Automatic daily backups (included in free tier)
- Manual backups: Database → Backups → "Create backup"

### Pinecone Backups

- Export vectors periodically:
  ```javascript
  // backup-pinecone.js
  const vectors = await index.namespace('namespace').fetch(['id1', 'id2', ...]);
  // Save to file or another storage
  ```

### MongoDB Backups

- Automatic backups (included in free tier)
- Manual backups: Clusters → ... → "Take snapshot now"

### Monitoring

- Set up alerts in each platform for:
  - High error rates
  - Unusual query patterns
  - Storage limits approaching
  - Performance degradation

---

## 7. Troubleshooting

### Supabase Connection Issues

```bash
# Test with psql
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

### Pinecone Connection Issues

- Verify API key is correct
- Check environment matches (us-west1-gcp, etc.)
- Ensure index names are exact

### MongoDB Connection Issues

- Verify IP is whitelisted
- Check username/password
- Ensure database name in connection string

---

**Document Version**: 1.0  
**Last Updated**: November 8, 2025  
**Owner**: Max Mayes

