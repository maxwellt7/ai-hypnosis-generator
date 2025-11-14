# Complete Deployment Guide
## AI Hypnosis Journey Generator

**Time to Deploy**: 30-60 minutes  
**Difficulty**: Intermediate  
**Prerequisites**: Basic knowledge of Node.js, MongoDB, and cloud platforms

---

## 🎯 Overview

This guide walks you through deploying the complete AI Hypnosis Generator system:

1. ✅ Backend API (Express.js + MongoDB)
2. ✅ Frontend (React + Vite)
3. ✅ n8n Workflow (Journey orchestration)
4. ✅ Pinecone (Vector database)
5. ✅ Third-party integrations (OpenAI, ElevenLabs, Google)

---

## 📋 Pre-Deployment Checklist

### Accounts You Need:
- [ ] MongoDB Atlas (free tier OK)
- [ ] Vercel or Netlify (frontend hosting)
- [ ] Railway or Heroku (backend hosting)
- [ ] n8n.cloud or self-hosted n8n
- [ ] Pinecone (free tier OK)
- [ ] OpenAI API access
- [ ] Anthropic API access (Claude)
- [ ] ElevenLabs API access
- [ ] Google Cloud (Drive + Gmail)

### Files You Need:
- [ ] `PRODUCTION-READY-WORKFLOW.json` (n8n workflow)
- [ ] Backend code (`/backend`)
- [ ] Frontend code (`/frontend`)
- [ ] Environment variables templates

---

## 🚀 Step-by-Step Deployment

### Phase 1: Database Setup (5 minutes)

#### 1.1 Create MongoDB Atlas Cluster

```bash
1. Go to https://cloud.mongodb.com
2. Sign up / Log in
3. Create a new cluster (free tier)
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Replace <password> with your password
7. Add /hypnosis-generator at the end
```

Example:
```
mongodb+srv://user:password@cluster.mongodb.net/hypnosis-generator
```

#### 1.2 Set Up Collections

MongoDB will auto-create collections, but you can pre-create them:

```javascript
// In MongoDB Atlas → Collections → Create Collection
journeys
journey_days
users
profiles
stats
```

#### 1.3 Create Indexes

Run in MongoDB Atlas → Collections → journeys → Indexes:

```javascript
// User journeys index
{ userId: 1, createdAt: -1 }

// Journey ID index
{ journeyId: 1 }

// Status index for filtering
{ status: 1, createdAt: -1 }
```

---

### Phase 2: Backend Deployment (15 minutes)

#### 2.1 Prepare Backend

```bash
cd backend
npm install
```

#### 2.2 Configure Environment Variables

Create `backend/.env` using [`ENV_VARIABLES_BACKEND.md`](./ENV_VARIABLES_BACKEND.md):

**Critical variables:**
```bash
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://... (from Phase 1)
JWT_SECRET=<generate strong random string>
ANTHROPIC_API_KEY=sk-ant-...
ELEVENLABS_API_KEY=...
N8N_API_KEY=<generate strong random string>
PINECONE_API_KEY=pcsk_2R6V3W...
```

#### 2.3 Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up

# Add environment variables
railway variables set NODE_ENV=production
railway variables set MONGODB_URI="mongodb+srv://..."
railway variables set JWT_SECRET="your-secret"
# ... (add all other variables)

# Get deployment URL
railway status
```

**Your backend will be at**: `https://your-app.railway.app`

#### 2.4 Alternative: Deploy to Heroku

```bash
# Install Heroku CLI
brew install heroku/brew/heroku

# Login
heroku login

# Create app
heroku create your-hypnosis-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="mongodb+srv://..."
# ... (add all variables)

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

#### 2.5 Update Backend Routes

Add n8n webhook routes to `backend/src/app.js`:

```javascript
// Add this line
const n8nWebhookRoutes = require('./routes/n8n-webhook.routes');

// Add this route
app.use('/api/webhooks/n8n', n8nWebhookRoutes);
```

---

### Phase 3: Pinecone Setup (10 minutes)

Follow the complete guide in [`PINECONE_COMPLETE_SETUP.md`](./PINECONE_COMPLETE_SETUP.md)

**Quick steps:**

```bash
1. Go to https://app.pinecone.io
2. Create account
3. Get API key (already provided: pcsk_2R6V3W...)
4. Create 4 indices (see guide for details):
   - user-information
   - core-hypnosis-knowledge
   - past-creations
   - interest-trends
