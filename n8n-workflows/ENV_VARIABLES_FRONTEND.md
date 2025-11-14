# Frontend Environment Variables

Create a `.env` file in your `frontend/` directory with these variables:

```bash
# ==============================================
# AI HYPNOSIS GENERATOR - FRONTEND ENVIRONMENT
# ==============================================

# --- API Configuration ---
VITE_API_URL=http://localhost:3000
VITE_API_TIMEOUT=30000

# --- N8N Webhook ---
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/journey-create

# --- Supabase (if using for auth) ---
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# --- App Configuration ---
VITE_APP_NAME="AI Hypnosis Generator"
VITE_APP_VERSION=1.0.0

# --- Feature Flags ---
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEV_TOOLS=true
VITE_ENABLE_SOCIAL_AUTH=false

# --- Analytics ---
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_MIXPANEL_TOKEN=your-mixpanel-token

# --- Environment ---
VITE_ENV=development

# --- Audio Player ---
VITE_AUDIO_PRELOAD=metadata
VITE_AUDIO_DEFAULT_VOLUME=0.8

# --- Journey Settings ---
VITE_DEFAULT_JOURNEY_DURATION=15
VITE_MIN_JOURNEY_DURATION=10
VITE_MAX_JOURNEY_DURATION=30
```

## Important Notes

### Vite Prefix Required
All environment variables **must** start with `VITE_` to be exposed to your React app.

### Public Visibility
⚠️ **All frontend env vars are publicly visible in the browser!**
- Never store secrets or API keys here
- Only use public-facing configuration
- Sensitive operations should go through your backend

## Quick Setup

1. Copy the template above
2. Create `frontend/.env` file
3. Update `VITE_API_URL` to match your backend
4. Update `VITE_N8N_WEBHOOK_URL` if using direct n8n calls

## Local Development

Create `frontend/.env.local` for local overrides (not committed to git):

```bash
VITE_API_URL=http://localhost:3000
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/journey-create
VITE_ENABLE_DEV_TOOLS=true
```

## Production

Create `frontend/.env.production`:

```bash
VITE_API_URL=https://api.yourdomain.com
VITE_N8N_WEBHOOK_URL=https://n8n.yourdomain.com/webhook/journey-create
VITE_ENV=production
VITE_ENABLE_DEV_TOOLS=false
```

## Required for MVP

At minimum, you need:
- `VITE_API_URL` - Your backend API URL
- `VITE_N8N_WEBHOOK_URL` - Your n8n webhook URL (or route through backend)

## Access in Code

```javascript
// In your React components
const apiUrl = import.meta.env.VITE_API_URL;
const n8nUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
```

## Deployment Platforms

### Vercel
Set environment variables in:
`Project Settings → Environment Variables`

### Netlify
Set in:
`Site Settings → Environment Variables`

### Railway
Set in:
`Project → Variables`

