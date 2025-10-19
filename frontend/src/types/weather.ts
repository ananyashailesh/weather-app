export interface Coordinates {
  lat: number;
  lon: number;
}

export interface Location {
  name: string;
  country: string;
  coordinates: Coordinates;
}

export interface CurrentWeather {
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_direction: number;
  visibility?: number;
  uv_index?: number;
  description: string;
  icon: string;
}

export interface ForecastDay {
  date: string | Date;
  temp_min: number;
  temp_max: number;
  humidity: number;
  description: string;
  icon: string;
}

export interface YouTubeVideo {
  title: string;
  videoId: string;
  thumbnail: string;
  channelTitle: string;
}

export interface GoogleMapsData {
  placeId: string;
  formattedAddress: string;
  types: string[];
}

export interface AdditionalData {
  youtubeVideos: YouTubeVideo[];
  googleMapsData: GoogleMapsData | null;
}

export interface DateRange {
  start: string | Date;
  end: string | Date;
}

export interface WeatherRecord {
  _id: string;
  location: Location;
  current: CurrentWeather;
  forecast: ForecastDay[];
  dateRange: DateRange;
  requestedBy: string;
  additionalData: AdditionalData;
  createdAt: string;
  updatedAt: string;
}

export interface WeatherRequest {
  location: string;
  startDate: string;
  endDate: string;
  requestedBy?: string;
}

export interface WeatherResponse {
  message: string;
  data: WeatherRecord;
}

export interface WeatherListResponse {
  data: WeatherRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CurrentWeatherResponse {
  location: Location;
  current: CurrentWeather;
  forecast: ForecastDay[];
}

export interface ExportRequest {
  format: 'json' | 'csv' | 'xml' | 'pdf' | 'markdown';
  filters?: {
    location?: string;
    startDate?: string;
    endDate?: string;
    requestedBy?: string;
  };
}

export interface ApiError {
  error: string;
}

export interface WeatherStats {
  overall: {
    totalRecords: number;
    uniqueLocationsCount: number;
    avgTemperature: number;
    minTemperature: number;
    maxTemperature: number;
  };
  topLocations: Array<{
    _id: string;
    count: number;
    avgTemp: number;
  }>;
}