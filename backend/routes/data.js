const express = require('express');
const router = express.Router();
const Weather = require('../models/Weather');
const { Parser } = require('json2csv');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const xml2js = require('xml2js');
const { exportFormatSchema } = require('../utils/validation');

// Export data in various formats
router.post('/export', async (req, res) => {
  try {
    // Validate request
    const { error, value } = exportFormatSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { format, filters = {} } = value;

    // Build filter object
    const filter = {};
    
    if (filters.location) {
      filter['location.name'] = { $regex: filters.location, $options: 'i' };
    }
    
    if (filters.startDate || filters.endDate) {
      filter['dateRange'] = {};
      if (filters.startDate) filter['dateRange']['$gte'] = new Date(filters.startDate);
      if (filters.endDate) filter['dateRange']['$lte'] = new Date(filters.endDate);
    }
    
    if (filters.requestedBy) {
      filter.requestedBy = { $regex: filters.requestedBy, $options: 'i' };
    }

    // Get weather records
    const weatherRecords = await Weather.find(filter).sort({ createdAt: -1 });

    if (weatherRecords.length === 0) {
      return res.status(404).json({ error: 'No weather records found matching the filters' });
    }

    // Generate export based on format
    switch (format) {
      case 'json':
        return exportJSON(res, weatherRecords);
      case 'csv':
        return exportCSV(res, weatherRecords);
      case 'xml':
        return exportXML(res, weatherRecords);
      case 'pdf':
        return exportPDF(res, weatherRecords);
      case 'markdown':
        return exportMarkdown(res, weatherRecords);
      default:
        return res.status(400).json({ error: 'Unsupported export format' });
    }
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: error.message });
  }
});

// JSON Export
function exportJSON(res, data) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="weather-data-${Date.now()}.json"`);
  res.json(data);
}

// CSV Export
function exportCSV(res, data) {
  try {
    const csvData = data.map(record => ({
      id: record._id,
      location: record.location.name,
      country: record.location.country,
      latitude: record.location.coordinates.lat,
      longitude: record.location.coordinates.lon,
      temperature: record.current.temperature,
      feels_like: record.current.feels_like,
      humidity: record.current.humidity,
      pressure: record.current.pressure,
      wind_speed: record.current.wind_speed,
      description: record.current.description,
      date_start: record.dateRange.start,
      date_end: record.dateRange.end,
      requested_by: record.requestedBy,
      created_at: record.createdAt
    }));

    const parser = new Parser();
    const csv = parser.parse(csvData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="weather-data-${Date.now()}.csv"`);
    res.send(csv);
  } catch (error) {
    console.error('CSV Export Error:', error);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
}

// XML Export
async function exportXML(res, data) {
  try {
    const builder = new xml2js.Builder({ rootName: 'WeatherData' });
    const xml = builder.buildObject({ WeatherRecord: data });

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Content-Disposition', `attachment; filename="weather-data-${Date.now()}.xml"`);
    res.send(xml);
  } catch (error) {
    console.error('XML Export Error:', error);
    res.status(500).json({ error: 'Failed to export XML' });
  }
}

