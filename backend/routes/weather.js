const express = require('express');
const router = express.Router();
const Weather = require('../models/Weather');
const weatherService = require('../utils/weatherService');
const { validateDateRange, validateLocation, weatherRequestSchema, weatherUpdateSchema } = require('../utils/validation');

// CREATE - Get weather data and store in database
router.post('/', async (req, res) => {
  try {
    // Validate request
    const { error, value } = weatherRequestSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { location, startDate, endDate, requestedBy } = value;

    // Additional date range validation
    validateDateRange(startDate, endDate);

    // Get coordinates from location
    const coordinates = await weatherService.getCoordinates(location);
    
    // Get current weather
    const currentWeather = await weatherService.getCurrentWeather(coordinates.lat, coordinates.lon);
    
    // Get forecast
    const forecast = await weatherService.getForecast(coordinates.lat, coordinates.lon, 5);
    
    // Get additional data (optional)
    const youtubeVideos = await weatherService.getYouTubeVideos(coordinates.name);
    const googleMapsData = await weatherService.getGoogleMapsData(coordinates.name);

    // Create weather record
    const weatherData = new Weather({
      location: {
        name: coordinates.name,
        country: coordinates.country,
        coordinates: {
          lat: coordinates.lat,
          lon: coordinates.lon
        }
      },
      current: currentWeather,
      forecast,
      dateRange: {
        start: new Date(startDate),
        end: new Date(endDate)
      },
      requestedBy,
      additionalData: {
        youtubeVideos,
        googleMapsData
      }
    });

    await weatherData.save();

    res.status(201).json({
      message: 'Weather data retrieved and stored successfully',
      data: weatherData
    });
  } catch (error) {
    console.error('Error creating weather record:', error);
    res.status(400).json({ error: error.message });
  }
});

// READ - Get all weather records with optional filtering
router.get('/', async (req, res) => {
  try {
    const { location, startDate, endDate, requestedBy, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (location) {
      filter['location.name'] = { $regex: location, $options: 'i' };
    }
    
    if (startDate || endDate) {
      filter['dateRange'] = {};
      if (startDate) filter['dateRange']['$gte'] = new Date(startDate);
      if (endDate) filter['dateRange']['$lte'] = new Date(endDate);
    }
    
    if (requestedBy) {
      filter.requestedBy = { $regex: requestedBy, $options: 'i' };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get total count for pagination
    const total = await Weather.countDocuments(filter);
    
    // Get weather records
    const weatherRecords = await Weather.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      data: weatherRecords,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error retrieving weather records:', error);
    res.status(500).json({ error: error.message });
  }
});

// READ - Get specific weather record by ID
router.get('/:id', async (req, res) => {
  try {
    const weatherRecord = await Weather.findById(req.params.id);
    
    if (!weatherRecord) {
      return res.status(404).json({ error: 'Weather record not found' });
    }

    res.json({ data: weatherRecord });
  } catch (error) {
    console.error('Error retrieving weather record:', error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Update existing weather record
router.put('/:id', async (req, res) => {
  try {
    // Validate request
    const { error, value } = weatherUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const weatherRecord = await Weather.findById(req.params.id);
    
    if (!weatherRecord) {
      return res.status(404).json({ error: 'Weather record not found' });
    }

    // Update fields
    Object.keys(value).forEach(key => {
      if (key === 'location' || key === 'current') {
        Object.assign(weatherRecord[key], value[key]);
      } else {
        weatherRecord[key] = value[key];
      }
    });

    await weatherRecord.save();

    res.json({
      message: 'Weather record updated successfully',
      data: weatherRecord
    });
  } catch (error) {
    console.error('Error updating weather record:', error);
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Delete weather record
router.delete('/:id', async (req, res) => {
  try {
    const weatherRecord = await Weather.findById(req.params.id);
    
    if (!weatherRecord) {
      return res.status(404).json({ error: 'Weather record not found' });
    }

    await Weather.findByIdAndDelete(req.params.id);

    res.json({ message: 'Weather record deleted successfully' });
  } catch (error) {
    console.error('Error deleting weather record:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get current weather without storing (for quick checks)
router.post('/current', async (req, res) => {
  try {
    const location = validateLocation(req.body.location);
    
    // Get coordinates from location
    const coordinates = await weatherService.getCoordinates(location);
    
    // Get current weather
    const currentWeather = await weatherService.getCurrentWeather(coordinates.lat, coordinates.lon);
    
    // Get forecast
    const forecast = await weatherService.getForecast(coordinates.lat, coordinates.lon, 5);

    res.json({
      location: {
        name: coordinates.name,
        country: coordinates.country,
        coordinates: {
          lat: coordinates.lat,
          lon: coordinates.lon
        }
      },
      current: currentWeather,
      forecast
    });
  } catch (error) {
    console.error('Error getting current weather:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;