/**
 * N8N Webhook Authentication Middleware
 * Verifies that webhook requests are coming from our n8n instance
 */

import logger from '../utils/logger.js';

/**
 * Verify N8N webhook requests
 * Checks for valid API key in Authorization header
 */
export const verifyN8NWebhook = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    // Check if Authorization header exists
    if (!authHeader) {
      logger.warn('N8N webhook request missing Authorization header');
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Missing authentication'
      });
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;

    // Verify token matches our N8N API key
    const n8nApiKey = process.env.N8N_API_KEY;
    
    if (!n8nApiKey) {
      logger.error('N8N_API_KEY not configured in environment');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error'
      });
    }

    if (token !== n8nApiKey) {
      logger.warn('N8N webhook request with invalid API key');
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid API key'
      });
    }

    // Log successful authentication
    logger.info(`N8N webhook authenticated: ${req.path}`);
    
    // Proceed to route handler
    next();

  } catch (error) {
    logger.error('Error in N8N webhook authentication:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication error'
    });
  }
};

/**
 * Optional: Verify webhook signature
 * For additional security, you can implement HMAC signature verification
 */
export const verifyN8NSignature = (req, res, next) => {
  try {
    const signature = req.headers['x-n8n-signature'];
    const payload = JSON.stringify(req.body);
    
    if (!signature) {
      return res.status(401).json({
        success: false,
        error: 'Missing signature'
      });
    }

    // TODO: Implement HMAC signature verification
    // const expectedSignature = crypto
    //   .createHmac('sha256', process.env.N8N_WEBHOOK_SECRET)
    //   .update(payload)
    //   .digest('hex');
    // 
    // if (signature !== expectedSignature) {
    //   return res.status(401).json({
    //     success: false,
    //     error: 'Invalid signature'
    //   });
    // }

    next();
  } catch (error) {
    logger.error('Error verifying N8N signature:', error);
    res.status(500).json({
      success: false,
      error: 'Signature verification error'
    });
  }
};

