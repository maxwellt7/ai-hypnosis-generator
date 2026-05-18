import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { logger } from '../utils/logger.js';
import { sendLeadEvent } from '../utils/facebook-capi.js';

const PROVISION_ACCESS_TOKEN = process.env.PROVISION_ACCESS_TOKEN;

export class ProvisionController {
  provisionAccess = asyncHandler(async (req, res) => {
    // Validate provision token
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');

    if (!PROVISION_ACCESS_TOKEN || token !== PROVISION_ACCESS_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { email, name, stripeSessionId, stripeCustomerId } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'email is required' });
    }

    logger.info(`[Provision] Starting for email: ${email}`);

    // Find existing user
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single();

    let userId;

    if (existingUser) {
      userId = existingUser.id;
      logger.info(`[Provision] Existing user found: ${userId}`);
    } else {
      // Create provisional account — random secure password, user can reset later
      const tempPassword = crypto.randomBytes(24).toString('base64url');
      const passwordHash = await bcrypt.hash(tempPassword, 10);

      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({ email, password_hash: passwordHash, name: name || email.split('@')[0] })
        .select('id')
        .single();

      if (createError) {
        logger.error('[Provision] Failed to create user:', createError);
        throw createError;
      }

      userId = newUser.id;

      // Bootstrap profile and stats rows
      await Promise.allSettled([
        supabase.from('profiles').insert({ user_id: userId }),
        supabase.from('user_stats').insert({ user_id: userId }),
      ]);

      sendLeadEvent(email).catch(() => {});
      logger.info(`[Provision] New user created: ${userId}`);
    }

    // Persist Stripe fields — graceful: ignore column-not-found errors
    const stripeUpdate = {};
    if (stripeCustomerId) stripeUpdate.stripe_customer_id = stripeCustomerId;
    if (stripeSessionId) stripeUpdate.stripe_session_id = stripeSessionId;
    stripeUpdate.is_paid = true;
    stripeUpdate.paid_at = new Date().toISOString();

    const { error: updateError } = await supabase
      .from('users')
      .update(stripeUpdate)
      .eq('id', userId);

    if (updateError) {
      logger.warn(`[Provision] Stripe field update failed (schema may be missing columns): ${updateError.message}`);
      // Don't fail — user account exists, manual grant can follow
    }

    logger.info(`[Provision] Access provisioned for ${email} (userId: ${userId})`);

    return res.json({ success: true, userId });
  });
}

export const provisionController = new ProvisionController();
