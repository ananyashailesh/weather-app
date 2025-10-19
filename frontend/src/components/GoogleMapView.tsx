import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box
} from '@mui/material';
import { Map } from '@mui/icons-material';
import { Location, Coordinates } from '../types/weather';

interface GoogleMapViewProps {
  location: Location;
  coordinates: Coordinates;
}

const GoogleMapView: React.FC<GoogleMapViewProps> = ({ location, coordinates }) => {
  const googleMapsUrl = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lon}`;

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Map color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.dark' }}>
            Location Map
          </Typography>
        </Box>
        
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 200,
            backgroundColor: 'rgba(233, 30, 99, 0.05)',
            borderRadius: 2,
            border: '1px dashed',
            borderColor: 'primary.light',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(233, 30, 99, 0.1)',
              borderColor: 'primary.main'
            }
          }}
          onClick={() => window.open(googleMapsUrl, '_blank')}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Map sx={{ fontSize: 48, color: 'primary.light', mb: 1 }} />
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
              {location.name}, {location.country}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {coordinates.lat.toFixed(4)}°, {coordinates.lon.toFixed(4)}°
            </Typography>
            <Typography variant="caption" sx={{ color: 'primary.main', display: 'block', mt: 1 }}>
              Click to view on Google Maps
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GoogleMapView;