import express from 'express';
import { profileController } from '../controllers/profile.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { updateProfileSchema, onboardingSchema } from '../validators/profile.validator.js';

const router = express.Router();

// All profile routes require authentication
router.use(authenticate);

router.get('/', profileController.getProfile);
router.put('/', validate(updateProfileSchema), profileController.updateProfile);

router.get('/onboarding', profileController.getOnboarding);
router.post('/onboarding', validate(onboardingSchema), profileController.completeOnboarding);

export default router;

