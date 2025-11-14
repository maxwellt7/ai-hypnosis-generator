import express from 'express';
import { webhookController } from '../controllers/webhook.controller.js';

const router = express.Router();

// Webhook routes (called by n8n)
// Note: In production, you should verify these requests come from your n8n instance
router.post('/n8n/journey-complete', webhookController.journeyComplete);
router.post('/n8n/audio-ready', webhookController.audioReady);
router.post('/n8n/error', webhookController.error);

export default router;

