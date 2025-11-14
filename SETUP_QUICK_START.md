# Quick Start Guide 🚀

## What You Need

1. **Node.js 20+** installed
2. **Supabase account** (free tier works)
3. **Code editor** (VS Code recommended)

## 5-Minute Setup

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (new terminal)
cd frontend
npm install
```

### 2. Setup Supabase

1. Go to https://supabase.com and create a project
2. Go to SQL Editor
3. Copy and paste the contents of `scripts/setup-supabase.sql`
4. Click "Run"
5. Copy your project URL and keys from Settings → API

### 3. Configure Environment

**Backend** - Create `backend/.env`:
```bash
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

SUPABASE_URL=your-supabase-url-here
SUPABASE_SERVICE_KEY=your-service-key-here

JWT_SECRET=your-random-secret-key-here
JWT_EXPIRES_IN=7d

# Optional: Add these later for full functionality
# MONGODB_SCRIPTS_URI=
# PINECONE_API_KEY=
# OPENAI_API_KEY=
# etc.
```

**Frontend** - Create `frontend/.env`:
```bash
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=your-supabase-url-here
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run the Apps

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Test It!

1. Open http://localhost:5173
2. Click "Get Started"
3. Register a new account
4. You're in! 🎉

## What Works Now

✅ User registration & login
✅ Dashboard view
✅ Profile management
✅ Basic journey creation (placeholder)
✅ Responsive UI

## What to Build Next

See `BUILD_README.md` for the full roadmap!

The main missing piece is the **n8n workflow** for AI script generation.
Everything else is foundation that's ready to build on.

---

**Need Help?** Check `BUILD_README.md` for detailed documentation.
