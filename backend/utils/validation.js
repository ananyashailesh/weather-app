const Joi = require('joi');
const moment = require('moment');

// Date validation helper
const validateDateRange = (startDate, endDate) => {
  console.log('Validating dates:', { startDate, endDate, now: moment().format('YYYY-MM-DD') });
  const start = moment(startDate);
  const end = moment(endDate);
  const now = moment();
  
  if (!start.isValid() || !end.isValid()) {
    throw new Error('Invalid date format. Please use YYYY-MM-DD format.');
  }
  
  if (start.isAfter(end)) {
    throw new Error('Start date cannot be after end date.');
  }
  
  // More flexible validation for current weather requests
  if (start.isBefore(now.clone().subtract(90, 'days'))) {
    throw new Error('Start date cannot be more than 90 days in the past.');
  }
  
  if (end.isAfter(now.clone().add(90, 'days'))) {
    throw new Error('End date cannot be more than 90 days in the future.');
  }
  
  if (end.diff(start, 'days') > 30) {
    throw new Error('Date range cannot exceed 30 days.');
  }
  
  return true;
};

// Location validation
const validateLocation = (location) => {
  if (!location || typeof location !== 'string') {
    throw new Error('Location is required and must be a string.');
  }
  
  if (location.trim().length < 2) {
    throw new Error('Location must be at least 2 characters long.');
  }
  
  if (location.length > 100) {
    throw new Error('Location cannot exceed 100 characters.');
  }
  
  return location.trim();
};

// Weather request schema
const weatherRequestSchema = Joi.object({
  location: Joi.string().min(2).max(100).required()
    .messages({
      'string.min': 'Location must be at least 2 characters long',
      'string.max': 'Location cannot exceed 100 characters',
      'any.required': 'Location is required'
    }),
  
  startDate: Joi.date().iso().required()
    .messages({
      'date.base': 'Start date must be a valid date',
      'any.required': 'Start date is required'
    }),
    
  endDate: Joi.date().iso().required()
    .messages({
      'date.base': 'End date must be a valid date',
      'any.required': 'End date is required'
    }),
    
  requestedBy: Joi.string().max(50).default('anonymous')
    .messages({
      'string.max': 'Requested by cannot exceed 50 characters'
    })
});

// Weather update schema
const weatherUpdateSchema = Joi.object({
  location: Joi.object({
    name: Joi.string().min(2).max(100),
    country: Joi.string().max(50)
  }).optional(),
  
  current: Joi.object({
    temperature: Joi.number().min(-50).max(60),
    feels_like: Joi.number().min(-50).max(60),
    humidity: Joi.number().min(0).max(100),
    pressure: Joi.number().min(800).max(1200),
    wind_speed: Joi.number().min(0).max(200),
    wind_direction: Joi.number().min(0).max(360),
    description: Joi.string().max(100)
  }).optional(),
  
  requestedBy: Joi.string().max(50).optional()
}).min(1); // At least one field must be provided

// Export format validation
const exportFormatSchema = Joi.object({
  format: Joi.string().valid('json', 'csv', 'xml', 'pdf', 'markdown').required()
    .messages({
      'any.only': 'Format must be one of: json, csv, xml, pdf, markdown',
      'any.required': 'Export format is required'
    }),
    
  filters: Joi.object({
    location: Joi.string().max(100),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso(),
    requestedBy: Joi.string().max(50)
  }).optional()
});

module.exports = {
  validateDateRange,
  validateLocation,
  weatherRequestSchema,
  weatherUpdateSchema,
  exportFormatSchema
};