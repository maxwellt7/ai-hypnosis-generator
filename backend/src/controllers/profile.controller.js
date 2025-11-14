import { profileService } from '../services/profile.service.js';
import { asyncHandler } from '../middleware/error.middleware.js';

export class ProfileController {
  getProfile = asyncHandler(async (req, res) => {
    const profile = await profileService.getProfile(req.userId);

    res.json({
      success: true,
      data: { profile },
    });
  });

  updateProfile = asyncHandler(async (req, res) => {
    const updates = req.body;
    const profile = await profileService.updateProfile(req.userId, updates);

    res.json({
      success: true,
      data: { profile },
    });
  });

  completeOnboarding = asyncHandler(async (req, res) => {
    const onboardingData = req.body;
    const profile = await profileService.completeOnboarding(req.userId, onboardingData);

    res.json({
      success: true,
      data: { profile },
      message: 'Onboarding completed successfully',
    });
  });

  getOnboarding = asyncHandler(async (req, res) => {
    const data = await profileService.getOnboardingData(req.userId);

    res.json({
      success: true,
      data,
    });
  });
}

export const profileController = new ProfileController();
export default profileController;

