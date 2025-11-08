# Build Guide - AI Hypnosis Generator

## 🎉 Project Structure Created!

The complete project structure has been built with:
- ✅ Backend API (Node.js + Express)
- ✅ Frontend (React + Vite)
- ✅ Configuration files
- ✅ Documentation

---

## 📁 What's Been Built

### Backend (`/backend`)
- **Configuration**: Environment setup, database connections
- **Authentication**: JWT-based auth with bcrypt
- **API Routes**: Auth, Profile, Journeys, Journal, Stats
- **Middleware**: Authentication, error handling
- **Server**: Express app with health checks

### Frontend (`/frontend`)
- **Pages**: Landing, Login, Register, Dashboard, Onboarding, Journey Creation
- **State Management**: Zustand for auth
- **API Integration**: Axios with interceptors
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router v6

### Documentation
- Complete setup guides
- API documentation
- Deployment instructions

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env with your credentials
# At minimum, set:
# - SUPABASE_URL
# - SUPABASE_SERVICE_KEY
# - JWT_SECRET

# Start development server
npm run dev
```

Backend will run at: http://localhost:3000

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env
# Set VITE_API_URL=http://localhost:3000

# Start development server
npm run dev
```

Frontend will run at: http://localhost:5173

---

## 📋 Next Steps

### 1. Set Up Databases

Follow `DATABASE_SETUP_GUIDE.md`:

1. **Supabase** (PostgreSQL)
   - Create project
   - Run SQL from guide to create tables
   - Get URL and service key

2. **Pinecone** (Vector DB)
   - Create 4 indices
   - Get API key

3. **MongoDB Atlas** (Script Storage)
   - Create cluster
   - Get connection string

### 2. Get API Keys

You'll need:
- OpenAI API key
- Anthropic API key
- Cohere API key
- ElevenLabs API key
- Google Cloud credentials (Drive & Gmail)

### 3. Configure n8n

Follow `N8N_WORKFLOW_PLAN.md`:
- Deploy n8n instance
- Import workflow
- Configure all credentials
- Activate workflow

### 4. Test the Application

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Open http://localhost:5173
4. Register a new account
5. Test the flow

---

## 🏗️ Project Structure

```
meditation-generator/
├── backend/                 # Node.js API
│   ├── src/
│   │   ├── config/         # Database & env config
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth & validation
│   │   └── app.js          # Express app
│   ├── server.js           # Entry point
│   ├── package.json
│   └── env.example
│
├── frontend/               # React app
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand stores
│   │   ├── services/      # API services
│   │   ├── styles/        # CSS
│   │   ├── App.jsx        # Main app
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── n8n-workflows/          # n8n configurations
│   └── README.md
│
└── docs/                   # All documentation
    ├── PROJECT_PLAN.md
    ├── FRONTEND_PLAN.md
    ├── BACKEND_PLAN.md
    ├── N8N_WORKFLOW_PLAN.md
    └── ... (8 more docs)
```

---

## 🔧 Development

### Backend Commands

```bash
npm run dev      # Start with nodemon
npm start        # Start production
npm test         # Run tests
npm run lint     # Lint code
```

### Frontend Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Lint code
```

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Journeys
- `POST /api/journeys` - Create journey
- `GET /api/journeys` - List journeys
- `GET /api/journeys/:id` - Get journey details

### Profile
- `GET /api/profile` - Get profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/onboarding` - Complete onboarding

### Journal
- `POST /api/journal` - Create entry
- `GET /api/journal` - List entries
- `GET /api/journal/:id` - Get entry
- `PUT /api/journal/:id` - Update entry
- `DELETE /api/journal/:id` - Delete entry

### Stats
- `GET /api/stats` - Get user stats

---

## 🎨 Frontend Pages

- `/` - Landing page
- `/login` - Login
- `/register` - Registration
- `/onboarding` - User onboarding
- `/create-journey` - Create new journey
- `/journey/:id/creating` - Loading screen
- `/dashboard` - Main dashboard
- `/dashboard/journey/:id` - Journey details

