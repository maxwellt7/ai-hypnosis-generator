-- Add email reminder preference columns to profiles table
-- Run this in Supabase SQL editor

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reminder_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reminder_time TIME;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reminder_timezone TEXT DEFAULT 'UTC';

-- Index for hourly reminder job: find enabled reminders by timezone-adjusted hour
CREATE INDEX IF NOT EXISTS profiles_reminder_enabled_idx ON profiles(reminder_enabled) WHERE reminder_enabled = TRUE;
