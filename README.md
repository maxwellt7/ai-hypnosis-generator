# AI Hypnosis Generator - Complete Project Documentation

## 🎯 Project Overview

An AI-powered hypnosis journey generator that creates personalized 7-day hypnosis programs. The system uses multi-agent AI workflows to research, draft, evaluate, and produce custom audio hypnosis tracks tailored to each user's goals and preferences.

---

## 📚 Documentation Index

This project includes comprehensive documentation for every aspect of development and deployment:

### Core Documentation

1. **[PROJECT_PLAN.md](./PROJECT_PLAN.md)**
   - Complete project architecture
   - Phase-by-phase development plan
   - Technology stack overview
   - Timeline estimates
   - Success metrics

2. **[FRONTEND_PLAN.md](./FRONTEND_PLAN.md)**
   - Vite + React frontend architecture
   - Complete page specifications
   - Component library
   - State management
   - Design system
   - Replit build prompt

3. **[BACKEND_PLAN.md](./BACKEND_PLAN.md)**
   - Node.js + Express backend architecture
   - API endpoint specifications
   - Service layer design
   - Authentication system
   - Database integration
   - Package dependencies

4. **[N8N_WORKFLOW_PLAN.md](./N8N_WORKFLOW_PLAN.md)**
   - Complete workflow architecture
   - 50+ node configurations
   - 15+ AI agent prompts
   - Sub-agent specifications
   - Error handling
   - Timing breakdown

5. **[ASCII_WORKFLOW_DIAGRAM.md](./ASCII_WORKFLOW_DIAGRAM.md)**
   - Visual workflow representation
   - System architecture diagrams
   - Data flow visualization
   - Deployment architecture
   - Timing breakdowns

### Setup & Configuration

6. **[DATABASE_SETUP_GUIDE.md](./DATABASE_SETUP_GUIDE.md)**
   - Supabase (PostgreSQL) setup
   - Pinecone vector database setup
   - MongoDB Atlas setup
   - Schema definitions
   - Index configurations
   - Test scripts

7. **[AI_MODELS_INTEGRATION.md](./AI_MODELS_INTEGRATION.md)**
   - OpenAI (GPT-4) integration
   - Anthropic (Claude) integration
   - DeepSeek integration
   - Cohere embeddings
   - ElevenLabs TTS
   - Usage examples
   - Cost management

8. **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**
   - Vercel frontend deployment
   - Railway backend deployment
   - n8n workflow deployment
   - Environment configuration
   - Monitoring setup
   - Rollback procedures
   - Security checklist

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE                            │
│              (Vite + React on Vercel)                        │
│  Landing → Register → Onboarding → Create Journey           │
│              ↓                                               │
│         Dashboard (Journey, Profile, Stats, Journal)         │
└─────────────────────┬───────────────────────────────────────┘
                      │ REST API
                      ↓
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND API                                │
│            (Node.js + Express on Railway)                    │
│  Auth | Profile | Journey | Journal | Stats | Admin         │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
┌─────────────┐ ┌──────────┐ ┌──────────────┐
│  Supabase   │ │ Pinecone │ │   MongoDB    │
│ (Postgres)  │ │ (Vectors)│ │  (Scripts)   │
└─────────────┘ └──────────┘ └──────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│                  n8n WORKFLOW ENGINE                         │
│               (Railway or n8n Cloud)                         │
│                                                              │
│  Knowledge Search → AI Agents → Script Generation →         │
│  Evaluation Loop → Audio Generation → Delivery              │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
┌─────────────┐ ┌──────────┐ ┌──────────────┐
│  AI Models  │ │  Google  │ │    Gmail     │
│ OpenAI, etc │ │  Drive   │ │   (Email)    │
└─────────────┘ └──────────┘ └──────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- Git
- Accounts for all services (see documentation)

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/meditation-generator.git
cd meditation-generator
```

### 2. Setup Databases

Follow **[DATABASE_SETUP_GUIDE.md](./DATABASE_SETUP_GUIDE.md)** to:
- Create Supabase project and tables
- Create 4 Pinecone indices
- Setup MongoDB Atlas cluster

### 3. Configure Environment Variables

#### Frontend `.env`

```bash
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

#### Backend `.env`

```bash
# Copy from .env.example and fill in all values
# See DEPLOYMENT_GUIDE.md for complete list
```

### 4. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 5. Run Development Servers

```bash
# Terminal 1: Frontend
cd frontend
npm run dev
# Opens at http://localhost:5173

# Terminal 2: Backend
cd backend
npm run dev
# Runs at http://localhost:3000
```

### 6. Setup n8n

Follow **[N8N_WORKFLOW_PLAN.md](./N8N_WORKFLOW_PLAN.md)** to:
- Deploy n8n instance
- Import workflow
- Configure credentials
- Activate workflow

---

## 📋 Development Workflow

### Branch Strategy

- `main` - Production (auto-deploys to Vercel/Railway)
- `staging` - Pre-production testing
- `development` - Active development
- `feature/*` - Feature branches

### Commit Convention

```
feat: Add new feature
fix: Bug fix
docs: Documentation changes
style: Code style changes
refactor: Code refactoring
test: Test additions/changes
chore: Build/config changes
```

### Pull Request Process

1. Create feature branch from `development`
2. Make changes and commit
3. Push and create PR to `development`
4. Code review
5. Merge to `development`
6. Test on staging
7. Merge to `main` for production

