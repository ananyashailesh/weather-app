const mockWeatherData = {
  'new york': {
    location: { lat: 40.7128, lon: -74.0060, name: 'New York', country: 'US' },
    current: {
      temperature: 22,
      feels_like: 24,
      humidity: 65,
      pressure: 1013,
      wind_speed: 3.5,
      wind_direction: 180,
      visibility: 10000,
      description: 'partly cloudy',
      icon: '02d'
    }
  },
  'london': {
    location: { lat: 51.5074, lon: -0.1278, name: 'London', country: 'GB' },
    current: {
      temperature: 18,
      feels_like: 19,
      humidity: 72,
      pressure: 1015,
      wind_speed: 2.1,
      wind_direction: 225,
      visibility: 8000,
      description: 'light rain',
      icon: '10d'
    }
  },
  'tokyo': {
    location: { lat: 35.6762, lon: 139.6503, name: 'Tokyo', country: 'JP' },
    current: {
      temperature: 26,
      feels_like: 28,
      humidity: 68,
      pressure: 1018,
      wind_speed: 1.8,
      wind_direction: 90,
      visibility: 12000,
      description: 'clear sky',
      icon: '01d'
    }
  },
  'paris': {
    location: { lat: 48.8566, lon: 2.3522, name: 'Paris', country: 'FR' },
    current: {
      temperature: 20,
      feels_like: 21,
      humidity: 70,
      pressure: 1012,
      wind_speed: 2.5,
      wind_direction: 270,
      visibility: 9000,
      description: 'few clouds',
      icon: '02d'
    }
  },
  'sydney': {
    location: { lat: -33.8688, lon: 151.2093, name: 'Sydney', country: 'AU' },
    current: {
      temperature: 24,
      feels_like: 25,
      humidity: 60,
      pressure: 1020,
      wind_speed: 4.2,
      wind_direction: 135,
      visibility: 15000,
      description: 'sunny',
      icon: '01d'
    }
  },
  'default': {
    location: { lat: 40.7128, lon: -74.0060, name: 'Demo City', country: 'US' },
    current: {
      temperature: 20,
      feels_like: 22,
      humidity: 55,
      pressure: 1013,
      wind_speed: 2.5,
      wind_direction: 180,
      visibility: 10000,
      description: 'clear sky',
      icon: '01d'
    }
  }
};

const mockForecastData = [
  {
    date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    temp_min: 15,
    temp_max: 25,
    humidity: 60,
    description: 'sunny',
    icon: '01d'
  },
  {
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    temp_min: 12,
    temp_max: 22,
    humidity: 65,
    description: 'partly cloudy',
    icon: '02d'
  },
  {
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    temp_min: 18,
    temp_max: 28,
    humidity: 50,
    description: 'clear sky',
    icon: '01d'
  },
  {
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    temp_min: 16,
    temp_max: 24,
    humidity: 70,
    description: 'light rain',
    icon: '10d'
  },
  {
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    temp_min: 20,
    temp_max: 30,
    humidity: 45,
    description: 'sunny',
    icon: '01d'
  }
];

class MockWeatherService {
  async getCoordinates(location) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const key = location.toLowerCase().replace(/\s+/g, ' ');
    const data = mockWeatherData[key] || mockWeatherData.default;
    
    return {
      lat: data.location.lat,
      lon: data.location.lon,
      name: data.location.name,
      country: data.location.country
    };
  }

  async getCurrentWeather(lat, lon) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find closest mock data or use default
    const data = Object.values(mockWeatherData).find(d => 
      Math.abs(d.location.lat - lat) < 1 && Math.abs(d.location.lon - lon) < 1
    ) || mockWeatherData.default;
    
    return data.current;
  }

  async getForecast(lat, lon, days = 5) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockForecastData.slice(0, days);
  }

  async getYouTubeVideos(location) {
    return [
      {
        title: `${location} Travel Guide - Weather & Climate`,
        videoId: 'demo1',
        thumbnail: 'https://via.placeholder.com/320x180/e91e63/ffffff?text=Demo+Video+1',
        channelTitle: 'Demo Travel Channel'
      },
      {
        title: `Best Time to Visit ${location}`,
        videoId: 'demo2',
        thumbnail: 'https://via.placeholder.com/320x180/e91e63/ffffff?text=Demo+Video+2',
        channelTitle: 'Weather Guide'
      }
    ];
  }

  async getGoogleMapsData(location) {
    return {
      placeId: 'demo_place_id',
      formattedAddress: `${location}, Demo Country`,
      types: ['locality', 'political']
    };
  }
}

module.exports = new MockWeatherService();