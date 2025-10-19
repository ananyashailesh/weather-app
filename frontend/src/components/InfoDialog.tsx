import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Link,
  Divider
} from '@mui/material';
import { LinkedIn, GitHub, Info } from '@mui/icons-material';

interface InfoDialogProps {
  open: boolean;
  onClose: () => void;
}

const InfoDialog: React.FC<InfoDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(145deg, #f8bbd9, #f48fb1)',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        background: 'linear-gradient(45deg, #e91e63 30%, #ff4081 90%)',
        color: 'white',
        fontWeight: 600
      }}>
        <Info />
        About This Weather App
      </DialogTitle>
      
      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.dark', mb: 1 }}>
            Created by: Ananya Shailesh
          </Typography>
          <Typography variant="body1" sx={{ color: '#2d3436', mb: 2, fontWeight: 500 }}>
            Full-stack weather application built for the PM Accelerator Technical Assessment
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.dark', mb: 2 }}>
            About Product Manager Accelerator
          </Typography>
          <Typography variant="body1" sx={{ color: '#2d3436', mb: 2, lineHeight: 1.6, fontWeight: 500 }}>
            Product Manager Accelerator is a premier program designed to help professionals transition into 
            product management roles and advance their careers in tech. The program provides comprehensive 
            training, mentorship, and hands-on experience to build the skills necessary for success in 
            product management.
          </Typography>
          <Typography variant="body1" sx={{ color: '#2d3436', lineHeight: 1.6, fontWeight: 500 }}>
            Through intensive training modules, real-world projects, and industry expert guidance, 
            participants develop expertise in product strategy, user research, data analysis, and 
            technical product management.
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.dark', mb: 2 }}>
            Technical Features
          </Typography>
          <Box component="ul" sx={{ pl: 2, color: '#2d3436', fontWeight: 500 }}>
            <li>React TypeScript frontend with Material-UI</li>
            <li>Node.js/Express backend with MongoDB</li>
            <li>Real-time weather data from Open-Meteo API (free)</li>
            <li>Complete CRUD operations for weather records</li>
            <li>Location detection and validation</li>
            <li>5-day weather forecast</li>
            <li>Data export in multiple formats (JSON, CSV, XML, PDF, Markdown)</li>
            <li>Responsive design with pink theme</li>
            <li>Input validation and error handling</li>
            <li>Optional YouTube and Google Maps integration</li>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
          <Button
            variant="outlined"
            startIcon={<LinkedIn />}
            onClick={() => window.open('https://www.linkedin.com/school/pmaccelerator/about/', '_blank')}
            sx={{ 
              borderRadius: 3,
              color: '#2d3436',
              borderColor: '#2d3436',
              '&:hover': {
                borderColor: '#636e72',
                backgroundColor: 'rgba(45, 52, 54, 0.04)'
              }
            }}
          >
            PM Accelerator LinkedIn
          </Button>
          <Button
            variant="outlined"
            startIcon={<GitHub />}
            onClick={() => window.open('https://github.com/ananyashailesh/weather-app', '_blank')}
            sx={{ 
              borderRadius: 3,
              color: '#2d3436',
              borderColor: '#2d3436',
              '&:hover': {
                borderColor: '#636e72',
                backgroundColor: 'rgba(45, 52, 54, 0.04)'
              }
            }}
          >
            View Source Code
          </Button>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={onClose} 
          variant="contained" 
          color="primary"
          sx={{ borderRadius: 3, px: 4 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InfoDialog;