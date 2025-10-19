import React from 'react';
import {
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Search,
  LocationOn
} from '@mui/icons-material';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  loading?: boolean;
}

const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  onSearch,
  loading = false
}) => {
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <TextField
      label="Location"
      variant="outlined"
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyPress={handleKeyPress}
      placeholder="Enter city name, ZIP code, or coordinates"
      disabled={loading}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 3,
          fontSize: '1.1rem',
          '& fieldset': {
            borderWidth: 2,
            borderColor: 'rgba(102, 126, 234, 0.2)'
          },
          '&:hover fieldset': {
            borderColor: 'rgba(102, 126, 234, 0.5)',
            borderWidth: 2
          },
          '&.Mui-focused fieldset': {
            borderColor: 'primary.main',
            borderWidth: 2
          }
        },
        '& .MuiInputLabel-root': {
          fontSize: '1rem',
          fontWeight: 500,
          '&.Mui-focused': {
            color: 'primary.main',
            fontWeight: 600
          }
        },
        '& .MuiFormHelperText-root': {
          fontSize: '0.85rem',
          mt: 1,
          mx: 0
        }
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LocationOn 
              sx={{ 
                color: 'primary.main',
                fontSize: 24
              }} 
            />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={onSearch}
              disabled={loading || !value.trim()}
              sx={{
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(102, 126, 234, 0.08)',
                  transform: 'scale(1.05)'
                },
                '&:disabled': {
                  color: 'text.disabled'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <Search sx={{ fontSize: 22 }} />
            </IconButton>
          </InputAdornment>
        ),
      }}
      helperText="Examples: 'New York', '10001', '40.7128,-74.0060'"
    />
  );
};

export default LocationInput;