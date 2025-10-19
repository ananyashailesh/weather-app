import React from 'react';
import {
  TextField,
  Box,
  Typography
} from '@mui/material';
import { DateRange } from '@mui/icons-material';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}) => {
  // Set min and max dates
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const tenDaysFromNow = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1.5, 
        mb: 3,
        pb: 2,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Box sx={{
          bgcolor: 'primary.light',
          borderRadius: '50%',
          p: 0.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <DateRange sx={{ color: 'primary.main', fontSize: 20 }} />
        </Box>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 600, 
            color: 'primary.dark'
          }}
        >
          Date Range Selection
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField
          label="Start Date"
          type="date"
          fullWidth
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: thirtyDaysAgo,
            max: tenDaysFromNow
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
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
              fontWeight: 500,
              '&.Mui-focused': {
                color: 'primary.main',
                fontWeight: 600
              }
            }
          }}
        />
        
        <TextField
          label="End Date"
          type="date"
          fullWidth
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: startDate || thirtyDaysAgo,
            max: tenDaysFromNow
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
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
              fontWeight: 500,
              '&.Mui-focused': {
                color: 'primary.main',
                fontWeight: 600
              }
            }
          }}
        />
      </Box>
      
      <Box sx={{
        mt: 2,
        p: 2,
        bgcolor: 'rgba(102, 126, 234, 0.05)',
        borderRadius: 2,
        border: '1px solid rgba(102, 126, 234, 0.1)'
      }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'text.secondary',
            fontSize: '0.85rem',
            lineHeight: 1.4
          }}
        >
          Select date range for weather data analysis. Maximum range is 30 days.
        </Typography>
      </Box>
    </Box>
  );
};

export default DateRangePicker;