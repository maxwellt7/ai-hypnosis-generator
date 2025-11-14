import { supabase } from '../config/supabase.js';
import { pineconeService } from '../services/pinecone.service.js';
import { emailService } from '../services/email.service.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { logger } from '../utils/logger.js';
import { JOURNEY_STATUS } from '../utils/constants.js';

export class WebhookController {
  // Called by n8n when journey generation is complete
  journeyComplete = asyncHandler(async (req, res) => {
    const { journeyId, userId, days, metadata } = req.body;

    logger.info(`Journey complete webhook received: ${journeyId}`);

    // Update journey status
    await supabase
      .from('journeys')
      .update({
        status: JOURNEY_STATUS.READY,
        journey_data: metadata || {},
        updated_at: new Date().toISOString(),
      })
      .eq('id', journeyId);

    // Create journey days
    if (days && Array.isArray(days)) {
      for (const day of days) {
        await supabase
          .from('journey_days')
          .insert({
            journey_id: journeyId,
            day_number: day.dayNumber,
            title: day.title,
            description: day.description,
            script_text: day.scriptText,
            audio_url: day.audioUrl,
            duration_seconds: day.durationSeconds || 0,
          });
      }
    }

    // Store in Pinecone for future reference
    if (metadata) {
      await pineconeService.upsertCreation(journeyId, {
        userId,
        interest: metadata.interest || 'general',
        goal: metadata.goal,
        intention: metadata.intention,
        duration: metadata.duration || 15,
        rating: metadata.evaluationScore || 0,
        scriptElements: metadata.hypnoticElements || [],
      }).catch(err => {
        logger.error('Failed to store creation in Pinecone:', err);
      });
    }

    // Send email notification
    const { data: user } = await supabase
      .from('users')
      .select('email, name')
      .eq('id', userId)
      .single();

    if (user) {
      emailService.sendJourneyReadyEmail(user.email, {
        name: user.name,
        journeyId,
        goal: metadata?.goal || 'your goal',
      }).catch(err => {
        logger.error('Failed to send journey ready email:', err);
      });
    }

    res.json({
      success: true,
      message: 'Journey completion processed',
    });
  });

  // Called by n8n when individual audio is ready
  audioReady = asyncHandler(async (req, res) => {
    const { journeyId, dayNumber, audioUrl, durationSeconds } = req.body;

    logger.info(`Audio ready webhook: journey ${journeyId}, day ${dayNumber}`);

    await supabase
      .from('journey_days')
      .update({
        audio_url: audioUrl,
        duration_seconds: durationSeconds || 0,
      })
      .eq('journey_id', journeyId)
      .eq('day_number', dayNumber);

    res.json({
      success: true,
      message: 'Audio URL updated',
    });
  });

  // Called by n8n when there's an error
  error = asyncHandler(async (req, res) => {
    const { journeyId, error: errorMessage, step } = req.body;

    logger.error(`Journey error webhook: ${journeyId} - ${errorMessage} at step ${step}`);

    await supabase
      .from('journeys')
      .update({
        status: JOURNEY_STATUS.ERROR,
        journey_data: {
          error: errorMessage,
          errorStep: step,
          errorTime: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', journeyId);

    res.json({
      success: true,
      message: 'Error recorded',
    });
  });
}

export const webhookController = new WebhookController();
export default webhookController;

