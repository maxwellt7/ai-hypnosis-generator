// Application-wide constants

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

export const JOURNEY_STATUS = {
  CREATING: 'creating',
  READY: 'ready',
  COMPLETED: 'completed',
  ERROR: 'error',
};

export const TIME_OF_DAY = {
  MORNING: 'morning',
  AFTERNOON: 'afternoon',
  EVENING: 'evening',
  NIGHT: 'night',
};

export const DURATION_OPTIONS = [5, 10, 15, 20, 30]; // minutes

export const MOOD_SCALE = {
  MIN: 1,
  MAX: 10,
};

export const ONBOARDING_QUESTIONS_COUNT = 20;

export const JOURNEY_DAYS_COUNT = 7;

export const PINECONE_NAMESPACES = {
  USER_INFO: 'user-information',
  KNOWLEDGE: 'core-hypnosis-knowledge',
  CREATIONS: 'past-creations',
  TRENDS: 'interest-trends',
};

export const AI_MODELS = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  DEEPSEEK: 'deepseek',
};

export const VOICE_PROVIDERS = {
  ELEVENLABS: 'elevenlabs',
};

export const EMBEDDING_DIMENSIONS = 1024;

export const MIN_PASSWORD_LENGTH = 8;

export const MAX_GOAL_LENGTH = 500;
export const MIN_GOAL_LENGTH = 100;

export const MAX_INTENTION_LENGTH = 500;
export const MIN_INTENTION_LENGTH = 100;

export const MAX_JOURNAL_ENTRY_LENGTH = 5000;

export const EVALUATION_MIN_SCORE = 8; // Minimum score for script approval

export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

