import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, Typography, Container, IconButton, Box } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CloudIcon from '@mui/icons-material/Cloud';
import WeatherDashboard from './components/WeatherDashboard';
import WeatherHistory from './components/WeatherHistory';
import InfoDialog from './components/InfoDialog';
import './App.css';

// Elegant girly theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#b8a9d6', // Soft lavender
      light: '#e5d5fa',
      dark: '#9d8ab8',
    },
    secondary: {
      main: '#ff9a9e', // Coral pink
      light: '#ffc3a0',
      dark: '#d4af91', // Rose gold
    },
    background: {
      default: '#fffbf5', // Cream white
      paper: '#fef5f9', // White with pink tint
    },
    text: {
      primary: '#4a3545', // Deep plum
      secondary: '#9d8189', // Mauve
    },
  },
  typography: {
    fontFamily: '"Quicksand", "Montserrat", "Comfortaa", "Roboto", "Arial", sans-serif',
    h3: {
      fontWeight: 600,
      letterSpacing: '0.02em',
      color: '#4a3545',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '0.01em',
      color: '#4a3545',
    },
    h5: {
      fontWeight: 500,
      color: '#9d8189',
    },
    h6: {
      fontWeight: 500,
      color: '#9d8189',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(254, 245, 249, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(245, 213, 219, 0.5)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(180, 169, 214, 0.15)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(180, 169, 214, 0.25)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          textTransform: 'none',
          fontWeight: 600,
          letterSpacing: '0.02em',
          boxShadow: '0 4px 14px rgba(212, 175, 145, 0.25)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(212, 175, 145, 0.35)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
          color: '#4a3545',
          '&:hover': {
            background: 'linear-gradient(135deg, #fcb69f 0%, #ff9a9e 100%)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            '& fieldset': {
              borderColor: 'rgba(245, 213, 219, 0.8)',
              borderWidth: '2px',
            },
            '&:hover fieldset': {
              borderColor: '#d4a5a5',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#b8a9d6',
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          margin: '0 4px',
          minHeight: '48px',
          transition: 'all 0.3s ease',
          '&.Mui-selected': {
            background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #e5d5fa 100%)',
            color: '#4a3545',
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(180, 169, 214, 0.3)',
          },
        },
      },
    },
  },
});

function App() {
  const [infoOpen, setInfoOpen] = React.useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 25%, #e5d5fa 75%, #b8a9d6 100%)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255, 236, 210, 0.3) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(229, 213, 250, 0.3) 0%, transparent 50%)`,
            pointerEvents: 'none',
          }
        }}>
          <AppBar position="static" sx={{ 
            background: 'linear-gradient(135deg, rgba(184, 169, 214, 0.95) 0%, rgba(212, 175, 145, 0.95) 100%)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 30px rgba(180, 169, 214, 0.2)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
          }}>
            <Toolbar>
              <CloudIcon sx={{ mr: 2, fontSize: 32, filter: 'drop-shadow(0 2px 4px rgba(255,255,255,0.5))' }} />
              <Typography variant="h5" component="div" sx={{ 
                flexGrow: 1,
                fontWeight: 700,
                letterSpacing: '0.03em',
                textShadow: '0 2px 8px rgba(255,255,255,0.3)',
                fontFamily: '"Quicksand", sans-serif',
              }}>
                Weather Analytics ✨
              </Typography>
              <IconButton 
                color="inherit" 
                onClick={() => setInfoOpen(true)}
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <InfoIcon />
              </IconButton>
            </Toolbar>
          </AppBar>

          <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
            <Routes>
              <Route path="/" element={<WeatherDashboard />} />
              <Route path="/history" element={<WeatherHistory />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Container>

          <InfoDialog open={infoOpen} onClose={() => setInfoOpen(false)} />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
