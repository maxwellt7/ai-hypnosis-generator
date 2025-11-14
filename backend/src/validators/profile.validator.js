import Joi from 'joi';
import { TIME_OF_DAY, DURATION_OPTIONS } from '../utils/constants.js';

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  phone: Joi.string().optional().allow(''),
  preference_time_of_day: Joi.string().valid(...Object.values(TIME_OF_DAY)).optional(),
  preference_duration: Joi.number().valid(...DURATION_OPTIONS).optional(),
});

export const onboardingSchema = Joi.object({
  // This should match your 20 questions structure
  // For now, allowing any object since questions may vary
  responses: Joi.object().required().messages({
    'any.required': 'Onboarding responses are required',
  }),
}).unknown(true); // Allow additional fields for flexibility

