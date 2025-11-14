import express from 'express';
import { journeyController } from '../controllers/journey.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { journeyCreationLimiter } from '../middleware/rateLimit.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createJourneySchema } from '../validators/journey.validator.js';

const router = express.Router();

// All journey routes require authentication
router.use(authenticate);

// Journey CRUD
router.post('/', journeyCreationLimiter, validate(createJourneySchema), journeyController.create);
router.get('/', journeyController.list);
router.get('/:id', journeyController.get);
router.delete('/:id', journeyController.delete);

// Journey days
router.get('/:id/days', journeyController.getDays);
router.get('/:id/days/:dayNumber', journeyController.getDay);
router.post('/:id/days/:dayNumber/complete', journeyController.markDayComplete);

export default router;

