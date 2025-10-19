import axios, { AxiosResponse } from 'axios';
import {
  WeatherRequest,
  WeatherResponse,
  WeatherListResponse,
  CurrentWeatherResponse,
  ExportRequest,
  WeatherStats,
  WeatherRecord,
  ApiError
} from '../types/weather';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
);

class WeatherService {
  // CREATE - Store weather data in database
  async createWeatherRecord(request: WeatherRequest): Promise<WeatherRecord> {
    try {
      const response: AxiosResponse<WeatherResponse> = await api.post('/weather', request);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create weather record');
    }
  }

  // READ - Get all weather records
  async getWeatherRecords(params?: {
    location?: string;
    startDate?: string;
    endDate?: string;
    requestedBy?: string;
    page?: number;
    limit?: number;
  }): Promise<WeatherListResponse> {
    try {
      const response: AxiosResponse<WeatherListResponse> = await api.get('/weather', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch weather records');
    }
  }

  // READ - Get specific weather record by ID
  async getWeatherRecord(id: string): Promise<WeatherRecord> {
    try {
      const response: AxiosResponse<{ data: WeatherRecord }> = await api.get(`/weather/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch weather record');
    }
  }

  // UPDATE - Update existing weather record
  async updateWeatherRecord(id: string, updates: Partial<WeatherRecord>): Promise<WeatherRecord> {
    try {
      const response: AxiosResponse<WeatherResponse> = await api.put(`/weather/${id}`, updates);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update weather record');
    }
  }

  // DELETE - Delete weather record
  async deleteWeatherRecord(id: string): Promise<void> {
    try {
      await api.delete(`/weather/${id}`);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete weather record');
    }
  }

  // Get current weather without storing
  async getCurrentWeather(location: string): Promise<CurrentWeatherResponse> {
    try {
      const response: AxiosResponse<CurrentWeatherResponse> = await api.post('/weather/current', { location });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get current weather');
    }
  }

  // Export data in various formats
  async exportData(request: ExportRequest): Promise<Blob> {
    try {
      const response = await api.post('/data/export', request, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to export data');
    }
  }

  // Get export statistics
  async getStats(): Promise<WeatherStats> {
    try {
      const response: AxiosResponse<WeatherStats> = await api.get('/data/stats');
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch statistics');
    }
  }

  // Get user's current location
  async getCurrentLocation(): Promise<{ lat: number; lon: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          let message = 'Unable to get your location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              message = 'Location request timed out';
              break;
          }
          reject(new Error(message));
        },
        options
      );
    });
  }

  // Get weather for current location
  async getWeatherForCurrentLocation(): Promise<CurrentWeatherResponse> {
    try {
      const coords = await this.getCurrentLocation();
      const location = `${coords.lat},${coords.lon}`;
      return await this.getCurrentWeather(location);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get weather for current location');
    }
  }

  // Validate date range
  validateDateRange(startDate: string, endDate: string): { isValid: boolean; error?: string } {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { isValid: false, error: 'Invalid date format' };
    }

    if (start > end) {
      return { isValid: false, error: 'Start date cannot be after end date' };
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    if (start < thirtyDaysAgo) {
      return { isValid: false, error: 'Start date cannot be more than 30 days in the past' };
    }

    const tenDaysFromNow = new Date();
    tenDaysFromNow.setDate(now.getDate() + 10);

    if (end > tenDaysFromNow) {
      return { isValid: false, error: 'End date cannot be more than 10 days in the future' };
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 7) {
      return { isValid: false, error: 'Date range cannot exceed 7 days' };
    }

    return { isValid: true };
  }

  // Get weather icon URL
  getWeatherIconUrl(icon: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
    const sizeMap = {
      small: '@2x',
      medium: '@2x',
      large: '@4x'
    };
    return `https://openweathermap.org/img/wn/${icon}${sizeMap[size]}.png`;
  }

  // Format temperature
  formatTemperature(temp: number, unit: 'C' | 'F' = 'C'): string {
    if (unit === 'F') {
      return `${Math.round((temp * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(temp)}°C`;
  }

  // Get wind direction
  getWindDirection(degrees: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }
}

export default new WeatherService();