---

## 🧪 Testing

### Frontend Tests

```bash
cd frontend
npm test
npm run test:coverage
```

### Backend Tests

```bash
cd backend
npm test
npm run test:integration
```

### E2E Tests

```bash
npm run test:e2e
```

---

## 📊 Key Features

### User Features

- ✅ User registration and authentication
- ✅ 20-question AI-powered onboarding
- ✅ Personalized 7-day hypnosis journey creation
- ✅ Custom audio generation with professional TTS
- ✅ Progress tracking and streak system
- ✅ Journal entries with AI insights
- ✅ Stats and analytics dashboard
- ✅ Email notifications

### Admin Features

- ✅ User management
- ✅ Journey overview
- ✅ System analytics
- ✅ Usage monitoring

### Technical Features

- ✅ Multi-agent AI workflow
- ✅ Vector database for semantic search
- ✅ Automated script evaluation
- ✅ Quality control loop (score ≥ 8)
- ✅ Background audio mixing
- ✅ Cloud storage integration
- ✅ Email delivery system

---

## 🎨 Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **HTTP**: Axios
- **Charts**: Recharts

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Auth**: JWT + bcrypt
- **Validation**: Joi/Zod
- **Logging**: Winston

### Databases
- **Primary**: Supabase (PostgreSQL)
- **Vectors**: Pinecone (1024 dimensions)
- **Scripts**: MongoDB Atlas

### AI Services
- **Text**: OpenAI GPT-4, Anthropic Claude, DeepSeek
- **Embeddings**: Cohere (1024 dimensions)
- **TTS**: ElevenLabs
- **Transcription**: OpenAI Whisper

### Infrastructure
- **Frontend Host**: Vercel
- **Backend Host**: Railway
- **Workflow**: n8n (Railway or Cloud)
- **Storage**: Google Drive
- **Email**: Gmail SMTP

---

## 💰 Cost Estimate

### Monthly Costs (Estimated)

| Service | Cost |
|---------|------|
| Vercel (Frontend) | $0 (free tier) |
| Railway (Backend) | $5-20 |
| Railway (n8n) | $5-10 |
| Supabase | $0 (free tier) |
| Pinecone | $0 (free tier) |
| MongoDB Atlas | $0 (free tier) |
| OpenAI | $50-200 |
| Anthropic | $50-200 |
| ElevenLabs | $20-100 |
| Cohere | $0-20 |
| Google Cloud | $0-5 |
| **TOTAL** | **$130-555/month** |

*Costs vary based on usage. See DEPLOYMENT_GUIDE.md for optimization tips.*

---

## 📈 Performance Targets

- **Journey Creation**: 5-10 minutes
- **API Response Time**: <200ms (p95)
- **Frontend Load Time**: <2s
- **Workflow Success Rate**: >95%
- **System Uptime**: >99.5%

---

## 🔒 Security

- ✅ Environment variables for all secrets
- ✅ HTTPS on all endpoints
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Supabase Row Level Security
- ✅ Input validation and sanitization
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ SQL injection prevention
- ✅ XSS prevention

See **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for complete security checklist.

---

## 📝 Environment Variables

### Required Variables

See `.env.example` files in `frontend/` and `backend/` directories.

Complete list in **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**.

---

## 🐛 Troubleshooting

### Common Issues

**Frontend won't start**
- Check Node.js version (20+)
- Delete `node_modules` and reinstall
- Check environment variables

**Backend connection errors**
- Verify database connection strings
- Check API keys
- Ensure services are running

**n8n workflow fails**
- Check execution logs
- Verify all credentials
- Test each node individually

See **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for detailed troubleshooting.

---

## 📚 Additional Resources

### Documentation Files

1. `PROJECT_PLAN.md` - Overall project plan
2. `FRONTEND_PLAN.md` - Frontend specifications
3. `BACKEND_PLAN.md` - Backend specifications
4. `N8N_WORKFLOW_PLAN.md` - Workflow details
5. `ASCII_WORKFLOW_DIAGRAM.md` - Visual diagrams
6. `DATABASE_SETUP_GUIDE.md` - Database setup
7. `AI_MODELS_INTEGRATION.md` - AI integration
8. `DEPLOYMENT_GUIDE.md` - Deployment instructions

### External Documentation

- [Vite Docs](https://vitejs.dev)
- [React Docs](https://react.dev)
- [Express Docs](https://expressjs.com)
- [n8n Docs](https://docs.n8n.io)
- [Supabase Docs](https://supabase.com/docs)
- [Pinecone Docs](https://docs.pinecone.io)
- [OpenAI Docs](https://platform.openai.com/docs)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is proprietary and confidential.

---

## 👤 Author

**Max Mayes**

---

## 🎯 Project Status

**Status**: Documentation Complete ✅  
**Next Steps**: Begin implementation following the plans

### Implementation Checklist

- [ ] Setup development environment
- [ ] Create database schemas
- [ ] Build frontend MVP
- [ ] Build backend API
- [ ] Create n8n workflow
- [ ] Integrate AI services
- [ ] Test end-to-end
- [ ] Deploy to production
- [ ] Launch! 🚀

---

## 📞 Support

For questions or issues:
- Check documentation files
- Review troubleshooting section
- Contact: [your-email@example.com]

---

**Last Updated**: November 8, 2025  
**Version**: 1.0.0

