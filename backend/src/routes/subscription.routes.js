import express from 'express';
import { subscriptionController } from '../controllers/subscription.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All non-webhook subscription routes require authentication
router.use(authenticate);
router.post('/checkout', subscriptionController.createCheckoutSession);
router.post('/portal', subscriptionController.createPortalSession);
router.get('/status', subscriptionController.getStatus);

export default router;
