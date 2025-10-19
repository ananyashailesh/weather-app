const mongoose = require('mongoose');

const WeatherSchema = new mongoose.Schema({
  location: {
    name: { type: String, required: true },
    country: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true }
    }
  },
  current: {
    temperature: { type: Number, required: true },
    feels_like: { type: Number, required: true },
    humidity: { type: Number, required: true },
    pressure: { type: Number, required: true },
    wind_speed: { type: Number, required: true },
    wind_direction: { type: Number, required: true },
    visibility: { type: Number },
    uv_index: { type: Number },
    description: { type: String, required: true },
    icon: { type: String, required: true }
  },
  forecast: [{
    date: { type: Date, required: true },
    temp_min: { type: Number, required: true },
    temp_max: { type: Number, required: true },
    humidity: { type: Number, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true }
  }],
  dateRange: {
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  },
  requestedBy: { type: String, default: 'anonymous' },
  additionalData: {
    youtubeVideos: [{ 
      title: String, 
      videoId: String,
      thumbnail: String,
      channelTitle: String
    }],
    googleMapsData: {
      placeId: String,
      formattedAddress: String,
      types: [String]
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
WeatherSchema.index({ 'location.name': 1, createdAt: -1 });
WeatherSchema.index({ 'dateRange.start': 1, 'dateRange.end': 1 });

module.exports = mongoose.model('Weather', WeatherSchema);