5. Verify all indices are "Ready"
```

---

### Phase 4: n8n Deployment (15 minutes)

#### 4.1 Option A: n8n Cloud (Easiest)

```bash
1. Go to https://n8n.io/cloud
2. Sign up for account
3. Create workspace
4. Import workflow (next step)
```

#### 4.2 Option B: Self-Hosted n8n

```bash
# Using Docker
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -e N8N_HOST=your-domain.com \
  -e WEBHOOK_URL=https://your-domain.com/ \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Access at http://localhost:5678
```

#### 4.3 Import Workflow

```bash
1. Open n8n
2. Click "Workflows" → "Import from File"
3. Select PRODUCTION-READY-WORKFLOW.json
4. Workflow will open in editor
```

#### 4.4 Configure Credentials in n8n

##### MongoDB Credential:
```
Name: MongoDB account
Connection Type: MongoDB
Connection String: mongodb+srv://... (same as backend)
```

##### Anthropic Credential:
```
Name: Anthropic account 2
API Key: sk-ant-your-key
```

##### ElevenLabs (HTTP Header Auth):
```
Name: ElevenLabs
Header Name: xi-api-key
Header Value: your-elevenlabs-key
```

##### Google Drive:
```
Name: Google Search API (reused for Drive)
Type: Service Account
Email: your-service-account@project.iam.gserviceaccount.com
Private Key: (paste your private key)
```

##### Pinecone:
```
Name: AI Agents
API Key: pcsk_2R6V3W_U7BaEjBzNoPCmaBgMsmFmBH3ApA9GyqJxeMwugnCR63QeQwGpDhiorJr8msh3Qe
Environment: us-east-1
```

#### 4.5 Update Workflow Nodes

1. **Update all Pinecone nodes**: Set correct index names and enable them
2. **Update HTTP Request to Backend**: Set `BACKEND_URL` to your Railway URL
3. **Test each node**: Click "Execute Node" to verify

#### 4.6 Activate Workflow

```bash
1. Click "Active" toggle in top right
2. Note the webhook URL (shown in webhook node)
3. Copy webhook URL for frontend configuration
```

**Webhook URL will be**: `https://your-n8n.cloud/webhook/journey-create`

---

### Phase 5: Frontend Deployment (10 minutes)

#### 5.1 Configure Environment Variables

Create `frontend/.env.production` using [`ENV_VARIABLES_FRONTEND.md`](./ENV_VARIABLES_FRONTEND.md):

```bash
VITE_API_URL=https://your-backend.railway.app
VITE_N8N_WEBHOOK_URL=https://your-n8n.cloud/webhook/journey-create
VITE_ENV=production
```

#### 5.2 Build Frontend

```bash
cd frontend
npm install
npm run build
```

#### 5.3 Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
# Project Settings → Environment Variables
```

Add these in Vercel dashboard:
- `VITE_API_URL` = `https://your-backend.railway.app`
- `VITE_N8N_WEBHOOK_URL` = `https://your-n8n.cloud/webhook/journey-create`

#### 5.4 Alternative: Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod

# Set environment variables
netlify env:set VITE_API_URL "https://your-backend.railway.app"
netlify env:set VITE_N8N_WEBHOOK_URL "https://your-n8n.cloud/webhook/journey-create"
```

---

### Phase 6: Integration & Testing (10 minutes)

#### 6.1 Update Backend with Frontend URL

In Railway dashboard, add:
```bash
FRONTEND_URL=https://your-app.vercel.app
CORS_ORIGIN=https://your-app.vercel.app
```

#### 6.2 Update n8n Workflow

In n8n, update "Notify Backend" node:
```
URL: https://your-backend.railway.app/api/webhooks/n8n/journey-complete
Header: Authorization = Bearer <N8N_API_KEY>
```

#### 6.3 Test End-to-End

```bash
1. Open frontend: https://your-app.vercel.app
2. Sign up / Log in
3. Create a journey
4. Monitor n8n workflow execution
5. Check MongoDB for created records
6. Verify email notification received
7. Check journey appears in dashboard
```

---

## 🔐 Security Checklist

Before going live:

- [ ] Rotate all API keys from their default values
- [ ] Generate strong random JWT_SECRET
- [ ] Enable HTTPS on all services
- [ ] Set up CORS properly (no wildcards in production)
- [ ] Secure MongoDB with IP whitelist
- [ ] Enable MongoDB Atlas authentication
- [ ] Set up rate limiting
- [ ] Add input validation on all endpoints
- [ ] Enable logging and monitoring
- [ ] Set up backup for MongoDB
- [ ] Configure error tracking (Sentry)

---

## 📊 Monitoring & Maintenance

### Backend Monitoring

**Railway Dashboard:**
- Monitor CPU/Memory usage
- Check logs for errors
- Set up alerts

**MongoDB Atlas:**
- Monitor database size
- Check slow queries
- Set up automated backups

### n8n Monitoring

**n8n Dashboard:**
- Check workflow executions
- Monitor failed executions
- Set up error notifications

### Frontend Monitoring

**Vercel Analytics:**
- Track page loads
- Monitor build times
- Check error rates

---

## 🐛 Troubleshooting

### Backend Issues

#### "Cannot connect to MongoDB"
```bash
# Check connection string format
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database

