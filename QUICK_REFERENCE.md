# Quick Reference Guide - AI Hypnosis Generator

## 📁 File Directory

```
📂 Meditation Generator/
├── 📄 README.md                      ← Start here! Project overview
├── 📄 GETTING_STARTED.md             ← Your next step guide
├── 📄 QUICK_REFERENCE.md             ← You are here
├── 📄 PROJECT_PLAN.md                ← Master plan (8-10 weeks)
├── 📄 FRONTEND_PLAN.md               ← React frontend specs
├── 📄 BACKEND_PLAN.md                ← Node.js backend specs
├── 📄 N8N_WORKFLOW_PLAN.md           ← AI workflow + prompts
├── 📄 ASCII_WORKFLOW_DIAGRAM.md      ← Visual diagrams
├── 📄 DATABASE_SETUP_GUIDE.md        ← Database setup
├── 📄 AI_MODELS_INTEGRATION.md       ← AI integration
└── 📄 DEPLOYMENT_GUIDE.md            ← Deployment steps
```

---

## 🔍 Find What You Need

### "I want to..."

#### Build the Frontend
→ `FRONTEND_PLAN.md`
- Page 14: Complete page specifications
- Page 28: Component library
- Page 32: Design system
- Page 38: Replit build prompt

#### Build the Backend
→ `BACKEND_PLAN.md`
- Page 8: API endpoints
- Page 12: Authentication system
- Page 18: Database services
- Page 42: Package.json

#### Create the AI Workflow
→ `N8N_WORKFLOW_PLAN.md`
- Page 6: Workflow architecture
- Page 10: Node configurations
- Page 15: AI agent prompts (15+ ready to use!)
- Page 45: Audio generation

#### Set Up Databases
→ `DATABASE_SETUP_GUIDE.md`
- Page 3: Supabase setup
- Page 8: Pinecone setup
- Page 15: MongoDB setup
- Page 22: Test scripts

#### Integrate AI Models
→ `AI_MODELS_INTEGRATION.md`
- Page 3: OpenAI setup
- Page 8: Anthropic setup
- Page 12: Cohere embeddings
- Page 15: ElevenLabs TTS

#### Deploy Everything
→ `DEPLOYMENT_GUIDE.md`
- Page 5: Frontend deployment (Vercel)
- Page 10: Backend deployment (Railway)
- Page 15: n8n deployment
- Page 25: Environment variables

#### Understand the System
→ `ASCII_WORKFLOW_DIAGRAM.md`
- Page 2: Complete system flow
- Page 4: n8n workflow visualization
- Page 7: Data flow
- Page 9: Deployment architecture

---

## 🎯 Common Tasks

### Task: Create a New User

**Files**: `BACKEND_PLAN.md` (page 8), `DATABASE_SETUP_GUIDE.md` (page 3)

**Steps**:
1. User registers via frontend
2. Backend hashes password (bcrypt)
3. Creates user in Supabase `users` table
4. Creates profile in `profiles` table
5. Creates stats in `user_stats` table
6. Returns JWT token

**Code**: See `BACKEND_PLAN.md` → "Authentication System"

---

### Task: Generate a Journey

**Files**: `N8N_WORKFLOW_PLAN.md` (complete), `BACKEND_PLAN.md` (page 18)

**Steps**:
1. User fills journey creation form
2. Frontend sends to backend API
3. Backend creates journey record (status: 'creating')
4. Backend triggers n8n webhook
5. n8n workflow runs (5-10 minutes):
   - Searches knowledge bases
   - Runs AI agents
   - Generates scripts
   - Creates audio
   - Stores in Drive
6. n8n sends webhook back to backend
7. Backend updates journey (status: 'ready')
8. Backend sends email to user

**Prompts**: All in `N8N_WORKFLOW_PLAN.md`

---

### Task: Generate Audio

**Files**: `AI_MODELS_INTEGRATION.md` (page 15), `N8N_WORKFLOW_PLAN.md` (page 45)

**Steps**:
1. Retrieve script sections from MongoDB
2. For each section:
   - Call ElevenLabs TTS API
   - Save audio file
