import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  Pagination
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  Download,
  Refresh,
  FilterList
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import weatherService from '../services/weatherService';
import { WeatherRecord, ExportRequest } from '../types/weather';

const WeatherHistory: React.FC = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<WeatherRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filters
  const [locationFilter, setLocationFilter] = useState('');
  const [requestedByFilter, setRequestedByFilter] = useState('');
  
  // Edit dialog
  const [editRecord, setEditRecord] = useState<WeatherRecord | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editRequestedBy, setEditRequestedBy] = useState('');
  
  // Export menu
  const [exportAnchor, setExportAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    loadRecords();
  }, [page, locationFilter, requestedByFilter]); // loadRecords is recreated on every render, so it's safe to omit

  const loadRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { page, limit: 10 };
      if (locationFilter.trim()) params.location = locationFilter.trim();
      if (requestedByFilter.trim()) params.requestedBy = requestedByFilter.trim();
      
      const response = await weatherService.getWeatherRecords(params);
      setRecords(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: WeatherRecord) => {
    setEditRecord(record);
    setEditRequestedBy(record.requestedBy);
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editRecord) return;
    
    setLoading(true);
    try {
      await weatherService.updateWeatherRecord(editRecord._id, {
        requestedBy: editRequestedBy.trim() || 'anonymous'
      });
      setSuccess('Record updated successfully!');
      setEditOpen(false);
      loadRecords();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    
    setLoading(true);
    try {
      await weatherService.deleteWeatherRecord(id);
      setSuccess('Record deleted successfully!');
      loadRecords();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: string) => {
    setExportAnchor(null);
    setLoading(true);
    try {
      const request: ExportRequest = {
        format: format as any,
        filters: {
          ...(locationFilter && { location: locationFilter }),
          ...(requestedByFilter && { requestedBy: requestedByFilter })
        }
      };
      
      const blob = await weatherService.exportData(request);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `weather-data-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSuccess(`Data exported as ${format.toUpperCase()}!`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/')} color="primary">
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.dark' }}>
            Weather History
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => {
              setLocationFilter('');
              setRequestedByFilter('');
              setPage(1);
            }}
          >
            Clear Filters
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadRecords}
            disabled={loading}
          >
            Refresh
          </Button>
          
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={(e) => setExportAnchor(e.currentTarget)}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Filter by Location"
                variant="outlined"
                size="small"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && loadRecords()}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Filter by Requested By"
                variant="outlined"
                size="small"
                value={requestedByFilter}
                onChange={(e) => setRequestedByFilter(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && loadRecords()}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={loadRecords}
                disabled={loading}
                sx={{ height: 40 }}
              >
                Apply Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Error/Success Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Records */}
      {loading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography>Loading...</Typography>
        </Box>
      )}

      {!loading && records.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              No weather records found
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              Create some weather records from the dashboard
            </Typography>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3}>
        {records.map((record) => (
          <Grid size={12} key={record._id}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={weatherService.getWeatherIconUrl(record.current.icon)}
                      sx={{ width: 50, height: 50 }}
                    />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.dark' }}>
                        {record.location.name}, {record.location.country}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {formatDate(record.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {Math.round(record.current.temperature)}°C
                    </Typography>
                    <IconButton onClick={() => handleEdit(record)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(record._id)} color="error">
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip label={`${record.current.humidity}% humidity`} size="small" variant="outlined" />
                  <Chip label={`${Math.round(record.current.wind_speed)} m/s wind`} size="small" variant="outlined" />
                  <Chip label={`By: ${record.requestedBy}`} size="small" color="primary" />
                </Box>

                <Typography variant="body2" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                  {record.current.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Weather Record</DialogTitle>
        <DialogContent>
          <TextField
            label="Requested By"
            variant="outlined"
            fullWidth
            value={editRequestedBy}
            onChange={(e) => setEditRequestedBy(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" disabled={loading}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Export Menu */}
      <Menu
        anchorEl={exportAnchor}
        open={Boolean(exportAnchor)}
        onClose={() => setExportAnchor(null)}
      >
        <MenuItem onClick={() => handleExport('json')}>Export as JSON</MenuItem>
        <MenuItem onClick={() => handleExport('csv')}>Export as CSV</MenuItem>
        <MenuItem onClick={() => handleExport('xml')}>Export as XML</MenuItem>
        <MenuItem onClick={() => handleExport('pdf')}>Export as PDF</MenuItem>
        <MenuItem onClick={() => handleExport('markdown')}>Export as Markdown</MenuItem>
      </Menu>
    </Box>
  );
};

export default WeatherHistory;