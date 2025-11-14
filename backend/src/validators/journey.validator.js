import Joi from 'joi';
import { MIN_GOAL_LENGTH, MAX_GOAL_LENGTH, MIN_INTENTION_LENGTH, MAX_INTENTION_LENGTH, DURATION_OPTIONS } from '../utils/constants.js';

export const createJourneySchema = Joi.object({
  goal: Joi.string().min(MIN_GOAL_LENGTH).max(MAX_GOAL_LENGTH).required().messages({
    'string.min': `Goal must be at least ${MIN_GOAL_LENGTH} characters`,
    'string.max': `Goal cannot exceed ${MAX_GOAL_LENGTH} characters`,
    'any.required': 'Goal is required',
  }),
  intention: Joi.string().min(MIN_INTENTION_LENGTH).max(MAX_INTENTION_LENGTH).required().messages({
    'string.min': `Intention must be at least ${MIN_INTENTION_LENGTH} characters`,
    'string.max': `Intention cannot exceed ${MAX_INTENTION_LENGTH} characters`,
    'any.required': 'Intention is required',
  }),
  duration: Joi.number().valid(...DURATION_OPTIONS).optional().messages({
    'any.only': `Duration must be one of: ${DURATION_OPTIONS.join(', ')} minutes`,
  }),
  preferences: Joi.object().optional(),
});

export const updateJourneySchema = Joi.object({
  goal: Joi.string().min(MIN_GOAL_LENGTH).max(MAX_GOAL_LENGTH).optional(),
  intention: Joi.string().min(MIN_INTENTION_LENGTH).max(MAX_INTENTION_LENGTH).optional(),
});

export const journeyIdSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.guid': 'Invalid journey ID format',
    'any.required': 'Journey ID is required',
  }),
});

export const dayNumberSchema = Joi.object({
  dayNumber: Joi.number().integer().min(1).max(7).required().messages({
    'number.base': 'Day number must be a number',
    'number.min': 'Day number must be at least 1',
    'number.max': 'Day number cannot exceed 7',
    'any.required': 'Day number is required',
  }),
});

