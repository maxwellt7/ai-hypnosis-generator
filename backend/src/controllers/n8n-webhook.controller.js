/**
 * N8N Webhook Controller
 * Handles webhook callbacks from n8n workflow
 */

import mongoose from 'mongoose';
import logger from '../utils/logger.js';
import { sendEmail } from '../services/email.service.js';

/**
 * Handle journey completion webhook from n8n
 * POST /api/webhooks/n8n/journey-complete
 */
export const handleJourneyComplete = async (req, res) => {
  try {
    const { journeyId, userId, status, days, completedAt } = req.body;

    logger.info(`N8N Webhook: Journey ${journeyId} completion received`);

    // Validate payload
    if (!journeyId || !userId || !status) {
      logger.error('Invalid webhook payload:', req.body);
      return res.status(400).json({
        success: false,
        error: 'Invalid payload: missing required fields'
      });
    }

    // Get database connection
    const db = mongoose.connection.db;

    // Update journey in database
    const result = await db.collection('journeys').updateOne(
      { _id: new mongoose.Types.ObjectId(journeyId) },
      {
        $set: {
          status: status,
          completedAt: completedAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    );

    if (result.matchedCount === 0) {
      logger.error(`Journey ${journeyId} not found in database`);
      return res.status(404).json({
        success: false,
        error: 'Journey not found'
      });
    }

    logger.info(`Journey ${journeyId} updated successfully`);

    // Store day data if provided
    if (days && Array.isArray(days)) {
      const dayDocuments = days.map(day => ({
        journeyId: new mongoose.Types.ObjectId(journeyId),
        userId: new mongoose.Types.ObjectId(userId),
        dayNumber: day.dayNumber,
        scriptText: day.scriptText || '',
        audioUrl: day.audioUrl || '',
        duration: day.duration || 900,
        status: 'completed',
        createdAt: new Date().toISOString()
      }));

      await db.collection('journey_days').insertMany(dayDocuments);
      logger.info(`Inserted ${dayDocuments.length} days for journey ${journeyId}`);
    }

    // Get user data for email notification
    const user = await db.collection('users').findOne({
      _id: new mongoose.Types.ObjectId(userId)
    });

    if (!user) {
      logger.error(`User ${userId} not found`);
    }

    // Get journey data for email
    const journey = await db.collection('journeys').findOne({
      _id: new mongoose.Types.ObjectId(journeyId)
    });

    // Send completion email to user
    if (user && journey) {
      try {
        await sendJourneyCompleteEmail(user, journey);
        logger.info(`Completion email sent to ${user.email}`);
      } catch (emailError) {
        logger.error('Failed to send completion email:', emailError);
        // Don't fail the webhook if email fails
      }
    }

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Journey completion processed',
      journeyId: journeyId,
      daysProcessed: days?.length || 0
    });

  } catch (error) {
    logger.error('Error handling journey completion webhook:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
};

/**
 * Handle journey error webhook from n8n
 * POST /api/webhooks/n8n/journey-error
 */
export const handleJourneyError = async (req, res) => {
  try {
    const { journeyId, userId, error, errorDetails } = req.body;

    logger.error(`N8N Webhook: Journey ${journeyId} error received:`, error);

    // Get database connection
    const db = mongoose.connection.db;

    // Update journey status to error
    await db.collection('journeys').updateOne(
      { _id: new mongoose.Types.ObjectId(journeyId) },
      {
        $set: {
          status: 'error',
          error: error || 'Unknown error',
          errorDetails: errorDetails || {},
          updatedAt: new Date().toISOString()
        }
      }
    );

    // Notify admins about error
    try {
      await sendErrorNotification(journeyId, userId, error, errorDetails);
    } catch (emailError) {
      logger.error('Failed to send error notification:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Error recorded'
    });

  } catch (error) {
    logger.error('Error handling journey error webhook:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * Handle journey progress update webhook from n8n
 * POST /api/webhooks/n8n/journey-progress
 */
export const handleJourneyProgress = async (req, res) => {
  try {
    const { journeyId, currentDay, totalDays, status } = req.body;

    logger.info(`N8N Webhook: Journey ${journeyId} progress - Day ${currentDay}/${totalDays}`);

    // Get database connection
    const db = mongoose.connection.db;

    // Update journey progress
    await db.collection('journeys').updateOne(
      { _id: new mongoose.Types.ObjectId(journeyId) },
      {
        $set: {
          currentDay: currentDay,
          totalDays: totalDays,
          progress: Math.round((currentDay / totalDays) * 100),
          updatedAt: new Date().toISOString()
        }
      }
    );

    res.status(200).json({
      success: true,
      message: 'Progress updated'
    });

  } catch (error) {
    logger.error('Error handling journey progress webhook:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * Send journey completion email
 */
async function sendJourneyCompleteEmail(user, journey) {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 30px; 
          text-align: center; 
          border-radius: 10px 10px 0 0; 
        }
        .content { background: #f9fafb; padding: 30px; }
        .button { 
          background: #667eea; 
          color: white; 
          padding: 15px 30px; 
          text-decoration: none; 
          border-radius: 5px; 
          display: inline-block; 
          margin: 20px 0; 
        }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Your Journey is Ready!</h1>
          <p>Your personalized 7-day hypnosis journey has been created</p>
        </div>
        
        <div class="content">
          <p>Hi ${user.name || 'there'},</p>
          
          <p>Great news! Your personalized 7-day hypnosis journey for <strong>${journey.goal}</strong> is now ready and waiting for you.</p>
          
          <p>We've created a unique experience tailored specifically to your goals, preferences, and personal situation.</p>
          
          <p style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/journey/${journey._id}" class="button">
              Start Your Journey
            </a>
          </p>
          
          <h3>Tips for Success:</h3>
          <ul>
            <li>✨ Listen at the same time each day for best results</li>
            <li>🎧 Use headphones for the best experience</li>
            <li>🧘 Find a quiet, comfortable space</li>
            <li>📝 Keep a journal to track your progress</li>
            <li>💪 Be patient with yourself - change takes time</li>
          </ul>
          
          <p>We're excited to be part of your transformation journey!</p>
          
          <p>Happy listening! 🎧</p>
        </div>
        
        <div class="footer">
          <p>The Hypnosis Generator Team</p>
          <p>
            <a href="${process.env.FRONTEND_URL}">Visit Dashboard</a> | 
            <a href="${process.env.FRONTEND_URL}/settings">Settings</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject: 'Your 7-Day Hypnosis Journey is Ready! 🎉',
    html: emailHtml
  });
}

/**
 * Send error notification to admins
 */
async function sendErrorNotification(journeyId, userId, error, errorDetails) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <body>
      <h2>Journey Generation Error</h2>
      <p><strong>Journey ID:</strong> ${journeyId}</p>
      <p><strong>User ID:</strong> ${userId}</p>
      <p><strong>Error:</strong> ${error}</p>
      <p><strong>Details:</strong></p>
      <pre>${JSON.stringify(errorDetails, null, 2)}</pre>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
    </body>
    </html>
  `;

  await sendEmail({
    to: adminEmail,
    subject: `Journey Generation Error - ${journeyId}`,
    html: emailHtml
  });
}