// PDF Export
async function exportPDF(res, data) {
  try {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let page = pdfDoc.addPage([595, 842]); // A4 size
    let yPosition = 800;

    // Title
    page.drawText('Weather Data Export', {
      x: 50,
      y: yPosition,
      size: 20,
      font: boldFont,
      color: rgb(0, 0, 0)
    });

    yPosition -= 30;
    page.drawText(`Generated on: ${new Date().toLocaleString()}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: font,
      color: rgb(0.5, 0.5, 0.5)
    });

    yPosition -= 40;

    // Weather records
    for (const record of data) {
      // Check if we need a new page
      if (yPosition < 100) {
        page = pdfDoc.addPage([595, 842]);
        yPosition = 800;
      }

      // Location
      page.drawText(`Location: ${record.location.name}, ${record.location.country}`, {
        x: 50,
        y: yPosition,
        size: 14,
        font: boldFont
      });

      yPosition -= 20;

      // Weather details
      const details = [
        `Temperature: ${record.current.temperature}°C (feels like ${record.current.feels_like}°C)`,
        `Humidity: ${record.current.humidity}%`,
        `Pressure: ${record.current.pressure} hPa`,
        `Wind Speed: ${record.current.wind_speed} m/s`,
        `Description: ${record.current.description}`,
        `Date Range: ${new Date(record.dateRange.start).toLocaleDateString()} - ${new Date(record.dateRange.end).toLocaleDateString()}`,
        `Requested By: ${record.requestedBy}`
      ];

      for (const detail of details) {
        page.drawText(detail, {
          x: 70,
          y: yPosition,
          size: 10,
          font: font
        });
        yPosition -= 15;
      }

      yPosition -= 20; // Space between records
    }

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="weather-data-${Date.now()}.pdf"`);
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('PDF Export Error:', error);
    res.status(500).json({ error: 'Failed to export PDF' });
  }
}

// Markdown Export
function exportMarkdown(res, data) {
  try {
    let markdown = '# Weather Data Export\n\n';
    markdown += `*Generated on: ${new Date().toLocaleString()}*\n\n`;

    for (const record of data) {
      markdown += `## ${record.location.name}, ${record.location.country}\n\n`;
      
      markdown += `**Current Weather:**\n`;
      markdown += `- Temperature: ${record.current.temperature}°C (feels like ${record.current.feels_like}°C)\n`;
      markdown += `- Humidity: ${record.current.humidity}%\n`;
      markdown += `- Pressure: ${record.current.pressure} hPa\n`;
      markdown += `- Wind Speed: ${record.current.wind_speed} m/s\n`;
      markdown += `- Description: ${record.current.description}\n\n`;
      
      markdown += `**Date Range:** ${new Date(record.dateRange.start).toLocaleDateString()} - ${new Date(record.dateRange.end).toLocaleDateString()}\n`;
      markdown += `**Requested By:** ${record.requestedBy}\n`;
      markdown += `**Coordinates:** ${record.location.coordinates.lat}, ${record.location.coordinates.lon}\n\n`;

      if (record.forecast && record.forecast.length > 0) {
        markdown += `**5-Day Forecast:**\n`;
        for (const day of record.forecast) {
          markdown += `- ${new Date(day.date).toLocaleDateString()}: ${day.temp_min}°C - ${day.temp_max}°C, ${day.description}\n`;
        }
        markdown += '\n';
      }

      markdown += '---\n\n';
    }

    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', `attachment; filename="weather-data-${Date.now()}.md"`);
    res.send(markdown);
  } catch (error) {
    console.error('Markdown Export Error:', error);
    res.status(500).json({ error: 'Failed to export Markdown' });
  }
}

// Get export statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await Weather.aggregate([
      {
        $group: {
          _id: null,
          totalRecords: { $sum: 1 },
          uniqueLocations: { $addToSet: '$location.name' },
          avgTemperature: { $avg: '$current.temperature' },
          minTemperature: { $min: '$current.temperature' },
          maxTemperature: { $max: '$current.temperature' }
        }
      },
      {
        $project: {
          _id: 0,
          totalRecords: 1,
          uniqueLocationsCount: { $size: '$uniqueLocations' },
          avgTemperature: { $round: ['$avgTemperature', 2] },
          minTemperature: 1,
          maxTemperature: 1
        }
      }
    ]);

    const locationStats = await Weather.aggregate([
      {
        $group: {
          _id: '$location.name',
          count: { $sum: 1 },
          avgTemp: { $avg: '$current.temperature' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      overall: stats[0] || { totalRecords: 0, uniqueLocationsCount: 0 },
      topLocations: locationStats
    });
  } catch (error) {
    console.error('Error getting export stats:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;