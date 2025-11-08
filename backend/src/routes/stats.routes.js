import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Get stats
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { data: stats, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', req.userId)
      .single();

    if (error) throw error;
    res.json({ stats });
  } catch (error) {
    next(error);
  }
});

export default router;

