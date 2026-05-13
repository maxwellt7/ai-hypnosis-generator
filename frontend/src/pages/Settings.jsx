import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import profileService from '../services/profile.service';

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Bangkok',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
];

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [reminderTimezone, setReminderTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  );

  useEffect(() => {
    profileService.getProfile().then(profile => {
      if (profile) {
        setReminderEnabled(profile.reminder_enabled ?? false);
        setReminderTime(profile.reminder_time?.slice(0, 5) ?? '09:00');
        setReminderTimezone(profile.reminder_timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC');
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      await profileService.updateProfile({
        reminder_enabled: reminderEnabled,
        reminder_time: reminderEnabled ? `${reminderTime}:00` : null,
        reminder_timezone: reminderTimezone,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

        <form onSubmit={handleSave}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🔔</span> Daily Reminder
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Get a daily nudge to keep your practice going.
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Enable daily reminder</p>
                  <p className="text-sm text-gray-500">We'll send you an email at your chosen time if you haven't listened yet.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setReminderEnabled(v => !v)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                    reminderEnabled ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      reminderEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Time + Timezone (shown when enabled) */}
              {reminderEnabled && (
                <div className="space-y-4 pt-2 border-t border-gray-100">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reminder time
                    </label>
                    <Input
                      type="time"
                      value={reminderTime}
                      onChange={e => setReminderTime(e.target.value)}
                      className="w-40"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Timezone
                    </label>
                    <select
                      value={reminderTimezone}
                      onChange={e => setReminderTimezone(e.target.value)}
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      {TIMEZONES.map(tz => (
                        <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>

                  <p className="text-xs text-gray-500">
                    You'll only receive a reminder on days you haven't listened yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {error && (
            <p className="text-sm text-red-600 mb-4">{error}</p>
          )}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save Settings'}
            </Button>
            {saved && (
              <span className="text-sm text-green-600 font-medium">✓ Saved!</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
