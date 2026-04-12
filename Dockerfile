# syntax=docker/dockerfile:1.7

# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

# Copy prisma schema and source code
COPY prisma ./prisma
COPY src ./src
COPY next.config.ts tsconfig.json prisma.config.ts postcss.config.mjs ./
COPY public ./public

# Generate Prisma client
RUN npx prisma generate

# Create data directory for SQLite database during build
RUN mkdir -p /app/data

# Build Next.js app
RUN npm run build

# Production stage
FROM node:24-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev --no-audit --no-fund

# Copy prisma schema and config
COPY prisma ./prisma
COPY prisma.config.ts ./

# Copy built app from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copy generated Prisma client and CLI from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma/engines ./node_modules/@prisma/engines

# Create data directory for SQLite database
RUN mkdir -p /app/data

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV DATABASE_URL="file:/app/data/prisma.db"
ENV PORT=3000

# Run migrations and start the app
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
