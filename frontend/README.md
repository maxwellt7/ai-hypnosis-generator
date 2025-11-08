# Frontend - AI Hypnosis Generator

## Setup

1. Copy `env.example` to `.env` and configure:
   ```bash
   cp env.example .env
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:3000)

## Pages

- `/` - Landing page
- `/login` - Login
- `/register` - Registration
- `/onboarding` - User onboarding (20 questions)
- `/create-journey` - Create new journey
- `/journey/:id/creating` - Journey creation loading
- `/dashboard` - Main dashboard
- `/dashboard/journey/:id` - Journey detail view

## Tech Stack

- React 18
- Vite 5
- React Router v6
- Zustand (state management)
- Tailwind CSS
- Axios

## Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Lint code
```

