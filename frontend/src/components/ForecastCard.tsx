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
import { TrendingUp, TrendingDown, Water } from '@mui/icons-material';
import { ForecastDay } from '../types/weather';
import weatherService from '../services/weatherService';

interface ForecastCardProps {
  forecast: ForecastDay[];
}

const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return {
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  };

  return (
    <Card sx={{ 
      borderRadius: '20px',
      background: 'rgba(254, 245, 249, 0.85)',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(245, 213, 219, 0.6)',
      boxShadow: '0 8px 32px rgba(180, 169, 214, 0.2)'
    }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ 
          fontWeight: 600, 
          color: '#4a3545', 
          mb: 3,
          fontFamily: '"Quicksand", sans-serif',
          textShadow: '0 2px 4px rgba(180, 169, 214, 0.2)'
        }}>
          5-Day Forecast ✨
        </Typography>

        <Grid container spacing={2}>
          {forecast.map((day, index) => {
            const dateInfo = formatDate(day.date);
            const isToday = index === 0;
            
            return (
              <Grid size={12} key={index}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    background: isToday 
                      ? 'linear-gradient(135deg, rgba(255, 236, 210, 0.5) 0%, rgba(229, 213, 250, 0.5) 100%)'
                      : 'linear-gradient(135deg, rgba(255, 236, 210, 0.2) 0%, rgba(229, 213, 250, 0.2) 100%)',
                    border: '1px solid',
                    borderColor: isToday ? '#e5d5fa' : 'rgba(245, 213, 219, 0.4)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(255, 236, 210, 0.6) 0%, rgba(229, 213, 250, 0.6) 100%)',
                      transform: 'translateX(8px)',
                      boxShadow: '0 6px 20px rgba(180, 169, 214, 0.3)'
                    }
                  }}
                >
                  <Grid container alignItems="center" spacing={2}>
                    {/* Date */}
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Box>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 600, 
                          color: '#4a3545',
                          fontFamily: '"Quicksand", sans-serif'
                        }}>
                          {isToday ? 'Today' : dateInfo.dayName}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: '#9d8189',
                          fontFamily: '"Montserrat", sans-serif'
                        }}>
                          {dateInfo.date}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Weather Icon and Description */}
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={weatherService.getWeatherIconUrl(day.icon)}
                          sx={{ 
                            width: 50, 
                            height: 50,
                            border: '2px solid',
                            borderColor: '#e5d5fa',
                            boxShadow: '0 2px 8px rgba(180, 169, 214, 0.2)'
                          }}
                        />
                        <Box>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: 500, 
                              color: '#4a3545',
                              textTransform: 'capitalize',
                              lineHeight: 1.2,
                              fontFamily: '"Quicksand", sans-serif'
                            }}
                          >
                            {day.description}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Water sx={{ fontSize: 16, color: '#b8a9d6' }} />
                            <Typography variant="caption" sx={{ 
                              color: '#9d8189',
                              fontFamily: '"Montserrat", sans-serif'
                            }}>
                              {day.humidity}% humidity
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Temperature Range */}
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TrendingUp sx={{ fontSize: 20, color: '#ff9a9e' }} />
                          <Typography variant="h6" sx={{ 
                            fontWeight: 600, 
                            color: '#ff9a9e',
                            fontFamily: '"Quicksand", sans-serif'
                          }}>
                            {Math.round(day.temp_max)}°
                          </Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TrendingDown sx={{ fontSize: 20, color: '#b8a9d6' }} />
                          <Typography variant="h6" sx={{ 
                            fontWeight: 600, 
                            color: '#b8a9d6',
                            fontFamily: '"Quicksand", sans-serif'
                          }}>
                            {Math.round(day.temp_min)}°
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Temperature Difference */}
                    <Grid size={{ xs: 12, sm: 2 }}>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" sx={{ color: '#9d8189' }}>
                          Range
                        </Typography>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 600, 
                          color: '#d4af91',
                          fontFamily: '"Quicksand", sans-serif'
                        }}>
                          {Math.round(day.temp_max - day.temp_min)}°C
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            );
          })}
        </Grid>

        {/* Summary Statistics */}
        <Box sx={{ 
          mt: 4, 
          p: 3, 
          background: 'linear-gradient(135deg, rgba(255, 236, 210, 0.3) 0%, rgba(229, 213, 250, 0.3) 100%)', 
          borderRadius: '16px',
          border: '1px solid rgba(245, 213, 219, 0.4)'
        }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 600, 
            color: '#4a3545', 
            mb: 2,
            fontFamily: '"Quicksand", sans-serif'
          }}>
            Forecast Summary ✨
          </Typography>
          
          <Grid container spacing={3}>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Avg High
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
                  {Math.round(forecast.reduce((sum, day) => sum + day.temp_max, 0) / forecast.length)}°C
                </Typography>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Avg Low
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'info.main' }}>
                  {Math.round(forecast.reduce((sum, day) => sum + day.temp_min, 0) / forecast.length)}°C
                </Typography>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Avg Humidity
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {Math.round(forecast.reduce((sum, day) => sum + day.humidity, 0) / forecast.length)}%
                </Typography>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Max Range
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {Math.round(Math.max(...forecast.map(day => day.temp_max - day.temp_min)))}°C
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ForecastCard;