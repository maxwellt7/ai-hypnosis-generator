# Backend Environment Variables

Create a `.env` file in your `backend/` directory with these variables:

```bash
# ==============================================
# AI HYPNOSIS GENERATOR - BACKEND ENVIRONMENT
# ==============================================

# --- Server Configuration ---
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173

# --- Database ---
MONGODB_URI=mongodb://localhost:27017/hypnosis-generator
# OR MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hypnosis-generator

# --- Authentication ---
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret-change-this
REFRESH_TOKEN_EXPIRES_IN=30d

# --- Supabase (Alternative Auth) ---
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-role-key

# --- N8N Integration ---
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/journey-create
N8N_API_KEY=your-secure-n8n-api-key-for-webhook-auth

# --- AI Services ---
# OpenAI (for embeddings, GPT models)
OPENAI_API_KEY=sk-your-openai-api-key

# Anthropic Claude (for script generation)
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key

# DeepSeek (alternative AI model)
DEEPSEEK_API_KEY=your-deepseek-api-key

# --- Vector Database ---
# Pinecone
PINECONE_API_KEY=pcsk_2R6V3W_U7BaEjBzNoPCmaBgMsmFmBH3ApA9GyqJxeMwugnCR63QeQwGpDhiorJr8msh3Qe
PINECONE_ENVIRONMENT=us-east-1
PINECONE_INDEX_USER_INFO=user-information
PINECONE_INDEX_KNOWLEDGE=core-hypnosis-knowledge
PINECONE_INDEX_CREATIONS=past-creations
PINECONE_INDEX_TRENDS=interest-trends

# --- Audio Generation ---
# ElevenLabs
ELEVENLABS_API_KEY=your-elevenlabs-api-key
ELEVENLABS_VOICE_ID=JBFqnCBsd6RMkjVDRZzb

# --- Google Services ---
# Google Drive (for audio storage)
GOOGLE_DRIVE_FOLDER_ID=your-google-drive-folder-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"

# Gmail (for email notifications)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password

# --- Email Service ---
# SendGrid (alternative to Gmail)
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# --- Rate Limiting ---
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# --- Logging ---
LOG_LEVEL=info
LOG_FILE_PATH=./logs/app.log

# --- CORS ---
CORS_ORIGIN=http://localhost:5173,https://yourdomain.com

# --- Webhook Security ---
WEBHOOK_SECRET=your-webhook-verification-secret

# --- Feature Flags ---
ENABLE_ANALYTICS=true
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_PINECONE=false
ENABLE_YOUTUBE_RESEARCH=false

# --- Admin ---
ADMIN_API_KEY=your-admin-api-key-for-management-endpoints

# --- Monitoring ---
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

## Quick Setup

1. Copy the template above
2. Create `backend/.env` file
3. Fill in your actual values
4. **Never commit this file to git!**

## Required for MVP

At minimum, you need:
- `MONGODB_URI`
- `JWT_SECRET`
- `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`
- `ELEVENLABS_API_KEY`
- `N8N_API_KEY`

## Production Checklist

Before deploying:
- [ ] Generate strong random secrets for JWT
- [ ] Use MongoDB Atlas connection string
- [ ] Set `NODE_ENV=production`
- [ ] Set correct `FRONTEND_URL`
- [ ] Enable HTTPS for all external URLs
- [ ] Use environment-specific secrets manager
- [ ] Rotate all API keys
- [ ] Set up proper CORS origins

