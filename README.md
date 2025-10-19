# Weather App - PM Accelerator Technical Assessment

A full-stack weather application built by **Ananya Shailesh** for the Product Manager Accelerator technical assessment. This application demonstrates comprehensive weather data management with real-time API integration, CRUD operations, and advanced features.

![Weather App Preview](https://via.placeholder.com/800x400/e91e63/ffffff?text=Weather+App+Preview)

## 🌟 Features Completed

### Tech Assessment 1 ✅
- [x] Location-based weather search (City, ZIP code, Coordinates, Landmarks)
- [x] Real-time current weather display
- [x] 5-day weather forecast
- [x] Current location detection
- [x] Beautiful pink-themed UI with weather icons
- [x] Responsive design for all devices

### Tech Assessment 2 ✅
- [x] **CRUD Operations** with MongoDB database
  - [x] CREATE: Store weather data with location and date range
  - [x] READ: View all weather records with pagination and filtering
  - [x] UPDATE: Edit weather record information
  - [x] DELETE: Remove weather records
- [x] **Input Validation** for location and date ranges
- [x] **API Integration**
  - [x] OpenWeatherMap API for real-time weather data
  - [x] YouTube API integration (optional)
  - [x] Google Maps integration (optional)
- [x] **Data Export** in multiple formats
  - [x] JSON
  - [x] CSV
  - [x] XML
  - [x] PDF
  - [x] Markdown

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for component library
- **React Router** for navigation
- **Axios** for API calls
- **Pink theme** as requested

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **RESTful API** architecture
- **Input validation** with Joi
- **File exports** with multiple format support

### APIs Used
- **OpenWeatherMap API** - Real-time weather data
- **YouTube Data API v3** - Location-related videos (optional)
- **Google Maps Places API** - Location mapping (optional)

## 📋 Prerequisites

Before running this application, make sure you have:

1. **Node.js** (v16 or higher)
2. **MongoDB** (local installation or MongoDB Atlas)
3. **OpenWeatherMap API key** (free tier available)
4. **YouTube API key** (optional - for video integration)
5. **Google Maps API key** (optional - for maps integration)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ananyashailesh/weather-app.git
cd weather-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
# Weather API Configuration
OPENWEATHER_API_KEY=your_openweathermap_api_key_here

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/weather-app

# Server Configuration
PORT=5000
NODE_ENV=development

# Additional API Keys (optional)
YOUTUBE_API_KEY=your_youtube_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

### 4. Get API Keys

#### OpenWeatherMap API (Required)
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate an API key
4. Add it to your backend `.env` file

#### YouTube API (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable YouTube Data API v3
4. Create credentials (API key)
5. Add it to your backend `.env` file

#### Google Maps API (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Places API
3. Create credentials (API key)
4. Add it to your backend `.env` file

### 5. Database Setup

#### Option 1: Local MongoDB
```bash
# Install MongoDB locally
brew install mongodb/brew/mongodb-community  # macOS
# or follow installation guide for your OS

# Start MongoDB
brew services start mongodb/brew/mongodb-community
```

#### Option 2: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in backend `.env`

## 🚀 Running the Application

### 1. Start the Backend Server
```bash
cd backend
npm run dev  # Development mode with nodemon
# or
npm start   # Production mode
```

The backend server will start on `http://localhost:5000`

### 2. Start the Frontend Development Server
```bash
cd frontend
npm start
```

The frontend will start on `http://localhost:3000`

### 3. Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

## 📖 API Documentation

### Weather Endpoints

#### Create Weather Record
```
POST /api/weather
Content-Type: application/json

{
  "location": "New York",
  "startDate": "2024-01-15",
  "endDate": "2024-01-20",
  "requestedBy": "Ananya"
}
```

#### Get All Weather Records
```
GET /api/weather?page=1&limit=10&location=New York&requestedBy=Ananya
```

#### Get Single Weather Record
```
GET /api/weather/:id
```

#### Update Weather Record
```
PUT /api/weather/:id
Content-Type: application/json

{
  "requestedBy": "Updated Name"
}
```

#### Delete Weather Record
```
DELETE /api/weather/:id
```

#### Get Current Weather (Quick Search)
```
POST /api/weather/current
Content-Type: application/json

{
  "location": "40.7128,-74.0060"
}
```

### Data Export Endpoints

#### Export Weather Data
```
POST /api/data/export
Content-Type: application/json

{
  "format": "json|csv|xml|pdf|markdown",
  "filters": {
    "location": "New York",
    "startDate": "2024-01-01",
    "endDate": "2024-01-31",
    "requestedBy": "Ananya"
  }
}
```

#### Get Statistics
```
GET /api/data/stats
```

## 🎨 Features Showcase

### Dashboard Features
- **Location Search**: City names, ZIP codes, coordinates, landmarks
- **Current Location**: Automatic geolocation detection
- **Weather Display**: Temperature, humidity, pressure, wind, visibility
- **5-Day Forecast**: Detailed daily predictions
- **Additional Info**: YouTube videos and Google Maps integration

### CRUD Operations
- **Create**: Store weather data with validation
- **Read**: View records with pagination and filters
- **Update**: Edit weather record details
- **Delete**: Remove unwanted records

### Data Management
- **Input Validation**: Date range and location validation
- **Error Handling**: Comprehensive error messages
- **Export Options**: Multiple file formats
- **Statistics**: Data insights and analytics

## 🎭 Pink Theme Implementation

The application features a beautiful pink theme as requested:

- **Primary Colors**: Pink (#e91e63) and Pink Accent (#ff4081)
- **Gradients**: Smooth pink gradients throughout the UI
- **Components**: All Material-UI components themed in pink
- **Cards**: Pink gradient backgrounds with subtle shadows
- **Buttons**: Pink-themed with hover effects
- **Icons**: Pink-colored weather and navigation icons

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🔧 Deployment

### Local Deployment
Both frontend and backend are configured to run locally. Follow the installation steps above.

### Production Deployment

#### Backend Deployment (Heroku/Railway/DigitalOcean)
1. Set environment variables in your hosting platform
2. Update `MONGODB_URI` to production database
3. Deploy the backend folder

#### Frontend Deployment (Vercel/Netlify)
1. Update `REACT_APP_API_BASE_URL` to production backend URL
2. Build the frontend: `npm run build`
3. Deploy the build folder

### Environment Variables for Production
```env
# Backend
OPENWEATHER_API_KEY=your_key
MONGODB_URI=your_production_db_url
PORT=5000
NODE_ENV=production

# Frontend
REACT_APP_API_BASE_URL=https://your-backend-url.com/api
```

## 📱 Usage Guide

### Getting Weather Data
1. **Search by Location**: Enter city name, ZIP code, or coordinates
2. **Use Current Location**: Click the location button for auto-detection
3. **View Weather**: See current conditions and 5-day forecast
4. **Save to Database**: Click "Save to DB" to store the record

### Managing Records
1. **View History**: Navigate to the History page
2. **Filter Records**: Use location and name filters
3. **Edit Records**: Click the edit icon to modify records
4. **Delete Records**: Click the delete icon to remove records
5. **Export Data**: Use the export button for data downloads

### Additional Features
1. **YouTube Videos**: See related location videos (with API key)
2. **Google Maps**: View location on map (with API key)
3. **Statistics**: View data insights and trends
4. **Responsive Design**: Works on desktop, tablet, and mobile

## 🐛 Troubleshooting

### Common Issues

#### "Location not found" Error
- Check spelling of location name
- Try using ZIP code or coordinates
- Ensure internet connection

#### Database Connection Error
- Verify MongoDB is running
- Check database URL in .env file
- Ensure database permissions

#### API Key Issues
- Verify API key is correct
- Check API key has proper permissions
- Ensure API key is not expired

#### Frontend Won't Start
- Check Node.js version (v16+)
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall

## 🏆 Assessment Completion

### Tech Assessment 1 - Complete ✅
- [x] Weather app with location input
- [x] Current weather display
- [x] 5-day forecast
- [x] Current location detection
- [x] Weather icons and beautiful UI
- [x] Real-time API integration

### Tech Assessment 2 - Complete ✅
- [x] CRUD operations with database
- [x] Input validation and error handling
- [x] Additional API integrations
- [x] Data export functionality
- [x] Advanced features and optimization

### Bonus Features ✨
- [x] TypeScript implementation
- [x] Material-UI design system
- [x] Responsive pink theme
- [x] Comprehensive error handling
- [x] Statistics and analytics
- [x] Multiple export formats
- [x] Advanced filtering options

## 👤 About the Developer

**Ananya Shailesh**
- Full-stack developer passionate about creating user-friendly applications
- Experienced in React, Node.js, and modern web technologies
- Candidate for PM Accelerator program

### Contact
- **LinkedIn**: [Connect with Ananya](https://linkedin.com/in/ananyashailesh)
- **GitHub**: [View Portfolio](https://github.com/ananyashailesh)
- **Email**: ananya@example.com

## 📄 License

This project was created for the PM Accelerator Technical Assessment. All rights reserved.

---

**Built with ❤️ and lots of ☕ by Ananya Shailesh for PM Accelerator**