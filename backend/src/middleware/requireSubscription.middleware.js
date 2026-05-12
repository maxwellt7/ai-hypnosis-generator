import { supabase } from '../config/supabase.js';
import { FREE_JOURNEY_LIMIT } from '../controllers/subscription.controller.js';

export const requireSubscription = async (req, res, next) => {
  try {
    const [userResult, journeyCountResult] = await Promise.all([
      supabase.from('users').select('subscription_status').eq('id', req.userId).single(),
      supabase.from('journeys').select('id', { count: 'exact', head: true }).eq('user_id', req.userId),
    ]);

    const status = userResult.data?.subscription_status;
    const isActive = ['active', 'trialing'].includes(status);
    const journeyCount = journeyCountResult.count || 0;

    if (isActive || journeyCount < FREE_JOURNEY_LIMIT) {
      return next();
    }

    return res.status(402).json({
      error: 'subscription_required',
      message: `Free tier allows ${FREE_JOURNEY_LIMIT} journey. Subscribe to create unlimited journeys.`,
      checkoutPath: '/api/subscriptions/checkout',
    });
  } catch (err) {
    next(err);
  }
};