---

## 📝 Environment Variables

### Backend (`.env`)

```bash
# Required
SUPABASE_URL=your-url
SUPABASE_SERVICE_KEY=your-key
JWT_SECRET=your-secret

# Optional (for full functionality)
MONGODB_SCRIPTS_URI=your-mongodb-uri
PINECONE_API_KEY=your-pinecone-key
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
COHERE_API_KEY=your-cohere-key
ELEVENLABS_API_KEY=your-elevenlabs-key
N8N_WEBHOOK_URL=your-n8n-url
```

### Frontend (`.env`)

```bash
VITE_API_URL=http://localhost:3000
```

---

## 🚀 Deployment

### Frontend (Vercel)

```bash
# Connect GitHub repo to Vercel
# Set environment variables
# Deploy automatically on push to main
```

### Backend (Railway)

```bash
# Connect GitHub repo to Railway
# Set environment variables
# Deploy automatically on push to main
```

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

---

## 🐛 Troubleshooting

### Backend won't start
- Check `.env` file exists
- Verify SUPABASE_URL and SUPABASE_SERVICE_KEY
- Check Node.js version (need 20+)

### Frontend won't start
- Run `npm install` first
- Check `.env` file
- Verify VITE_API_URL is correct

### Can't login
- Check backend is running
- Verify database tables exist
- Check browser console for errors

---

## 📚 Documentation

All documentation is in the root directory:

1. `README.md` - Project overview
2. `GETTING_STARTED.md` - Quick start guide
3. `PROJECT_PLAN.md` - Complete project plan
4. `FRONTEND_PLAN.md` - Frontend specifications
5. `BACKEND_PLAN.md` - Backend specifications
6. `N8N_WORKFLOW_PLAN.md` - AI workflow details
7. `DATABASE_SETUP_GUIDE.md` - Database setup
8. `AI_MODELS_INTEGRATION.md` - AI integration
9. `DEPLOYMENT_GUIDE.md` - Deployment instructions
10. `ASCII_WORKFLOW_DIAGRAM.md` - Visual diagrams
11. `QUICK_REFERENCE.md` - Quick lookup
12. `REPOSITORY_INFO.md` - Git workflow

---

## ✅ Current Status

- ✅ Project structure created
- ✅ Backend API built (MVP)
- ✅ Frontend built (MVP)
- ✅ Authentication working
- ✅ Basic routing working
- ⏳ Database setup (manual)
- ⏳ n8n workflow (manual)
- ⏳ AI integrations (manual)
- ⏳ Full features (in progress)

---

## 🎯 What Works Now

1. **User Registration & Login**
   - Create account
   - Login with email/password
   - JWT authentication

2. **Basic Navigation**
   - Landing page
   - Dashboard
   - Journey creation form

3. **API Structure**
   - All routes defined
   - Authentication middleware
   - Error handling

---

## 🔜 What's Next

1. **Complete Database Setup**
   - Run Supabase SQL
   - Create Pinecone indices
   - Set up MongoDB

2. **Build n8n Workflow**
   - Import workflow template
   - Configure AI agents
   - Test workflow

3. **Add Full Features**
   - Onboarding wizard
   - Journey timeline
   - Audio player
   - Stats dashboard
   - Journal

4. **Deploy to Production**
   - Vercel (frontend)
   - Railway (backend)
   - n8n Cloud

---

## 💡 Tips

1. Start with just Supabase to get auth working
2. Add other services incrementally
3. Test each feature as you build
4. Use the documentation - it's comprehensive!
5. Join Discord/Slack communities for help

---

## 🤝 Need Help?

- Check the documentation files
- Review `TROUBLESHOOTING` sections
- Search GitHub issues
- Ask in community forums

---

**Build Status**: MVP Complete ✅  
**Last Updated**: November 8, 2025  
**Version**: 1.0.0

