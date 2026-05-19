-- Add is_paid boolean column to users table for fast subscription status lookups.
-- This is a denormalized field — it mirrors subscription_status === 'active'.
-- It is set by the Stripe webhook handler and the provision flow.
-- Already used by provision.controller.js; this migration documents and ensures it exists.

ALTER TABLE users ADD COLUMN IF NOT EXISTS is_paid BOOLEAN NOT NULL DEFAULT FALSE;

-- Backfill from subscription_status for existing users
UPDATE users SET is_paid = TRUE WHERE subscription_status = 'active';
