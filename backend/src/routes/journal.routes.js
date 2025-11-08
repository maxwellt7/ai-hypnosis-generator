import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Create entry
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { journey_day_id, entry_text, mood_rating } = req.body;
    
    if (!entry_text) {
      return res.status(400).json({ error: 'Entry text is required' });
    }
    
    const { data: entry, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: req.userId,
        journey_day_id,
        entry_text,
        mood_rating
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ entry });
  } catch (error) {
    next(error);
  }
});

// List entries
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { data: entries, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ entries });
  } catch (error) {
    next(error);
  }
});

// Get entry
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { data: entry, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single();

    if (error) throw error;
    res.json({ entry });
  } catch (error) {
    next(error);
  }
});

// Update entry
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const updates = req.body;
    
    const { data: entry, error } = await supabase
      .from('journal_entries')
      .update(updates)
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error) throw error;
    res.json({ entry });
  } catch (error) {
    next(error);
  }
});

// Delete entry
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.userId);

    if (error) throw error;
    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;

