import { authService } from '../services/auth.service.js';
import { emailService } from '../services/email.service.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { logger } from '../utils/logger.js';

export class AuthController {
  register = asyncHandler(async (req, res) => {
    const { email, password, name, phone } = req.body;

    const result = await authService.register({ email, password, name, phone });

    // Send welcome email (don't await to avoid blocking)
    emailService.sendWelcomeEmail(email, { name }).catch(err => {
      logger.error('Failed to send welcome email:', err);
    });

    res.status(201).json({
      success: true,
      data: {
        user: result.user,
        token: result.token,
      },
    });
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const result = await authService.login({ email, password });

    res.json({
      success: true,
      data: {
        user: result.user,
        token: result.token,
      },
    });
  });

  getMe = asyncHandler(async (req, res) => {
    const user = await authService.getMe(req.userId);

    res.json({
      success: true,
      data: { user },
    });
  });

  changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    await authService.changePassword(req.userId, currentPassword, newPassword);

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  });

  logout = asyncHandler(async (req, res) => {
    // With JWT, logout is handled client-side by removing the token
    // But we can log it for analytics
    logger.info(`User logged out: ${req.userId}`);

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  });
}

export const authController = new AuthController();
export default authController;

