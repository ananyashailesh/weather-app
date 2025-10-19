#!/bin/bash
# Render build script for frontend

echo "Installing frontend dependencies..."
npm install

echo "Building React app..."
npm run build

echo "Frontend build complete!"
