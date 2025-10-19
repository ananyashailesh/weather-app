const axios = require('axios');
const mockWeatherService = require('./mockWeatherService');
const weatherApiService = require('./weatherApiService');

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    this.geocodingUrl = 'https://api.openweathermap.org/geo/1.0';
  }

  async getCoordinates(location) {
    try {
      // Check if API key is available and valid
      if (!this.apiKey || this.apiKey.includes('your_') || this.apiKey === 'demo_key_for_testing') {
        console.log('Using free weather API service (Open-Meteo + Nominatim)');
        return await weatherApiService.getCoordinates(location);
      }
      // First try direct geocoding
      let url;
      
      // Check if location is coordinates (lat,lon format)
      if (/^-?\d+\.?\d*,-?\d+\.?\d*$/.test(location)) {
        const [lat, lon] = location.split(',').map(coord => parseFloat(coord.trim()));
        return { lat, lon, name: `${lat}, ${lon}`, country: 'Unknown' };
      }
      
      // Check if location is zip code
      if (/^\d{5}(-\d{4})?$/.test(location)) {
        url = `${this.geocodingUrl}/zip?zip=${location}&appid=${this.apiKey}`;
      } else {
        // Regular location name
        url = `${this.geocodingUrl}/direct?q=${encodeURIComponent(location)}&limit=5&appid=${this.apiKey}`;
      }

      const response = await axios.get(url);
      
      if (response.data.length === 0 && !response.data.lat) {
        throw new Error('Location not found');
      }

      // For zip code API
      if (response.data.lat) {
        return {
          lat: response.data.lat,
          lon: response.data.lon,
          name: response.data.name,
          country: response.data.country
        };
      }

      // For direct geocoding API - return first result
      const result = response.data[0];
      return {
        lat: result.lat,
        lon: result.lon,
        name: result.name,
        country: result.country,
        state: result.state
      };
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('API key invalid, falling back to free weather API');
        return await weatherApiService.getCoordinates(location);
      }
      console.log('OpenWeatherMap failed, using free weather API as fallback');
      return await weatherApiService.getCoordinates(location);
    }
  }

  async getCurrentWeather(lat, lon) {
    try {
      // Check if API key is available and valid
      if (!this.apiKey || this.apiKey.includes('your_') || this.apiKey === 'demo_key_for_testing') {
        console.log('Using free weather API service (Open-Meteo)');
        return await weatherApiService.getCurrentWeather(lat, lon);
      }
      const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
      const response = await axios.get(url);
      
      return {
        temperature: response.data.main.temp,
        feels_like: response.data.main.feels_like,
        humidity: response.data.main.humidity,
        pressure: response.data.main.pressure,
        wind_speed: response.data.wind?.speed || 0,
        wind_direction: response.data.wind?.deg || 0,
        visibility: response.data.visibility,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon
      };
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('API key invalid, falling back to free weather API');
        return await weatherApiService.getCurrentWeather(lat, lon);
      }
      console.log('OpenWeatherMap failed, using free weather API as fallback');
      return await weatherApiService.getCurrentWeather(lat, lon);
    }
  }

  async getForecast(lat, lon, days = 5) {
    try {
      // Check if API key is available and valid
      if (!this.apiKey || this.apiKey.includes('your_') || this.apiKey === 'demo_key_for_testing') {
        console.log('Using free weather API service (Open-Meteo)');
        return await weatherApiService.getForecast(lat, lon, days);
      }
      const url = `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
      const response = await axios.get(url);
      
      const forecast = [];
      const dailyData = {};
      
      // Group by date and get daily min/max
      response.data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        
        if (!dailyData[date]) {
          dailyData[date] = {
            temps: [],
            humidity: [],
            descriptions: [],
            icons: []
          };
        }
        
        dailyData[date].temps.push(item.main.temp);
        dailyData[date].humidity.push(item.main.humidity);
        dailyData[date].descriptions.push(item.weather[0].description);
        dailyData[date].icons.push(item.weather[0].icon);
      });
      
      // Convert to forecast format
      Object.keys(dailyData).slice(0, days).forEach(date => {
        const data = dailyData[date];
        forecast.push({
          date: new Date(date),
          temp_min: Math.min(...data.temps),
          temp_max: Math.max(...data.temps),
          humidity: Math.round(data.humidity.reduce((a, b) => a + b) / data.humidity.length),
          description: data.descriptions[0], // Use first description of the day
          icon: data.icons[0] // Use first icon of the day
        });
      });
      
      return forecast;
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('API key invalid, falling back to free weather API');
        return await weatherApiService.getForecast(lat, lon, days);
      }
      console.log('OpenWeatherMap failed, using free weather API as fallback');
      return await weatherApiService.getForecast(lat, lon, days);
    }
  }

  async getYouTubeVideos(location) {
    if (!process.env.YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY.includes('your_')) {
      return await mockWeatherService.getYouTubeVideos(location);
    }

    try {
      const searchQuery = `${location} travel guide weather`;
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=3&key=${process.env.YOUTUBE_API_KEY}`;
      
      const response = await axios.get(url);
      
      return response.data.items.map(item => ({
        title: item.snippet.title,
        videoId: item.id.videoId,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle
      }));
    } catch (error) {
      console.warn('YouTube API failed:', error.message);
      return await mockWeatherService.getYouTubeVideos(location);
    }
  }

  async getGoogleMapsData(location) {
    if (!process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY.includes('your_')) {
      return await mockWeatherService.getGoogleMapsData(location);
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(location)}&inputtype=textquery&fields=place_id,formatted_address,types&key=${process.env.GOOGLE_MAPS_API_KEY}`;
      
      const response = await axios.get(url);
      
      if (response.data.candidates && response.data.candidates.length > 0) {
        const place = response.data.candidates[0];
        return {
          placeId: place.place_id,
          formattedAddress: place.formatted_address,
          types: place.types
        };
      }
      
      return null;
    } catch (error) {
      console.warn('Google Maps API failed:', error.message);
      return await mockWeatherService.getGoogleMapsData(location);
    }
  }
}

module.exports = new WeatherService();