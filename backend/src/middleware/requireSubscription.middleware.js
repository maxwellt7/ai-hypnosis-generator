import { supabase } from '../config/supabase.js';
import { FREE_JOURNEY_LIMIT, syncSubscriptionFromStripe } from '../controllers/subscription.controller.js';

export const requireSubscription = async (req, res, next) => {
  try {
    const [userResult, journeyCountResult] = await Promise.all([
      supabase.from('users').select('subscription_status, stripe_customer_id').eq('id', req.userId).single(),
      supabase.from('journeys').select('id', { count: 'exact', head: true }).eq('user_id', req.userId),
    ]);

    let status = userResult.data?.subscription_status;
    let isActive = ['active', 'trialing'].includes(status);
    const journeyCount = journeyCountResult.count || 0;

    // If subscription_status is unset but a Stripe customer exists, the webhook
    // may have been missed — verify directly before blocking access.
    if (!status && userResult.data?.stripe_customer_id) {
      const synced = await syncSubscriptionFromStripe(req.userId);
      if (synced) {
        const { data } = await supabase.from('users').select('subscription_status').eq('id', req.userId).single();
        status = data?.subscription_status;
        isActive = ['active', 'trialing'].includes(status);
      }
    }

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