# Verify IP whitelist in MongoDB Atlas
# Add 0.0.0.0/0 for testing (restrict in production)

# Test connection
node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('Connected!'))"
```

#### "JWT malformed"
```bash
# Ensure JWT_SECRET is set
echo $JWT_SECRET

# Generate new secret
openssl rand -base64 32
```

### n8n Issues

#### "Webhook not found"
- Check workflow is activated
- Verify webhook URL matches frontend config
- Check webhook path in workflow settings

#### "Pinecone connection failed"
- Verify API key is correct
- Check indices are created and "Ready"
- Ensure index names match exactly

#### "MongoDB operation failed"
- Verify MongoDB credential in n8n
- Check collection names are correct
- Ensure network access from n8n IP

### Frontend Issues

#### "Network Error"
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend
- Test backend endpoint directly

#### "Journey creation hangs"
- Check n8n workflow execution
- Verify webhook URL is accessible
- Check backend logs for errors

---

## 📈 Performance Optimization

### Backend
```javascript
// Enable compression
app.use(compression());

// Add caching
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 });

// Database connection pooling
mongoose.connect(uri, {
  maxPoolSize: 10,
  minPoolSize: 5
});
```

### Frontend
```javascript
// Code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Image optimization
// Use Vercel Image Optimization or Cloudinary

// Bundle size optimization
vite.build({ minify: true, sourcemap: false });
```

### n8n
- Use batch operations where possible
- Enable workflow execution data deletion
- Monitor execution time

---

## 💰 Cost Estimate (Free Tier)

| Service | Free Tier | Paid Tier (if needed) |
|---------|-----------|----------------------|
| MongoDB Atlas | 512 MB | $9/month (2GB) |
| Railway | $5 credit/month | $10/month |
| Vercel | Unlimited hobby projects | $20/month Pro |
| n8n Cloud | 5,000 executions | $20/month |
| Pinecone | 1 pod, 100K vectors | $70/month |
| OpenAI | $5 free credit | Pay-as-you-go |
| Anthropic | $5 free credit | Pay-as-you-go |
| ElevenLabs | 10,000 chars/month | $5/month |

**MVP on Free Tier**: ~$0-10/month  
**Production**: ~$50-150/month

---

## 🎉 Success Checklist

Your system is working if:
- [ ] Frontend loads without errors
- [ ] User can sign up and log in
- [ ] Journey creation form submits successfully
- [ ] n8n workflow executes (check n8n dashboard)
- [ ] Journey appears in MongoDB
- [ ] User receives completion email
- [ ] Journey shows in user dashboard
- [ ] Audio files are accessible
- [ ] All 7 days are generated

---

## 🆘 Getting Help

- **Documentation**: See all MD files in `/n8n-workflows`
- **Logs**: Check Railway, Vercel, and n8n logs
- **Database**: Query MongoDB Atlas directly
- **Community**: n8n community forum, Stack Overflow

---

## 📚 Additional Resources

- [N8N Documentation](https://docs.n8n.io)
- [Railway Deployment Guide](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [Pinecone Documentation](https://docs.pinecone.io)

---

**Deployment Status**: Ready for production  
**Last Updated**: November 2025  
**Version**: 1.0.0

🎯 **You're ready to deploy! Follow the steps in order and refer back as needed.**

