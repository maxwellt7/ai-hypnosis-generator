import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../middleware/error.middleware.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// Placeholder endpoints - to be implemented
router.get('/users', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: { users: [] },
    message: 'Admin feature coming soon',
  });
}));

router.get('/analytics', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {},
    message: 'Admin feature coming soon',
  });
}));

router.get('/journeys', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: { journeys: [] },
    message: 'Admin feature coming soon',
  });
}));

export default router;

