import express from 'express';
import { statsController } from '../controllers/stats.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All stats routes require authentication
router.use(authenticate);

router.get('/', statsController.getStats);
router.get('/streaks', statsController.getStreaks);
router.get('/history', statsController.getHistory);
router.get('/journeys', statsController.getJourneyStats);
router.get('/time-distribution', statsController.getTimeDistribution);

export default router;

