import { ValidationError } from '../utils/errors.js';

// Middleware to validate request body/params/query against a Joi schema
export const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');
      
      return next(new ValidationError(errorMessage));
    }

    // Replace request data with validated and sanitized data
    req[property] = value;
    next();
  };
};

// Validate multiple properties
export const validateMultiple = (schemas) => {
  return (req, res, next) => {
    const errors = [];

    Object.entries(schemas).forEach(([property, schema]) => {
      const { error } = schema.validate(req[property], {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        errors.push(...error.details.map(detail => ({
          property,
          field: detail.path.join('.'),
          message: detail.message,
        })));
      }
    });

    if (errors.length > 0) {
      return next(new ValidationError('Validation failed', errors));
    }

    next();
  };
};

