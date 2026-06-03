# Development Workflow

Sacred Heart runs with a strict separation between production and development. This document explains how to work on the codebase without touching the live app at heart.sovereignty.app.

---

## Architecture overview

| Layer | Production | Staging / Dev |
|---|---|---|
| Frontend | Vercel `ai-hypnosis-generator` → `heart.sovereignty.app` (from `main`) | Vercel `ai-hypnosis-generator-staging` → `ai-hypnosis-generator-staging.vercel.app` (from `staging`) |
| Backend | Railway `nlp-training-backend` project — `production` environment | Railway `nlp-training-backend` project — `staging` environment |
| Auth | Clerk (production app) | Clerk (staging app or shared with caution) |
| Pinecone | Production indexes | `-staging` suffixed indexes (when enabled) |
| Stripe | Live mode webhooks | Test mode webhooks |

---

## Branching strategy

```
main            ← production-only. Never commit directly here.
  └── feature/your-feature   ← all development work
  └── fix/your-fix
staging         ← staging baseline. Merge main → staging to update.
```

Rules:
- **All changes go through pull requests.** `main` should only advance via PR merges.
- Name branches `feature/<slug>`, `fix/<slug>`, or `chore/<slug>`.
- The `staging` branch tracks the last staging-tested code. Merge `main` into `staging` after a production deploy when you want to reset the staging baseline.

---

## Vercel deployments (frontend)

There are two Vercel projects for this repo:

| Project | URL | Deploys from |
|---|---|---|
| `ai-hypnosis-generator` | heart.sovereignty.app | `main` branch (production) |
| `ai-hypnosis-generator-staging` | `ai-hypnosis-generator-staging.vercel.app` | `staging` branch (staging) |

Every pull request also gets an **automatic preview URL** from the production Vercel project — no manual steps needed. Preview deployments should point to the Railway staging backend URL.

### Vercel environment variables to configure

**In `ai-hypnosis-generator` (production Vercel project)** → Settings → Environment Variables:

| Variable | Environment | Value |
|---|---|---|
| `VITE_API_URL` | Production | `https://nlp-training-backend-production.up.railway.app` |
| `VITE_API_URL` | Preview | `https://nlp-training-backend-staging.up.railway.app` |

**In `ai-hypnosis-generator-staging`** → Settings → Environment Variables:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://nlp-training-backend-staging.up.railway.app` |

---

## Railway staging environment (backend)

The staging environment has already been created in the `nlp-training-backend` Railway project. It inherits all production env vars with two overrides:

| Var | Staging value |
|---|---|
| `FRONTEND_URL` | `https://ai-hypnosis-generator-staging.vercel.app` |
| `NODE_ENV` | `staging` |

**Staging backend URL:** `https://nlp-training-backend-staging.up.railway.app`

### One-time setup: connect staging branch (board action required)

The staging environment needs its `nlp-training-backend` service to deploy from the `staging` git branch:

1. Open [Railway → nlp-training-backend project](https://railway.app) → select **staging** environment.
2. Click the `nlp-training-backend` service → **Settings** → **Source** tab.
3. Under **GitHub repo**, select `maxwellt7/ai-hypnosis-generator` and set branch to `staging`.
4. Save — Railway will auto-deploy on every push to `staging`.

### Keeping staging in sync

```bash
# After a PR merges to main, update the staging baseline:
git checkout staging
git merge main
git push origin staging
# Railway auto-redeploys the staging service.
```

---

## Environment variable differences: staging vs production

These vars **must** differ between staging and production to prevent dev work from touching production data:

| Variable | Why it differs |
|---|---|
| `NODE_ENV` | `staging` vs `production` |
| `FRONTEND_URL` | Vercel staging URL vs heart.sovereignty.app |
| `JWT_SECRET` | Different secret — prevents session crossover |
| `REFRESH_TOKEN_SECRET` | Same reason |
| `STRIPE_WEBHOOK_SECRET` | Use Stripe test-mode webhook secret |
| `CLERK_PUBLISHABLE_KEY` | Ideally use Clerk staging app |
| `CLERK_SECRET_KEY` | Same |
| `PINECONE_INDEX_*` | `-staging` suffixed index names (when Pinecone is enabled) |
| `GHL_API_KEY` / `GHL_LOCATION_ID` | Use GHL test sub-account if available |

These vars **can be shared** safely:

| Variable | Notes |
|---|---|
| `ANTHROPIC_API_KEY` | API calls are stateless — safe to share |
| `ELEVENLABS_API_KEY` / voice IDs | Same |
| `META_CAPI_TOKEN` | Same |
| `PROVISION_SECRET` | OK to share or use a different value |
| `ENABLE_*` flags | Set independently per environment |

---

## Local development setup

### Prerequisites

- Node.js 20+ (`node -v` should show `v20.x.x`)
- A `.env` file in `backend/` (copy [`backend/.env.staging.example`](backend/.env.staging.example) → `backend/.env`, fill in staging values)
- A `.env.local` file in `frontend/` (copy `frontend/.env.example` → `frontend/.env.local`, set `VITE_API_URL=http://localhost:3001`)

### Running locally

**Terminal 1 — Backend:**

```bash
cd backend
cp .env.staging.example .env   # first time only — fill in your values
npm install                    # first time only
npm run dev                    # starts on http://localhost:3001 with nodemon
```

**Terminal 2 — Frontend:**

```bash
cd frontend
cp .env.example .env.local     # first time only
npm install                    # first time only
npm run dev                    # starts on http://localhost:5173
```

### Health check

```bash
curl http://localhost:3001/health
```

---

## CI (GitHub Actions)

Every PR triggers two checks (`.github/workflows/ci.yml`):

1. **Backend lint** — ESLint on the `backend/` directory.
2. **Frontend build** — `npm run build` in `frontend/` with placeholder env vars.

Both must pass before a PR can be merged. Fix lint errors locally with:

```bash
cd backend && npm run lint
cd frontend && npm run lint
```

---

## Quick reference: working on a feature

```bash
# 1. Start from main
git checkout main && git pull

# 2. Create your branch
git checkout -b feature/my-feature

# 3. Work and commit
git add <files>
git commit -m "feat: add my feature"

# 4. Push and open PR
git push -u origin feature/my-feature
# Open PR on GitHub — Vercel preview URL appears automatically, pointing to staging backend

# 5. Test with staging backend
# The preview deployment automatically uses VITE_API_URL for Preview env in Vercel

# 6. Get PR approved and merge to main
# Production auto-deploys from main via Vercel + Railway
```

---

## What to do if you accidentally touch production

1. **Stop immediately** — do not make more changes.
2. Check Railway logs for the production service to assess impact.
3. If only code was deployed: Railway supports instant rollbacks from the Deployments tab.
4. Notify the team of what happened.
