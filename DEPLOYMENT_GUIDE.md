# Deployment & Build Instructions - AI Hypnosis Generator

## Overview

This guide covers the complete deployment process for all components:
1. Frontend (Vercel)
2. Backend (Railway)
3. n8n Workflow (Railway or n8n Cloud)
4. Database Setup
5. External Services Configuration

---

## Prerequisites Checklist

Before deploying, ensure you have:

- [ ] GitHub account
- [ ] Vercel account
- [ ] Railway account
- [ ] All database accounts (Supabase, Pinecone, MongoDB)
- [ ] All AI API keys (OpenAI, Anthropic, DeepSeek, Cohere, ElevenLabs)
- [ ] Google Cloud account (Drive & Gmail APIs)
- [ ] Domain name (optional)

---

## Part 1: Repository Setup

### Step 1: Create GitHub Repository

```bash
# Initialize git repository
git init

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
build/
dist/

# Environment
.env
.env.local
.env.production
.env.*.local

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Temporary
tmp/
temp/
*.tmp

# MongoDB
*.mongodb

# Misc
.cache/
EOF

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: AI Hypnosis Generator"

# Create GitHub repo (via GitHub CLI or web interface)
gh repo create meditation-generator --public --source=. --remote=origin

# Push to GitHub
git push -u origin main
```

### Step 2: Create Branch Structure

```bash
# Create development branch
git checkout -b development
git push -u origin development

# Create staging branch
git checkout -b staging
git push -u origin staging

# Back to main
git checkout main
```

---

## Part 2: Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. Ensure `frontend/package.json` has correct scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx"
  }
}
```

2. Create `frontend/vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Step 2: Deploy to Vercel

#### Option A: Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend.railway.app
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
6. Click "Deploy"

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Navigate to frontend
cd frontend

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: meditation-generator
# - Directory: ./
# - Override settings? No

# Set environment variables
vercel env add VITE_API_URL production
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production

# Deploy to production
vercel --prod
```

### Step 3: Configure Custom Domain (Optional)

1. In Vercel dashboard → Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

### Step 4: Configure Deployment Settings

1. **Git Integration**:
   - Settings → Git
   - Production Branch: `main`
   - Enable automatic deployments

2. **Preview Deployments**:
   - Enable preview deployments for all branches
   - Useful for testing before merging to main

3. **Environment Variables**:
   - Add separate variables for Preview and Production
   - Use different backend URLs for testing

---

## Part 3: Backend Deployment (Railway)

### Step 1: Prepare Backend

1. Create `backend/railway.json`:

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

2. Ensure `backend/package.json` has:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
```

3. Create health check endpoint in `backend/server.js`:

```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Step 2: Deploy to Railway

#### Via Railway Dashboard

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Configure:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
   - **Build Command**: `npm install`
6. Add Environment Variables (see list below)
7. Click "Deploy"

#### Via Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Navigate to backend
cd backend

# Initialize
railway init

# Link to project
railway link

# Add environment variables
railway variables set PORT=3000
railway variables set NODE_ENV=production
# ... add all other variables

# Deploy
railway up
```

### Step 3: Environment Variables for Backend

Add these in Railway dashboard or via CLI:

```bash
# Server
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app

# Database
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-supabase-service-key
MONGODB_URI=your-mongodb-uri
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
ELEVENLABS_VOICE_ID=your-voice-id

# Google APIs
GOOGLE_CREDENTIALS_JSON={"type":"service_account",...}
GOOGLE_DRIVE_FOLDER_ID=your-folder-id

# Gmail
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# n8n
N8N_WEBHOOK_URL=your-n8n-webhook-url
N8N_API_KEY=your-n8n-api-key

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
```

### Step 4: Get Backend URL

After deployment:
1. Go to Railway dashboard
2. Click on your backend service
3. Go to "Settings" → "Networking"
4. Copy the public URL (e.g., `https://meditation-generator-production.up.railway.app`)
5. Update frontend environment variable `VITE_API_URL` in Vercel

---

## Part 4: n8n Deployment

### Option A: Deploy on Railway

#### Step 1: Create n8n Service

1. Railway dashboard → "New Service"
2. Select "Docker Image"
3. Image: `n8nio/n8n:latest`
4. Configure:
   - **Port**: 5678
   - **Health Check Path**: `/healthz`

#### Step 2: Add Volume

1. Go to service settings
2. Add volume:
   - **Mount Path**: `/home/node/.n8n`
   - **Size**: 1GB

#### Step 3: Environment Variables

```bash
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your-secure-password
N8N_HOST=0.0.0.0
N8N_PORT=5678
N8N_PROTOCOL=https
WEBHOOK_URL=https://your-n8n-url.railway.app
EXECUTIONS_DATA_SAVE_ON_SUCCESS=all
EXECUTIONS_DATA_SAVE_ON_ERROR=all
EXECUTIONS_DATA_SAVE_MANUAL_EXECUTIONS=true
```

#### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment
3. Access n8n at the provided URL
4. Login with credentials

### Option B: Use n8n Cloud

1. Go to [n8n.cloud](https://n8n.cloud)
2. Sign up for account
3. Create new instance
4. Note webhook URL

### Step 5: Import Workflow

1. Access n8n interface
2. Click "Import from File"
3. Upload `n8n-workflows/main-workflow.json`
4. Configure credentials for all nodes:
   - OpenAI API
   - Anthropic API
   - DeepSeek API
   - Cohere API
   - ElevenLabs API
   - MongoDB
   - Pinecone
   - Google APIs
   - Gmail
5. Activate workflow

### Step 6: Get Webhook URL

1. Open workflow
2. Find "Webhook" trigger node
3. Copy webhook URL
4. Update backend environment variable `N8N_WEBHOOK_URL`

---

## Part 5: Database Initialization

### Step 1: Initialize Supabase

```bash
# Run setup script
cd backend
node scripts/setup-database.js
```

Or manually run SQL from `DATABASE_SETUP_GUIDE.md`

### Step 2: Initialize Pinecone

```bash
# Run setup script
node scripts/setup-pinecone.js
```

### Step 3: Seed Knowledge Base

```bash
# Seed hypnosis knowledge
node scripts/seed-knowledge.js
```

### Step 4: Initialize MongoDB

```bash
# Run setup script
node scripts/setup-mongodb.js
```

---

## Part 6: External Services Setup

### Google Drive Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project: "Hypnosis Generator"
3. Enable APIs:
   - Google Drive API
   - Gmail API
4. Create Service Account:
   - IAM & Admin → Service Accounts
   - Create service account
   - Grant "Editor" role
   - Create key (JSON)
   - Download and save securely
5. Share Drive Folder:
   - Create folder in Google Drive
   - Share with service account email
   - Copy folder ID from URL
6. Add to environment variables:
   - `GOOGLE_CREDENTIALS_JSON`: Contents of JSON file
   - `GOOGLE_DRIVE_FOLDER_ID`: Folder ID

### Gmail Setup

1. Enable 2-factor authentication on Gmail account
2. Generate App Password:
   - Google Account → Security
   - 2-Step Verification → App passwords
   - Select "Mail" and "Other"
   - Name: "Hypnosis Generator"
   - Copy password
3. Add to environment variables:
   - `GMAIL_USER`: Your Gmail address
   - `GMAIL_APP_PASSWORD`: Generated password

---

## Part 7: Testing Deployment

### Frontend Tests

```bash
# Test production build locally
cd frontend
npm run build
npm run preview

# Visit http://localhost:4173
# Test all pages and features
```

### Backend Tests

```bash
# Test health endpoint
curl https://your-backend.railway.app/health

# Test auth endpoint
curl -X POST https://your-backend.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'
```

### n8n Tests

1. Trigger test workflow manually
2. Check execution logs
3. Verify all nodes execute successfully
4. Check MongoDB for test data
5. Verify email sent

### End-to-End Test

1. Register new user
2. Complete onboarding
3. Create journey
4. Wait for journey creation (5-10 min)
5. Verify:
   - Journey appears in dashboard
   - Audio files playable
   - Email received
   - Database updated

---

## Part 8: Monitoring & Logging

### Vercel Monitoring

1. Dashboard → Analytics
2. Monitor:
   - Page views
   - Load times
   - Error rates
   - Bandwidth usage

### Railway Monitoring

1. Service → Metrics
2. Monitor:
   - CPU usage
   - Memory usage
   - Network traffic
   - Response times

### Set Up Alerts

#### Vercel

1. Settings → Notifications
2. Enable:
   - Deployment failed
   - Build errors
   - Domain issues

#### Railway

1. Service → Settings → Alerts
2. Configure:
   - High CPU usage (>80%)
   - High memory usage (>80%)
   - Service crashes
   - Health check failures

### Logging

#### Backend Logging

```javascript
// utils/logger.js
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

#### n8n Logging

- Built-in execution logs
- Access via n8n interface
- Executions → View logs

---

## Part 9: Continuous Deployment

### Automatic Deployments

#### Vercel

- Automatically deploys on push to `main`
- Preview deployments for PRs

#### Railway

1. Settings → Deployments
2. Enable "Auto Deploy"
3. Select branch: `main`

### Deployment Workflow

```
Developer → Push to branch
    ↓
GitHub Actions (optional)
    ↓
Tests run
    ↓
Merge to main
    ↓
Vercel deploys frontend
Railway deploys backend
    ↓
Smoke tests
    ↓
Production live
```

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: cd frontend && npm ci
      - name: Run tests
        run: cd frontend && npm test
      - name: Build
        run: cd frontend && npm run build

  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: cd backend && npm ci
      - name: Run tests
        run: cd backend && npm test
```

---

## Part 10: Rollback Procedures

### Vercel Rollback

1. Dashboard → Deployments
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

### Railway Rollback

1. Service → Deployments
2. Find previous deployment
3. Click "Redeploy"

### Database Rollback

#### Supabase

1. Dashboard → Database → Backups
2. Select backup
3. Restore

#### MongoDB

1. Atlas → Clusters → ... → Restore
2. Select snapshot
3. Restore to cluster

---

## Part 11: Scaling Considerations

### Frontend (Vercel)

- Automatic scaling
- CDN distribution
- No action needed

### Backend (Railway)

1. Service → Settings → Resources
2. Increase:
   - vCPU
   - Memory
   - Replicas (for high availability)

### n8n

1. Increase Railway resources
2. Or migrate to dedicated n8n Cloud plan

### Databases

#### Supabase

- Upgrade plan for more connections
- Enable connection pooling

#### Pinecone

- Upgrade to more pods
- Increase replicas

#### MongoDB

- Upgrade cluster tier
- Enable auto-scaling

---

## Part 12: Security Checklist

- [ ] All API keys stored as environment variables
- [ ] No secrets in code or Git history
- [ ] HTTPS enabled on all endpoints
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (sanitize inputs)
- [ ] Authentication tokens expire
- [ ] Password hashing (bcrypt)
- [ ] Supabase RLS policies enabled
- [ ] Regular security audits
- [ ] Dependency updates (npm audit)
- [ ] Error messages don't leak sensitive info
- [ ] Logging doesn't include sensitive data

---

## Part 13: Cost Optimization

### Estimated Monthly Costs

```
Vercel (Frontend):        $0 (free tier)
Railway (Backend):        $5-20 (usage-based)
Railway (n8n):            $5-10 (usage-based)
Supabase:                 $0 (free tier, 500MB)
Pinecone:                 $0 (free tier, 1 index)
MongoDB Atlas:            $0 (free tier, 512MB)
OpenAI:                   $50-200 (usage-based)
Anthropic:                $50-200 (usage-based)
ElevenLabs:               $20-100 (usage-based)
Cohere:                   $0-20 (usage-based)
Google Cloud:             $0-5 (free tier)

TOTAL:                    $130-555/month
```

### Cost Reduction Tips

1. **Cache AI responses** for common queries
2. **Use GPT-3.5** for simpler tasks
3. **Batch operations** to reduce API calls
4. **Implement rate limiting** to prevent abuse
5. **Monitor usage** and set budgets
6. **Use free tiers** where possible
7. **Optimize audio generation** (don't regenerate)

---

## Part 14: Launch Checklist

### Pre-Launch

- [ ] All services deployed and running
- [ ] All environment variables set
- [ ] Databases initialized and seeded
- [ ] n8n workflow imported and activated
- [ ] End-to-end test successful
- [ ] Performance testing completed
- [ ] Security audit passed
- [ ] Monitoring and alerts configured
- [ ] Backup procedures tested
- [ ] Documentation complete
- [ ] Terms of Service and Privacy Policy ready
- [ ] Support email/system ready

### Launch Day

- [ ] Final smoke test
- [ ] Monitor error rates
- [ ] Watch server resources
- [ ] Check email delivery
- [ ] Monitor user registrations
- [ ] Test journey creation
- [ ] Verify audio generation
- [ ] Check database writes
- [ ] Monitor costs

### Post-Launch

- [ ] Collect user feedback
- [ ] Monitor analytics
- [ ] Fix critical bugs
- [ ] Optimize performance
- [ ] Plan feature updates

---

## Part 15: Troubleshooting

### Frontend Issues

**Problem**: Build fails on Vercel
- Check build logs
- Verify all dependencies installed
- Test build locally: `npm run build`

**Problem**: API calls failing
- Verify `VITE_API_URL` is correct
- Check CORS settings on backend
- Inspect network tab in browser

### Backend Issues

**Problem**: Service won't start
- Check Railway logs
- Verify environment variables
- Test locally: `npm start`

**Problem**: Database connection fails
- Verify connection strings
- Check IP whitelist (MongoDB)
- Test connection with CLI

### n8n Issues

**Problem**: Workflow fails
- Check execution logs
- Verify all credentials
- Test each node individually

**Problem**: Webhook not triggering
- Verify webhook URL
- Check backend can reach n8n
- Test with curl

---

## Support & Resources

- **Documentation**: This repository
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **n8n Docs**: [docs.n8n.io](https://docs.n8n.io)
- **Community**: Create Discord/Slack for support

---

**Document Version**: 1.0  
**Last Updated**: November 8, 2025  
**Owner**: Max Mayes

