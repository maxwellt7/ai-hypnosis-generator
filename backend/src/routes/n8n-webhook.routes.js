/**
 * N8N Webhook Routes
 * Handles incoming webhooks from n8n workflow
 */

import express from 'express';
import * as n8nWebhookController from '../controllers/n8n-webhook.controller.js';
import { verifyN8NWebhook } from '../middleware/n8n-auth.middleware.js';

const router = express.Router();

/**
 * @route   POST /api/webhooks/n8n/journey-complete
 * @desc    Handle journey completion webhook from n8n
 * @access  Private (N8N only)
 */
router.post(
  '/journey-complete',
  verifyN8NWebhook,
  n8nWebhookController.handleJourneyComplete
);

/**
 * @route   POST /api/webhooks/n8n/journey-error
 * @desc    Handle journey error webhook from n8n
 * @access  Private (N8N only)
 */
router.post(
  '/journey-error',
  verifyN8NWebhook,
  n8nWebhookController.handleJourneyError
);

/**
 * @route   POST /api/webhooks/n8n/journey-progress
 * @desc    Handle journey progress update webhook from n8n
 * @access  Private (N8N only)
 */
router.post(
  '/journey-progress',
  verifyN8NWebhook,
  n8nWebhookController.handleJourneyProgress
);

export default router;

