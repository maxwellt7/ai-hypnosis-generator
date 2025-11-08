import { MongoClient } from 'mongodb';
import { config } from './env.js';

let scriptsDb = null;

export async function connectScriptsDb() {
  if (scriptsDb) return scriptsDb;
  
  const client = new MongoClient(config.mongodb.scriptsUri);
  await client.connect();
  scriptsDb = client.db('hypnosis-scripts');
  
  console.log('✅ Connected to MongoDB (Scripts)');
  return scriptsDb;
}

export async function getScriptsDb() {
  if (!scriptsDb) {
    await connectScriptsDb();
  }
  return scriptsDb;
}