3. Generate background sound
4. Merge voice + background (ffmpeg)
5. Upload to Google Drive
6. Update MongoDB with URL

**Code**: See `AI_MODELS_INTEGRATION.md` → "ElevenLabs Integration"

---

### Task: Deploy to Production

**Files**: `DEPLOYMENT_GUIDE.md` (complete)

**Steps**:
1. Push code to GitHub
2. Deploy frontend to Vercel (automatic)
3. Deploy backend to Railway (automatic)
4. Deploy n8n to Railway
5. Set environment variables
6. Initialize databases
7. Test end-to-end
8. Launch!

**Checklist**: See `DEPLOYMENT_GUIDE.md` → "Launch Checklist"

---

## 📊 Key Metrics

### Performance Targets
- Journey creation: **5-10 minutes**
- API response: **<200ms** (p95)
- Frontend load: **<2s**
- Workflow success: **>95%**
- System uptime: **>99.5%**

### Cost Estimates
- **Minimum**: $130/month (low usage)
- **Average**: $300/month (moderate usage)
- **Maximum**: $555/month (high usage)

See `DEPLOYMENT_GUIDE.md` → "Cost Optimization"

---

## 🔑 Environment Variables

### Frontend (3 variables)
```bash
VITE_API_URL=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### Backend (25+ variables)
See `DEPLOYMENT_GUIDE.md` page 12 for complete list.

**Categories**:
- Server (2)
- Databases (4)
- Pinecone (6)
- AI Models (4)
- ElevenLabs (2)
- Google (2)
- Gmail (2)
- n8n (2)
- JWT (2)

---

## 🗄️ Database Schema

### Supabase Tables (6 tables)
1. `users` - User accounts
2. `profiles` - User preferences
3. `journeys` - Journey records
4. `journey_days` - Individual days
5. `journal_entries` - User journals
6. `user_stats` - Streaks & stats

**SQL**: `DATABASE_SETUP_GUIDE.md` page 3-10

### Pinecone Indices (4 indices)
1. `user-information` - User data
2. `core-hypnosis-knowledge` - Techniques
3. `past-creations` - Previous journeys
4. `interest-trends` - Popular topics

**Config**: `DATABASE_SETUP_GUIDE.md` page 15-18

### MongoDB Collections (4 collections)
1. `drafts` - Script drafts
2. `sections` - Script sections
3. `evaluations` - Quality scores
4. `workflow_logs` - Execution logs

**Schema**: `DATABASE_SETUP_GUIDE.md` page 22-25

---

## 🤖 AI Agent Prompts

### Location
All prompts are in `N8N_WORKFLOW_PLAN.md`

### Available Agents (15+)

**Research Agents**:
- Knowledge Extraction Agent (page 15)
- Reverse Engineering Agent (page 25)
- Rating & Evaluation Agent (page 30)

**Planning Agents**:
- Script Suggestions Agent (page 33)
- Script Elements Agent (page 35)
- User Personalization Agent (page 38)

**Writing Agents** (per day):
- Intention & Calibration (page 42)
- Induction (page 44)
- Deepener (page 46)
- Suggestions (page 48)
- Future Pacing (page 50)
- Awakening (page 52)

**Quality Control**:
- Evaluator Agent (page 54)

All prompts are **copy-paste ready**!

---

## 🎨 Design System

### Colors
```css
Primary: #3b82f6 (blue)
Secondary: #a855f7 (purple)
Success: #10b981 (green)
Error: #ef4444 (red)
```

### Typography
```css
Font: 'Inter', sans-serif
H1: 3rem (48px)
H2: 2.25rem (36px)
Body: 1rem (16px)
```

### Spacing
```css
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
```

**Complete system**: `FRONTEND_PLAN.md` page 32-34

---

## 🔗 API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

### Journeys
```
POST   /api/journeys
GET    /api/journeys
GET    /api/journeys/:id
GET    /api/journeys/:id/days
POST   /api/journeys/:id/days/:dayNumber/complete
```

### Journal
```
POST   /api/journal
GET    /api/journal
GET    /api/journal/:id
PUT    /api/journal/:id
DELETE /api/journal/:id
```

**Complete list**: `BACKEND_PLAN.md` page 8-10

---

## 🧪 Testing

### Frontend
```bash
cd frontend
npm test
npm run test:coverage
```

### Backend
```bash
cd backend
npm test
npm run test:integration
```

### E2E
```bash
npm run test:e2e
```

**Test strategies**: `PROJECT_PLAN.md` page 18

---

## 🚨 Troubleshooting

### Frontend won't start
1. Check Node.js version (20+)
2. Delete `node_modules`, reinstall
3. Check `.env` file
4. Clear browser cache

### Backend connection errors
1. Verify database URLs
2. Check API keys
3. Test database connections
4. Check Railway logs

### n8n workflow fails
1. Check execution logs
2. Verify credentials
3. Test nodes individually
4. Check API rate limits

**Detailed troubleshooting**: `DEPLOYMENT_GUIDE.md` page 40-42

---

## 📞 Quick Links

### External Services

**Hosting**:
- Vercel: [vercel.com](https://vercel.com)
- Railway: [railway.app](https://railway.app)

**Databases**:
- Supabase: [supabase.com](https://supabase.com)
- Pinecone: [pinecone.io](https://pinecone.io)
- MongoDB: [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)

**AI Services**:
- OpenAI: [platform.openai.com](https://platform.openai.com)
- Anthropic: [console.anthropic.com](https://console.anthropic.com)
- Cohere: [cohere.com](https://cohere.com)
- ElevenLabs: [elevenlabs.io](https://elevenlabs.io)

**Workflow**:
- n8n: [n8n.io](https://n8n.io)

**Other**:
- Google Cloud: [console.cloud.google.com](https://console.cloud.google.com)

---

## 💡 Pro Tips

1. **Start with backend** - It's the foundation
2. **Use the prompts** - They're production-ready
3. **Test incrementally** - Don't wait until the end
4. **Monitor costs** - Set up budget alerts
5. **Use free tiers** - Start cheap, scale later
6. **Read the docs** - Everything is documented
7. **Ask AI assistants** - Feed them the documentation
8. **Join communities** - Discord/Slack for each tech
9. **Version control** - Commit often
10. **Have fun!** - This is a cool project 🎉

---

## 🎯 MVP Checklist

Minimum features for launch:

- [ ] User registration/login
- [ ] Basic onboarding (10 questions minimum)
- [ ] Journey creation
- [ ] 7-day script generation
- [ ] Audio generation
- [ ] Simple dashboard
- [ ] Email notifications
- [ ] Basic error handling
- [ ] Mobile responsive
- [ ] HTTPS enabled

**Detailed checklist**: `DEPLOYMENT_GUIDE.md` page 35

---

## 📈 Next Steps After Launch

1. **Monitor** - Watch metrics, fix bugs
2. **Collect feedback** - User surveys
3. **Iterate** - Improve based on feedback
4. **Add features** - Journal, stats, etc.
5. **Optimize** - Performance, costs
6. **Market** - SEO, ads, content
7. **Scale** - Upgrade services as needed
8. **Expand** - New journey types, languages

---

## 🎓 Learning Path

If you're new to this:

**Week 1**: Learn basics
- React fundamentals
- Node.js basics
- REST APIs

**Week 2**: Learn tools
- Supabase
- n8n
- OpenAI API

**Week 3**: Build MVP
- Simple auth
- Basic journey creation
- One AI agent

**Week 4**: Expand
- Add more features
- Improve UI
- Add more agents

**Resources**: `GETTING_STARTED.md` page 25

---

## ✅ You Have Everything!

This quick reference + 9 detailed docs = Complete project blueprint.

**Ready to build?** → Start with `GETTING_STARTED.md`

**Need details?** → Check the specific doc for that topic

**Stuck?** → Search the docs, they cover everything!

---

**Version**: 1.0.0  
**Last Updated**: November 8, 2025  
**Status**: Ready to Build ✅

