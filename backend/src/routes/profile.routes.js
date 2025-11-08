import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Get profile
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', req.userId)
      .single();

    if (error) throw error;
    res.json({ profile });
  } catch (error) {
    next(error);
  }
});

// Update profile
router.put('/', authenticate, async (req, res, next) => {
  try {
    const updates = req.body;
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error) throw error;
    res.json({ profile });
  } catch (error) {
    next(error);
  }
});

// Complete onboarding
router.post('/onboarding', authenticate, async (req, res, next) => {
  try {
    const { onboardingData } = req.body;
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        onboarding_completed: true,
        onboarding_data: onboardingData,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error) throw error;
    
    // TODO: Store in Pinecone for semantic search
    
    res.json({ profile });
  } catch (error) {
    next(error);
  }
});

export default router;

