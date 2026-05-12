-- Add Stripe subscription tracking columns to users table
-- Run this in Supabase SQL editor before deploying subscription feature

ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_period_end TIMESTAMPTZ;

-- stripe_customer_id may already exist from provision flow
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Index for webhook lookups by customer ID
CREATE INDEX IF NOT EXISTS users_stripe_customer_id_idx ON users(stripe_customer_id);
