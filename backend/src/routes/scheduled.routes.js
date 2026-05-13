import express from 'express';
import { scheduledController } from '../controllers/scheduled.controller.js';

const router = express.Router();

// Triggered by N8N every hour — sends daily reminders to users whose reminder time matches
router.post('/daily-reminders', ...scheduledController.sendDailyReminders);

// Triggered by N8N every hour — sends 6pm streak-at-risk warnings
router.post('/streak-at-risk', ...scheduledController.sendStreakAtRiskAlerts);

// Triggered by N8N daily — re-engages users inactive for 3 days
router.post('/re-engagement', ...scheduledController.sendReEngagementEmails);

export default router;
