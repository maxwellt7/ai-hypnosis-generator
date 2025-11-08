# Backend - AI Hypnosis Generator

## Setup

1. Copy `env.example` to `.env` and fill in your values
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`

## Environment Variables

See `env.example` for required variables.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Profile
- `GET /api/profile` - Get profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/onboarding` - Complete onboarding

### Journeys
- `POST /api/journeys` - Create journey
- `GET /api/journeys` - List journeys
- `GET /api/journeys/:id` - Get journey
- `POST /api/journeys/:id/days/:dayNumber/complete` - Mark day complete

### Journal
- `POST /api/journal` - Create entry
- `GET /api/journal` - List entries
- `GET /api/journal/:id` - Get entry
- `PUT /api/journal/:id` - Update entry
- `DELETE /api/journal/:id` - Delete entry

### Stats
- `GET /api/stats` - Get user stats

## Development

```bash
npm run dev    # Start with nodemon
npm start      # Start production
npm test       # Run tests
npm run lint   # Lint code
```

## Database Setup

Run these scripts after setting up databases:

```bash
npm run setup:db           # Initialize Supabase tables
npm run setup:pinecone     # Create Pinecone indices
npm run seed:knowledge     # Seed hypnosis knowledge
```

