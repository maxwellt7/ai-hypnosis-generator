import { google } from 'googleapis';
import { logger } from '../utils/logger.js';
import fs from 'fs';

let auth = null;
let drive = null;
let gmail = null;

// Initialize Google APIs
export const initGoogleAPIs = async () => {
  try {
    const credentialsPath = process.env.GOOGLE_CREDENTIALS_JSON;
    
    if (!credentialsPath) {
      logger.warn('⚠️  Google credentials not configured');
      return null;
    }

    // Check if file exists
    if (!fs.existsSync(credentialsPath)) {
      logger.error('Google credentials file not found:', credentialsPath);
      return null;
    }

    // Load credentials
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

    // Create JWT auth client
    auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/gmail.send'
      ]
    );

    // Initialize services
    drive = google.drive({ version: 'v3', auth });
    gmail = google.gmail({ version: 'v1', auth });

    logger.info('✅ Google APIs initialized successfully');
    return { auth, drive, gmail };
  } catch (error) {
    logger.error('❌ Failed to initialize Google APIs:', error.message);
    return null;
  }
};

export const getDrive = () => {
  if (!drive) {
    throw new Error('Google Drive not initialized. Call initGoogleAPIs() first.');
  }
  return drive;
};

export const getGmail = () => {
  if (!gmail) {
    throw new Error('Gmail not initialized. Call initGoogleAPIs() first.');
  }
  return gmail;
};

// Upload file to Google Drive
export const uploadToDrive = async (fileName, mimeType, fileBuffer) => {
  const driveService = getDrive();
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  const fileMetadata = {
    name: fileName,
    parents: folderId ? [folderId] : undefined,
  };

  const media = {
    mimeType,
    body: fileBuffer,
  };

  const response = await driveService.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id, webViewLink, webContentLink',
  });

  return response.data;
};

// Make file publicly accessible
export const makeFilePublic = async (fileId) => {
  const driveService = getDrive();

  await driveService.permissions.create({
    fileId: fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  const file = await driveService.files.get({
    fileId: fileId,
    fields: 'webViewLink, webContentLink',
  });

  return file.data;
};

export default {
  initGoogleAPIs,
  getDrive,
  getGmail,
  uploadToDrive,
  makeFilePublic,
};

