-- Add completed_at timestamp to journeys table for the completion loop feature (SAC-80)
-- Run this in Supabase SQL editor before deploying

ALTER TABLE journeys ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
