import { supabase } from '../config/supabase.js';
import { emailService } from '../services/email.service.js';
import { logger } from '../utils/logger.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// Verify the shared secret set in SCHEDULED_JOBS_SECRET env var
function requireScheduledSecret(req, res, next) {
  const secret = process.env.SCHEDULED_JOBS_SECRET;
  if (!secret) {
    logger.warn('SCHEDULED_JOBS_SECRET not configured — scheduled endpoints are open');
    return next();
  }
  const provided = req.headers['x-scheduled-secret'] || req.body?.secret;
  if (provided !== secret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

async function getUserEmailAndName(userId) {
  const { data: authUser } = await supabase.auth.admin.getUserById(userId);
  const email = authUser?.user?.email;
  if (!email) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, full_name')
    .eq('user_id', userId)
    .single();

  const name = profile?.name || profile?.full_name || email.split('@')[0];
  return { email, name };
}

export class ScheduledController {
  // Called hourly by N8N — sends daily reminder to users whose reminder_time matches current hour
  sendDailyReminders = [
    requireScheduledSecret,
    asyncHandler(async (req, res) => {
      const nowUtc = new Date();
      const utcHour = nowUtc.getUTCHours();
      const utcMinute = nowUtc.getUTCMinutes();
      const todayUtc = nowUtc.toISOString().split('T')[0];

      // Fetch all users with reminders enabled
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('user_id, reminder_time, reminder_timezone')
        .eq('reminder_enabled', true)
        .not('reminder_time', 'is', null);

      if (error) throw error;

      let sent = 0;
      let skipped = 0;

      for (const profile of profiles || []) {
        try {
          const tz = profile.reminder_timezone || 'UTC';

          // Convert current UTC time to user's timezone to compare against reminder_time
          const nowInUserTz = new Date(nowUtc.toLocaleString('en-US', { timeZone: tz }));
          const userHour = nowInUserTz.getHours();

          // reminder_time is stored as HH:MM:SS — extract the hour
          const reminderHour = parseInt(profile.reminder_time.split(':')[0], 10);

          // Only fire once per hour window (within the first 30 minutes of the hour)
          if (userHour !== reminderHour || utcMinute > 30) {
            skipped++;
            continue;
          }

          // Check if user already had a session today in their timezone
          const todayInUserTz = nowInUserTz.toISOString().split('T')[0];
          const { data: stats } = await supabase
            .from('user_stats')
            .select('last_session_date, current_streak')
            .eq('user_id', profile.user_id)
            .single();

          if (stats?.last_session_date >= todayInUserTz) {
            skipped++;
            continue;
          }

          // Get user's active journey for day number context
          const { data: journeys } = await supabase
            .from('journeys')
            .select(`
              id,
              journey_days (
                day_number, title, completed
              )
            `)
            .eq('user_id', profile.user_id)
            .in('status', ['active', 'creating', 'ready'])
            .order('created_at', { ascending: false })
            .limit(1);

          const journey = journeys?.[0];
          const nextDay = journey?.journey_days
            ?.filter(d => !d.completed)
            ?.sort((a, b) => a.day_number - b.day_number)[0];

          const user = await getUserEmailAndName(profile.user_id);
          if (!user) { skipped++; continue; }

          await emailService.sendDailyReminder(user.email, {
            name: user.name,
            dayNumber: nextDay?.day_number || 1,
            dayTitle: nextDay?.title || 'Today\'s Session',
            streak: stats?.current_streak || 0,
          });

          sent++;
        } catch (err) {
          logger.error(`Failed to send daily reminder for user ${profile.user_id}:`, err);
          skipped++;
        }
      }

      logger.info(`Daily reminders: ${sent} sent, ${skipped} skipped`);
      res.json({ success: true, sent, skipped });
    }),
  ];

  // Called hourly by N8N — at 6pm in each user's timezone, warns users with active streaks
  sendStreakAtRiskAlerts = [
    requireScheduledSecret,
    asyncHandler(async (req, res) => {
      const nowUtc = new Date();

      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('user_id, reminder_timezone');

      if (error) throw error;

      let sent = 0;
      let skipped = 0;

      for (const profile of profiles || []) {
        try {
          const tz = profile.reminder_timezone || 'UTC';
          const nowInUserTz = new Date(nowUtc.toLocaleString('en-US', { timeZone: tz }));
          const userHour = nowInUserTz.getHours();

          // Only fire at 18:xx (6pm) in the user's timezone
          if (userHour !== 18) { skipped++; continue; }

          const todayInUserTz = nowInUserTz.toISOString().split('T')[0];

          const { data: stats } = await supabase
            .from('user_stats')
            .select('current_streak, last_session_date')
            .eq('user_id', profile.user_id)
            .single();

          // Must have streak >= 3 and no session today
          if (!stats || stats.current_streak < 3) { skipped++; continue; }
          if (stats.last_session_date >= todayInUserTz) { skipped++; continue; }

          const user = await getUserEmailAndName(profile.user_id);
          if (!user) { skipped++; continue; }

          await emailService.sendStreakAtRiskEmail(user.email, {
            name: user.name,
            streak: stats.current_streak,
          });

          sent++;
        } catch (err) {
          logger.error(`Failed to send streak-at-risk alert for user ${profile.user_id}:`, err);
          skipped++;
        }
      }

      logger.info(`Streak-at-risk alerts: ${sent} sent, ${skipped} skipped`);
      res.json({ success: true, sent, skipped });
    }),
  ];

  // Called daily by N8N — re-engages users inactive for exactly 3 days
  sendReEngagementEmails = [
    requireScheduledSecret,
    asyncHandler(async (req, res) => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const threeDaysAgoDate = threeDaysAgo.toISOString().split('T')[0];

      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const twoDaysAgoDate = twoDaysAgo.toISOString().split('T')[0];

      // Users whose last session was exactly 3 days ago (between 3 and 4 days back)
      const { data: stats, error } = await supabase
        .from('user_stats')
        .select('user_id, last_session_date')
        .lte('last_session_date', threeDaysAgoDate)
        .gt('last_session_date', new Date(threeDaysAgo.getTime() - 86400000).toISOString().split('T')[0]);

      if (error) throw error;

      let sent = 0;
      let skipped = 0;

      for (const stat of stats || []) {
        try {
          const user = await getUserEmailAndName(stat.user_id);
          if (!user) { skipped++; continue; }

          await emailService.sendReEngagementEmail(user.email, { name: user.name });
          sent++;
        } catch (err) {
          logger.error(`Failed to send re-engagement email for user ${stat.user_id}:`, err);
          skipped++;
        }
      }

      logger.info(`Re-engagement emails: ${sent} sent, ${skipped} skipped`);
      res.json({ success: true, sent, skipped });
    }),
  ];
}

export const scheduledController = new ScheduledController();
export default scheduledController;
