import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Avatar,
  Divider
} from '@mui/material';
import {
  Thermostat,
  Water,
  Air,
  Visibility,
  Compress,
  Navigation
} from '@mui/icons-material';
import { CurrentWeatherResponse } from '../types/weather';
import weatherService from '../services/weatherService';

interface WeatherCardProps {
  weatherData: CurrentWeatherResponse;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData }) => {
  const { location, current } = weatherData;

  const weatherItems = [
    {
      icon: <Thermostat color="primary" />,
      label: 'Feels Like',
      value: `${Math.round(current.feels_like)}°C`,
      description: `Temperature feels ${Math.round(current.feels_like)}°C`
    },
    {
      icon: <Water color="primary" />,
      label: 'Humidity',
      value: `${current.humidity}%`,
      description: 'Relative humidity percentage'
    },
    {
      icon: <Compress color="primary" />,
      label: 'Pressure',
      value: `${current.pressure} hPa`,
      description: 'Atmospheric pressure'
    },
    {
      icon: <Air color="primary" />,
      label: 'Wind',
      value: `${Math.round(current.wind_speed)} m/s`,
      description: `${weatherService.getWindDirection(current.wind_direction)} direction`
    },
    {
      icon: <Visibility color="primary" />,
      label: 'Visibility',
      value: current.visibility ? `${(current.visibility / 1000).toFixed(1)} km` : 'N/A',
      description: 'Visibility distance'
    },
    {
      icon: <Navigation color="primary" />,
      label: 'Wind Direction',
      value: `${current.wind_direction}°`,
      description: weatherService.getWindDirection(current.wind_direction)
    }
  ];

  return (
    <Card sx={{ 
      borderRadius: '20px', 
      overflow: 'visible', 
      position: 'relative',
      background: 'rgba(254, 245, 249, 0.85)',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(245, 213, 219, 0.6)',
      boxShadow: '0 8px 32px rgba(180, 169, 214, 0.2)'
    }}>
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ 
              fontWeight: 700, 
              color: '#4a3545', 
              mb: 1,
              fontFamily: '"Quicksand", sans-serif',
              textShadow: '0 2px 4px rgba(180, 169, 214, 0.2)'
            }}>
              {location.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#9d8189', fontFamily: '"Quicksand", sans-serif' }}>
              {location.country}
            </Typography>
            <Typography variant="body2" sx={{ color: '#9d8189', mt: 0.5, fontFamily: '"Montserrat", sans-serif' }}>
              {location.coordinates.lat.toFixed(4)}°, {location.coordinates.lon.toFixed(4)}°
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Avatar
              src={weatherService.getWeatherIconUrl(current.icon, 'large')}
              sx={{ 
                width: 80, 
                height: 80, 
                mb: 1,
                border: '3px solid',
                borderColor: '#e5d5fa',
                boxShadow: '0 4px 16px rgba(180, 169, 214, 0.3)'
              }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {current.description}
            </Typography>
          </Box>
        </Box>

        {/* Main Temperature */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 700, 
              color: '#b8a9d6',
              textShadow: '0 4px 8px rgba(184, 169, 214, 0.3)',
              mb: 1,
              fontFamily: '"Quicksand", sans-serif',
              letterSpacing: '0.02em'
            }}
          >
            {Math.round(current.temperature)}°C
          </Typography>
          <Typography variant="h6" sx={{ 
            color: '#9d8189', 
            textTransform: 'capitalize',
            fontFamily: '"Quicksand", sans-serif'
          }}>
            {current.description}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Weather Details Grid */}
        <Grid container spacing={3}>
          {weatherItems.map((item, index) => (
            <Grid size={{ xs: 6, md: 4 }} key={index}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 2,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(255, 236, 210, 0.3) 0%, rgba(229, 213, 250, 0.3) 100%)',
                  border: '1px solid',
                  borderColor: 'rgba(245, 213, 219, 0.5)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(255, 236, 210, 0.5) 0%, rgba(229, 213, 250, 0.5) 100%)',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 6px 20px rgba(180, 169, 214, 0.3)'
                  }
                }}
              >
                <Box sx={{ mb: 1 }}>
                  {item.icon}
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5, textAlign: 'center' }}>
                  {item.label}
                </Typography>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  color: '#4a3545', 
                  textAlign: 'center',
                  fontFamily: '"Quicksand", sans-serif'
                }}>
                  {item.value}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center', mt: 0.5 }}>
                  {item.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Additional Info */}
        <Box sx={{ 
          mt: 3, 
          p: 2, 
          background: 'linear-gradient(135deg, rgba(255, 236, 210, 0.3) 0%, rgba(229, 213, 250, 0.3) 100%)', 
          borderRadius: '16px',
          border: '1px solid rgba(245, 213, 219, 0.3)'
        }}>
          <Typography variant="body2" sx={{ 
            color: '#9d8189', 
            textAlign: 'center',
            fontFamily: '"Quicksand", sans-serif'
          }}>
            Weather data updated in real-time ✨
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;