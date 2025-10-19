#!/bin/bash

echo "🌤️  Weather App Setup Script"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

print_status "Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi

print_status "npm found: $(npm --version)"

# Install root dependencies
echo ""
echo "Installing root dependencies..."
npm install

# Install backend dependencies
echo ""
echo "Installing backend dependencies..."
cd backend
npm install

# Install frontend dependencies
echo ""
echo "Installing frontend dependencies..."
cd ../frontend
npm install
cd ..

print_status "All dependencies installed successfully!"

# Check for MongoDB
echo ""
echo "Checking for MongoDB..."
if command -v mongod &> /dev/null; then
    print_status "MongoDB found locally"
else
    print_warning "MongoDB not found locally. Please install MongoDB or use MongoDB Atlas."
    echo "  Local installation: https://docs.mongodb.com/manual/installation/"
    echo "  MongoDB Atlas: https://www.mongodb.com/atlas"
fi

# Check for environment files
echo ""
echo "Checking environment configuration..."

if [ -f "backend/.env" ]; then
    print_status "Backend .env file exists"
else
    print_warning "Backend .env file not found. Creating from template..."
    cp backend/.env.example backend/.env
    print_warning "Please update backend/.env with your API keys"
fi

if [ -f "frontend/.env" ]; then
    print_status "Frontend .env file exists"
else
    print_status "Frontend .env file created"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Get an OpenWeatherMap API key from: https://openweathermap.org/api"
echo "2. Add your API key to backend/.env file"
echo "3. Start MongoDB (if using local installation)"
echo "4. Run the application with: npm run dev"
echo ""
echo "For more detailed instructions, see README.md"