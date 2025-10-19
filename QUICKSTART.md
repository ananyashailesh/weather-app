# 🚀 Quick Start Guide

Get the Weather App running in 5 minutes!

## Prerequisites
- Node.js v16+ installed
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))

## Step 1: Clone & Setup
```bash
git clone https://github.com/ananyashailesh/weather-app.git
cd weather-app
./setup.sh  # Run the automated setup script
```

## Step 2: Get API Key
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for free account
3. Get your API key
4. Add it to `backend/.env`:
```env
OPENWEATHER_API_KEY=your_api_key_here
```

## Step 3: Start MongoDB
Choose one option:

### Option A: Local MongoDB
```bash
# Install MongoDB (macOS)
brew install mongodb/brew/mongodb-community
brew services start mongodb/brew/mongodb-community
```

### Option B: MongoDB Atlas (Cloud)
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create cluster
3. Get connection string
4. Update `MONGODB_URI` in `backend/.env`

## Step 4: Run the App
```bash
npm run dev
```

**Frontend:** http://localhost:3000  
**Backend:** http://localhost:5000

## 🎯 Features to Try

1. **Search Weather**: Enter "New York" or "10001" 
2. **Current Location**: Click the location button
3. **Save Data**: Use "Save to DB" button
4. **View History**: Click "View History" button
5. **Export Data**: Try different export formats
6. **CRUD Operations**: Edit and delete records

## 📱 Pink Theme Highlights

- Beautiful pink gradients throughout
- Weather icons with pink accents
- Responsive design that works on mobile
- Material-UI components themed in pink

## 🛠️ Troubleshooting

**Can't connect to database?**
- Make sure MongoDB is running
- Check connection string in `.env`

**API errors?**
- Verify OpenWeatherMap API key
- Check internet connection

**Frontend won't start?**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and run `npm install`

## 📖 Full Documentation

See [README.md](README.md) for complete setup instructions and features.

---

Built with ❤️ by Ananya Shailesh for PM Accelerator