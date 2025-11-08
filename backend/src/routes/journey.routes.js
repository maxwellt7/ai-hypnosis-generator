import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Create journey
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { goal, intention, duration } = req.body;
    
    if (!goal || !intention) {
      return res.status(400).json({ error: 'Goal and intention are required' });
    }
    
    const { data: journey, error } = await supabase
      .from('journeys')
      .insert({
        user_id: req.userId,
        goal,
        intention,
        status: 'creating',
        journey_data: { duration: duration || 15 }
      })
      .select()
      .single();

    if (error) throw error;
    
    // TODO: Trigger n8n workflow
    
    res.status(201).json({ journey });
  } catch (error) {
    next(error);
  }
});

// List journeys
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { data: journeys, error } = await supabase
      .from('journeys')
      .select('*, journey_days(id, day_number, completed)')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ journeys });
  } catch (error) {
    next(error);
  }
});

// Get journey
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { data: journey, error } = await supabase
      .from('journeys')
      .select('*, journey_days(*)')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single();

    if (error) throw error;
    res.json({ journey });
  } catch (error) {
    next(error);
  }
});

// Mark day complete
router.post('/:id/days/:dayNumber/complete', authenticate, async (req, res, next) => {
  try {
    // Get the day
    const { data: day, error: dayError } = await supabase
      .from('journey_days')
      .select('*, journeys!inner(user_id)')
      .eq('journey_id', req.params.id)
      .eq('day_number', req.params.dayNumber)
      .single();

    if (dayError) throw dayError;
    
    if (day.journeys.user_id !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Mark complete
    const { data: updated, error } = await supabase
      .from('journey_days')
      .update({
        completed: true,
        completed_at: new Date().toISOString()
      })
      .eq('id', day.id)
      .select()
      .single();

    if (error) throw error;
    
    // TODO: Update user stats
    
    res.json({ day: updated });
  } catch (error) {
    next(error);
  }
});

export default router;

