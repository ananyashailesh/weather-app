# Multi-stage build for React frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/ ./
RUN npm run build

# Backend production image
FROM node:18-alpine

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy backend source code
COPY backend/ ./

# Copy frontend build files
COPY --from=frontend-build /app/frontend/build ./public

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S weather -u 1001

# Change ownership of the app directory
RUN chown -R weather:nodejs /app
USER weather

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start the application
CMD ["npm", "start"]