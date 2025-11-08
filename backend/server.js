import app from './src/app.js';
import { config, validateEnv } from './src/config/env.js';
import { connectScriptsDb } from './src/config/mongodb.js';

// Validate environment variables
try {
  validateEnv();
  console.log('✅ Environment variables validated');
} catch (error) {
  console.error('❌ Environment validation failed:', error.message);
  process.exit(1);
}

// Connect to databases
async function connectDatabases() {
  try {
    if (config.mongodb.scriptsUri) {
      await connectScriptsDb();
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    // Don't exit - some features may still work
  }
}

// Start server
async function startServer() {
  await connectDatabases();
  
  const PORT = config.port;
  
  app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🧘 AI Hypnosis Generator - Backend API             ║
║                                                       ║
║   Environment: ${config.nodeEnv.padEnd(38)}║
║   Port: ${PORT.toString().padEnd(44)}║
║   URL: http://localhost:${PORT.toString().padEnd(31)}║
║                                                       ║
║   Health Check: http://localhost:${PORT}/health${' '.repeat(14)}║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
    `);
  });
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

