import Stripe from 'stripe';
import { supabase } from '../config/supabase.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { logger } from '../utils/logger.js';

export const FREE_JOURNEY_LIMIT = 1;

let _stripe;
function getStripe() {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY is not configured');
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return _stripe;
}

async function getUserSubscription(userId) {
  const { data } = await supabase
    .from('users')
    .select('email, stripe_customer_id, subscription_id, subscription_status, subscription_period_end')
    .eq('id', userId)
    .single();
  return data;
}

async function updateSubscriptionFields(customerId, fields) {
  await supabase
    .from('users')
    .update(fields)
    .eq('stripe_customer_id', customerId);
}

export class SubscriptionController {
  createCheckoutSession = asyncHandler(async (req, res) => {
    const stripe = getStripe();
    const user = await getUserSubscription(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email, metadata: { userId: req.userId } });
      customerId = customer.id;
      await supabase.from('users').update({ stripe_customer_id: customerId }).eq('id', req.userId);
    }

    const priceId = process.env.STRIPE_SUBSCRIPTION_PRICE_ID;
    if (!priceId) throw new Error('STRIPE_SUBSCRIPTION_PRICE_ID is not configured');

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/billing?checkout=success`,
      cancel_url: `${process.env.FRONTEND_URL}/billing?checkout=cancelled`,
      allow_promotion_codes: true,
    });

    res.json({ url: session.url });
  });

  createPortalSession = asyncHandler(async (req, res) => {
    const stripe = getStripe();
    const user = await getUserSubscription(req.userId);
    if (!user?.stripe_customer_id) {
      return res.status(400).json({ error: 'No active subscription found' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${process.env.FRONTEND_URL}/billing`,
    });

    res.json({ url: session.url });
  });

  getStatus = asyncHandler(async (req, res) => {
    const user = await getUserSubscription(req.userId);
    const { count } = await supabase
      .from('journeys')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', req.userId);

    const isActive = ['active', 'trialing'].includes(user?.subscription_status);

    res.json({
      subscriptionStatus: user?.subscription_status || 'none',
      isActive,
      journeyCount: count || 0,
      freeLimit: FREE_JOURNEY_LIMIT,
      canCreateJourney: isActive || (count || 0) < FREE_JOURNEY_LIMIT,
      periodEnd: user?.subscription_period_end || null,
    });
  });

  handleWebhook = asyncHandler(async (req, res) => {
    const stripe = getStripe();
    const webhookSecret = process.env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET;
    if (!webhookSecret) throw new Error('STRIPE_SUBSCRIPTION_WEBHOOK_SECRET is not configured');

    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    } catch (err) {
      logger.error('[Stripe Webhook] Signature verification failed:', err.message);
      return res.status(400).json({ error: `Webhook error: ${err.message}` });
    }

    const obj = event.data.object;

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await updateSubscriptionFields(obj.customer, {
          subscription_id: obj.id,
          subscription_status: obj.status,
          subscription_period_end: new Date(obj.current_period_end * 1000).toISOString(),
          is_paid: obj.status === 'active',
        });
        logger.info(`[Stripe] Subscription ${event.type}: ${obj.id} → ${obj.status}`);
        break;

      case 'customer.subscription.deleted':
        await updateSubscriptionFields(obj.customer, {
          subscription_status: 'cancelled',
          is_paid: false,
        });
        logger.info(`[Stripe] Subscription cancelled: ${obj.id}`);
        break;

      case 'invoice.payment_failed':
        await updateSubscriptionFields(obj.customer, { subscription_status: 'past_due' });
        logger.warn(`[Stripe] Payment failed for customer: ${obj.customer}`);
        break;

      default:
        logger.info(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  });
}

export const subscriptionController = new SubscriptionController();
