import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import {
  LocationOn,
  Search,
  MyLocation,
  History as HistoryIcon,
  Cloud,
  Thermostat,
  Water,
  Air
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import weatherService from '../services/weatherService';
import { CurrentWeatherResponse, WeatherRequest } from '../types/weather';
import WeatherCard from './WeatherCard';
import ForecastCard from './ForecastCard';
import LocationInput from './LocationInput';
import DateRangePicker from './DateRangePicker';
import YouTubeVideos from './YouTubeVideos';
import GoogleMapView from './GoogleMapView';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`weather-tabpanel-${index}`}
      aria-labelledby={`weather-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const WeatherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [requestedBy, setRequestedBy] = useState('anonymous');
  const [currentWeather, setCurrentWeather] = useState<CurrentWeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Get current location weather on component mount
  useEffect(() => {
    handleCurrentLocation();
  }, []);

  const handleCurrentLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const weather = await weatherService.getWeatherForCurrentLocation();
      setCurrentWeather(weather);
      setLocation(`${weather.location.coordinates.lat}, ${weather.location.coordinates.lon}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchWeather = async () => {
    if (!location.trim()) {
      setError('Please enter a location');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const weather = await weatherService.getCurrentWeather(location.trim());
      setCurrentWeather(weather);
    } catch (err: any) {
      setError(err.message);
      setCurrentWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWeather = async () => {
    if (!location.trim()) {
      setError('Please enter a location');
      return;
    }

    // Validate date range
    const validation = weatherService.validateDateRange(startDate, endDate);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid date range');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const request: WeatherRequest = {
        location: location.trim(),
        startDate,
        endDate,
        requestedBy: requestedBy.trim() || 'anonymous'
      };

      const weatherRecord = await weatherService.createWeatherRecord(request);
      setSuccess('Weather data saved successfully!');
      setCurrentWeather({
        location: weatherRecord.location,
        current: weatherRecord.current,
        forecast: weatherRecord.forecast
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      py: 4,
      px: 3
    }}>
      {/* Header with navigation */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 5,
        maxWidth: 1400,
        mx: 'auto',
        background: 'rgba(254, 245, 249, 0.8)',
        backdropFilter: 'blur(15px)',
        p: 4,
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(180, 169, 214, 0.2)',
        border: '1px solid rgba(245, 213, 219, 0.5)'
      }}>
        <Box>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700, 
              color: '#4a3545',
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontFamily: '"Quicksand", "Montserrat", sans-serif',
              letterSpacing: '0.02em',
              textShadow: '0 2px 4px rgba(180, 169, 214, 0.3)'
            }}
          >
            Weather Analytics ✨
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: '#9d8189',
              fontWeight: 500,
              mt: 1,
              fontSize: '1.1rem',
              fontFamily: '"Quicksand", sans-serif'
            }}
          >
            Weather Data Management
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate('/history')}
          startIcon={<HistoryIcon />}
          sx={{ 
            background: 'linear-gradient(135deg, #ff9a9e 0%, #ffc3a0 100%)',
            color: '#4a3545',
            fontWeight: 600,
            borderRadius: '16px',
            px: 4,
            py: 2,
            fontSize: '1rem',
            fontFamily: '"Quicksand", sans-serif',
            textTransform: 'none',
            boxShadow: '0 4px 14px rgba(255, 154, 158, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #ffc3a0 0%, #d4af91 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(255, 154, 158, 0.5)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          View History
        </Button>
      </Box>

      {/* Main Container */}
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        {/* Error and Success Messages */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4, 
              borderRadius: 2.5,
              bgcolor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)',
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              '& .MuiAlert-icon': {
                color: '#dc2626'
              }
            }} 
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}
        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 4, 
              borderRadius: 2.5,
              bgcolor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#14532d',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)',
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              '& .MuiAlert-icon': {
                color: '#10b981'
              }
            }} 
            onClose={() => setSuccess(null)}
          >
            {success}
          </Alert>
        )}

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Left Panel - Input Form */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card sx={{ 
              borderRadius: 3,
              bgcolor: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
              position: 'sticky',
              top: 120,
              overflow: 'visible'
            }}>
              <CardContent sx={{ p: 5 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 4,
                  pb: 3,
                  borderBottom: '2px solid #e2e8f0'
                }}>
                  <Box sx={{
                    bgcolor: '#0891b2',
                    borderRadius: 2,
                    p: 1.5,
                    mr: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <LocationOn sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700, 
                      color: '#1e3a5f',
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      fontSize: '1.5rem'
                    }}
                  >
                    Weather Search
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <LocationInput
                    value={location}
                    onChange={setLocation}
                    onSearch={handleSearchWeather}
                    loading={loading}
                  />

                  <Button
                    variant="outlined"
                    onClick={handleCurrentLocation}
                    disabled={loading}
                    startIcon={<MyLocation />}
                    sx={{ 
                      borderRadius: 2.5,
                      py: 2,
                      fontWeight: 600,
                      fontSize: '1rem',
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      textTransform: 'none',
                      borderColor: '#0891b2',
                      color: '#0891b2',
                      borderWidth: 2,
                      '&:hover': {
                        borderColor: '#0e7490',
                        color: '#0e7490',
                        borderWidth: 2,
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(8, 145, 178, 0.2)'
                      },
                      '&:disabled': {
                        borderColor: '#cbd5e1',
                        color: '#94a3b8'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Use Current Location
                  </Button>

                  <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    onStartDateChange={setStartDate}
                    onEndDateChange={setEndDate}
                  />

                  <TextField
                    label="Requested By"
                    variant="outlined"
                    fullWidth
                    value={requestedBy}
                    onChange={(e) => setRequestedBy(e.target.value)}
                    placeholder="Enter your name (optional)"
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2.5,
                        fontSize: '1rem',
                        '& fieldset': {
                          borderColor: '#d1d5db',
                          borderWidth: 2
                        },
                        '&:hover fieldset': {
                          borderColor: '#0891b2',
                          borderWidth: 2
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#0891b2',
                          borderWidth: 2
                        }
                      },
                      '& .MuiInputLabel-root': {
                        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                        fontWeight: 500,
                        color: '#6b7280',
                        '&.Mui-focused': {
                          color: '#0891b2',
                          fontWeight: 600
                        }
                      }
                    }}
                  />

                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Button
                      variant="contained"
                      onClick={handleSearchWeather}
                      disabled={loading || !location.trim()}
                      startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <Search />}
                      sx={{ 
                        flex: 1,
                        py: 2.5,
                        borderRadius: 2.5,
                        fontWeight: 600,
                        fontSize: '1rem',
                        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                        textTransform: 'none',
                        bgcolor: '#0891b2',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(8, 145, 178, 0.3)',
                        '&:hover': {
                          bgcolor: '#0e7490',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 6px 16px rgba(8, 145, 178, 0.4)'
                        },
                        '&:disabled': {
                          bgcolor: '#cbd5e1',
                          color: '#94a3b8',
                          boxShadow: 'none'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Search
                    </Button>

                    <Button
                      variant="contained"
                      onClick={handleSaveWeather}
                      disabled={loading || !location.trim()}
                      sx={{ 
                        flex: 1,
                        py: 2.5,
                        borderRadius: 2.5,
                        fontWeight: 600,
                        fontSize: '1rem',
                        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                        textTransform: 'none',
                        bgcolor: '#10b981',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                        '&:hover': {
                          bgcolor: '#059669',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)'
                        },
                        '&:disabled': {
                          bgcolor: '#cbd5e1',
                          color: '#94a3b8',
                          boxShadow: 'none'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Save to DB
                    </Button>
                  </Box>
                </Box>

                {currentWeather && (
                  <Box sx={{ 
                    mt: 4, 
                    pt: 3,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        mb: 2, 
                        color: 'text.primary',
                        fontWeight: 600
                      }}
                    >
                      Quick Stats
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                      <Chip
                        icon={<Thermostat />}
                        label={`${Math.round(currentWeather.current.temperature)}°C`}
                        color="primary"
                        variant="filled"
                        sx={{ 
                          fontWeight: 600,
                          '& .MuiChip-icon': { fontSize: 18 }
                        }}
                      />
                      <Chip
                        icon={<Water />}
                        label={`${currentWeather.current.humidity}%`}
                        color="info"
                        variant="filled"
                        sx={{ 
                          fontWeight: 600,
                          '& .MuiChip-icon': { fontSize: 18 }
                        }}
                      />
                      <Chip
                        icon={<Air />}
                        label={`${Math.round(currentWeather.current.wind_speed)} m/s`}
                        color="secondary"
                        variant="filled"
                        sx={{ 
                          fontWeight: 600,
                          '& .MuiChip-icon': { fontSize: 18 }
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Right Panel - Weather Display */}
          <Grid size={{ xs: 12, lg: 8 }}>
            {loading && (
              <Card sx={{ 
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                minHeight: 400
              }}>
                <CardContent sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  minHeight: 400,
                  p: 4
                }}>
                  <CircularProgress 
                    size={80} 
                    thickness={4} 
                    sx={{ 
                      color: 'primary.main',
                      mb: 3
                    }}
                  />
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: 'text.secondary', 
                      fontWeight: 600,
                      mb: 1
                    }}
                  >
                    Loading Weather Data
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ color: 'text.secondary' }}
                  >
                    Please wait while we fetch the latest information
                  </Typography>
                </CardContent>
              </Card>
            )}

            {!loading && !currentWeather && (
              <Card sx={{ 
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                minHeight: 400
              }}>
                <CardContent sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  minHeight: 400,
                  p: 4,
                  textAlign: 'center'
                }}>
                  <Box sx={{
                    bgcolor: 'primary.light',
                    borderRadius: '50%',
                    p: 4,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Cloud sx={{ fontSize: 60, color: 'primary.main' }} />
                  </Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: 'primary.dark', 
                      fontWeight: 700,
                      mb: 2
                    }}
                  >
                    Get Started
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'text.secondary',
                      mb: 1,
                      maxWidth: 500
                    }}
                  >
                    Enter a location to access comprehensive weather analytics
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'text.secondary',
                      maxWidth: 400
                    }}
                  >
                    Search by city name, ZIP code, coordinates, or use your current location
                  </Typography>
                </CardContent>
              </Card>
            )}

            {!loading && currentWeather && (
              <Box>
                <Card sx={{
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  mb: 3,
                  overflow: 'hidden'
                }}>
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    sx={{
                      bgcolor: 'rgba(102, 126, 234, 0.05)',
                      '& .MuiTab-root': {
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '1rem',
                        py: 2,
                        '&.Mui-selected': {
                          color: 'primary.main',
                          fontWeight: 700
                        }
                      },
                      '& .MuiTabs-indicator': {
                        height: 3,
                        borderRadius: '3px 3px 0 0'
                      }
                    }}
                  >
                    <Tab label="Current Weather" />
                    <Tab label="5-Day Forecast" />
                    <Tab label="Additional Info" />
                  </Tabs>
                </Card>

                <Box sx={{
                  '& > div': {
                    '& > *': {
                      borderRadius: 4,
                      background: 'rgba(255, 255, 255, 0.95) !important',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1) !important',
                      overflow: 'hidden'
                    }
                  }
                }}>
                  <TabPanel value={tabValue} index={0}>
                    <WeatherCard weatherData={currentWeather} />
                  </TabPanel>

                  <TabPanel value={tabValue} index={1}>
                    <ForecastCard forecast={currentWeather.forecast} />
                  </TabPanel>

                  <TabPanel value={tabValue} index={2}>
                    <Grid container spacing={3}>
                      <Grid size={12}>
                        <YouTubeVideos locationName={currentWeather.location.name} />
                      </Grid>
                      <Grid size={12}>
                        <GoogleMapView
                          location={currentWeather.location}
                          coordinates={currentWeather.location.coordinates}
                        />
                      </Grid>
                    </Grid>
                  </TabPanel>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default WeatherDashboard;