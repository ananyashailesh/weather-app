const axios = require('axios');

class WeatherApiService {
  constructor() {
    // Using Open-Meteo - completely free weather API, no API key needed
    this.weatherBaseUrl = 'https://api.open-meteo.com/v1';
    // Using Nominatim (OpenStreetMap) - free geocoding API
    this.geocodingBaseUrl = 'https://nominatim.openstreetmap.org';
  }

  async getCoordinates(location) {
    console.log('Getting coordinates for:', location);
    try {
      // Check if location is already coordinates (lat,lon format)
      if (/^-?\d+\.?\d*,-?\d+\.?\d*$/.test(location)) {
        const [lat, lon] = location.split(',').map(coord => parseFloat(coord.trim()));
        return { lat, lon, name: `${lat}, ${lon}`, country: '' };
      }
      
      // Use Nominatim to geocode the location
      const url = `${this.geocodingBaseUrl}/search?q=${encodeURIComponent(location)}&format=json&limit=1`;
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'WeatherApp/1.0'
        },
        timeout: 10000
      });
      
      if (!response.data || response.data.length === 0) {
        throw new Error('Location not found');
      }
      
      const result = response.data[0];
      return {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        name: result.display_name.split(',')[0],
        country: result.display_name.split(',').slice(-1)[0].trim()
      };
    } catch (error) {
      console.error('Geocoding error:', error.message);
      throw new Error(`Failed to get coordinates: ${error.message}`);
    }
  }

  async getCurrentWeather(lat, lon) {
    console.log('Getting current weather for:', lat, lon);
    try {
      // Open-Meteo API for current weather
      const url = `${this.weatherBaseUrl}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl&timezone=auto`;
      
      const response = await axios.get(url, { timeout: 10000 });
      const current = response.data.current;
      
      // Map WMO weather codes to descriptions and icons
      const weatherInfo = this.mapWeatherCode(current.weather_code);
      
      return {
        temperature: current.temperature_2m,
        feels_like: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        pressure: current.pressure_msl,
        wind_speed: current.wind_speed_10m,
        wind_direction: current.wind_direction_10m,
        visibility: 10000, // Open-Meteo doesn't provide visibility
        description: weatherInfo.description,
        icon: weatherInfo.icon
      };
    } catch (error) {
      console.error('Weather API error:', error.message);
      throw new Error(`Failed to get current weather: ${error.message}`);
    }
  }

  async getForecast(lat, lon, days = 5) {
    console.log('Getting forecast for:', lat, lon, days);
    try {
      // Open-Meteo API for forecast
      const url = `${this.weatherBaseUrl}/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,relative_humidity_2m_mean&timezone=auto&forecast_days=${days}`;
      
      const response = await axios.get(url, { timeout: 10000 });
      const daily = response.data.daily;
      
      const forecast = [];
      for (let i = 0; i < daily.time.length; i++) {
        const weatherInfo = this.mapWeatherCode(daily.weather_code[i]);
        forecast.push({
          date: new Date(daily.time[i]),
          temp_min: daily.temperature_2m_min[i],
          temp_max: daily.temperature_2m_max[i],
          humidity: Math.round(daily.relative_humidity_2m_mean[i]),
          description: weatherInfo.description,
          icon: weatherInfo.icon
        });
      }
      
      return forecast;
    } catch (error) {
      console.error('Forecast API error:', error.message);
      throw new Error(`Failed to get forecast: ${error.message}`);
    }
  }

  // Map WMO weather codes to descriptions and icons
  // https://open-meteo.com/en/docs
  mapWeatherCode(code) {
    const weatherMap = {
      0: { description: 'clear sky', icon: '01d' },
      1: { description: 'mainly clear', icon: '01d' },
      2: { description: 'partly cloudy', icon: '02d' },
      3: { description: 'overcast', icon: '03d' },
      45: { description: 'foggy', icon: '50d' },
      48: { description: 'depositing rime fog', icon: '50d' },
      51: { description: 'light drizzle', icon: '09d' },
      53: { description: 'moderate drizzle', icon: '09d' },
      55: { description: 'dense drizzle', icon: '09d' },
      61: { description: 'slight rain', icon: '10d' },
      63: { description: 'moderate rain', icon: '10d' },
      65: { description: 'heavy rain', icon: '10d' },
      71: { description: 'slight snow', icon: '13d' },
      73: { description: 'moderate snow', icon: '13d' },
      75: { description: 'heavy snow', icon: '13d' },
      77: { description: 'snow grains', icon: '13d' },
      80: { description: 'slight rain showers', icon: '09d' },
      81: { description: 'moderate rain showers', icon: '09d' },
      82: { description: 'violent rain showers', icon: '09d' },
      85: { description: 'slight snow showers', icon: '13d' },
      86: { description: 'heavy snow showers', icon: '13d' },
      95: { description: 'thunderstorm', icon: '11d' },
      96: { description: 'thunderstorm with slight hail', icon: '11d' },
      99: { description: 'thunderstorm with heavy hail', icon: '11d' }
    };
    
    return weatherMap[code] || { description: 'unknown', icon: '01d' };
  }

  async getYouTubeVideos(location) {
    // Return mock YouTube data
    return [
      {
        title: `${location} Weather Guide & Climate`,
        videoId: 'demo1',
        thumbnail: 'https://via.placeholder.com/320x180/e91e63/ffffff?text=Weather+Guide',
        channelTitle: 'Weather Channel'
      },
      {
        title: `Best Time to Visit ${location}`,
        videoId: 'demo2',
        thumbnail: 'https://via.placeholder.com/320x180/e91e63/ffffff?text=Travel+Tips',
        channelTitle: 'Travel Guide'
      }
    ];
  }

  async getGoogleMapsData(location) {
    // Return mock Google Maps data
    return {
      placeId: 'weather_demo_place_id',
      formattedAddress: `${location}, Weather Demo`,
      types: ['locality', 'political']
    };
  }
}

module.exports = new WeatherApiService();