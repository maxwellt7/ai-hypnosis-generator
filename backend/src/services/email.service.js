import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

export class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  async sendEmail({ to, subject, html }) {
    try {
      const info = await this.transporter.sendMail({
        from: `"Hypnosis Generator" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html,
      });

      logger.info(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error('Error sending email:', error);
      throw error;
    }
  }

  async sendJourneyReadyEmail(to, data) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Your Journey is Ready!</h1>
          </div>
          <div class="content">
            <p>Hi ${data.name},</p>
            <p>Great news! Your personalized 7-day hypnosis journey for <strong>${data.goal}</strong> is now ready and waiting for you.</p>
            <p>Your custom audio tracks have been carefully crafted based on your unique profile and intentions.</p>
            <p style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/dashboard/journey/${data.journeyId}" class="button">
                Start Your Journey
              </a>
            </p>
            <p><strong>Tips for Success:</strong></p>
            <ul>
              <li>Listen at the same time each day</li>
              <li>Find a quiet, comfortable space</li>
              <li>Use headphones for best results</li>
              <li>Keep a journal of your progress</li>
            </ul>
            <p>We're excited to be part of your transformation journey!</p>
            <p>Warm regards,<br>The Hypnosis Generator Team</p>
          </div>
          <div class="footer">
            <p>Questions? Reply to this email or visit our support center.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to,
      subject: 'Your Personalized Hypnosis Journey is Ready! 🎉',
      html,
    });
  }

  async sendDailyReminder(to, data) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .streak { font-size: 24px; font-weight: bold; color: #f59e0b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🧘 Time for Today's Session</h2>
          </div>
          <div class="content">
            <p>Hi ${data.name},</p>
            <p>Day ${data.dayNumber} of your hypnosis journey awaits!</p>
            <p><strong>Today's Focus:</strong> ${data.dayTitle}</p>
            <p style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/dashboard" class="button">
                Listen Now
              </a>
            </p>
            <p style="text-align: center;">
              <span class="streak">Current Streak: ${data.streak} days 🔥</span>
            </p>
            <p>Keep up the amazing work! Consistency is key to transformation.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to,
      subject: `Day ${data.dayNumber}: ${data.dayTitle}`,
      html,
    });
  }

  async sendJourneyCompletionEmail(to, data) {
    const nextJourneyUrl = `${process.env.FRONTEND_URL}/create-journey?from_journey=${data.journeyId}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 36px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
          .reflection { background: white; border-left: 4px solid #667eea; padding: 16px 20px; margin: 12px 0; border-radius: 0 6px 6px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌟 Journey Complete!</h1>
            <p style="margin:0;font-size:18px;opacity:0.9;">You did it, ${data.name}!</p>
          </div>
          <div class="content">
            <p>Seven days ago you set an intention: <strong>${data.goal}</strong></p>
            <p>You showed up every day, and that consistency is the foundation of real transformation. Take a moment to honour that.</p>
            <p><strong>Reflect on your journey:</strong></p>
            <div class="reflection">What shifts — however subtle — did you notice in your thoughts, feelings, or behaviours this week?</div>
            <div class="reflection">What moment from the 7 sessions will you carry forward with you?</div>
            <div class="reflection">What would you like to explore or deepen in your next journey?</div>
            <p>Your mind is primed and ready to go deeper. Start your next journey while the momentum is alive:</p>
            <p style="text-align: center;">
              <a href="${nextJourneyUrl}" class="button">Create Your Next Journey</a>
            </p>
            <p>Proud of you,<br>The Sacred Heart Team</p>
          </div>
          <div class="footer">
            <p>Questions? Reply to this email or visit our support centre.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to,
      subject: `🌟 You completed your 7-day journey, ${data.name}!`,
      html,
    });
  }

  async sendWelcomeEmail(to, data) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Hypnosis Generator! 🌟</h1>
          </div>
          <div class="content">
            <p>Hi ${data.name},</p>
            <p>Welcome to your journey of transformation! We're thrilled to have you here.</p>
            <p>With AI-powered hypnosis, you're about to experience personalized sessions designed specifically for your goals and preferences.</p>
            <p><strong>Getting Started:</strong></p>
            <ol>
              <li>Complete your onboarding questionnaire</li>
              <li>Create your first 7-day journey</li>
              <li>Listen daily for best results</li>
              <li>Track your progress in your dashboard</li>
            </ol>
            <p style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/onboarding" class="button">
                Start Onboarding
              </a>
            </p>
            <p>Here's to your transformation! 🚀</p>
            <p>Best regards,<br>The Hypnosis Generator Team</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to,
      subject: 'Welcome to Your Transformation Journey! 🌟',
      html,
    });
  }
}

export const emailService = new EmailService();
export default emailService;

