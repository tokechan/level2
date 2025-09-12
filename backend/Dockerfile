# Backend Dockerfile for development and production
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install --only=production && npm cache clean --force

# Development dependencies
FROM base AS dev-deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# Build stage
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client for Docker environment
RUN npx prisma generate

# Generate types from OpenAPI
RUN npm run generate:all

# Build TypeScript
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nodejs:nodejs /app/openapi.yaml ./

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]
