import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box
} from '@mui/material';
import { YouTube } from '@mui/icons-material';

interface YouTubeVideosProps {
  locationName: string;
}

const YouTubeVideos: React.FC<YouTubeVideosProps> = ({ locationName }) => {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <YouTube color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.dark' }}>
            Related Videos
          </Typography>
        </Box>
        
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 150,
            backgroundColor: 'rgba(233, 30, 99, 0.05)',
            borderRadius: 2,
            border: '1px dashed',
            borderColor: 'primary.light'
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <YouTube sx={{ fontSize: 48, color: 'primary.light', mb: 1 }} />
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              YouTube videos for "{locationName}"
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Feature available with YouTube API key
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default YouTubeVideos;