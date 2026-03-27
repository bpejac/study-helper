# Build stage
FROM node:25-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy prisma schema and source code
COPY prisma ./prisma
COPY src ./src
COPY next.config.ts tsconfig.json prisma.config.ts postcss.config.mjs ./
COPY public ./public

# Generate Prisma client
RUN npx prisma generate

# Create data directory for SQLite database during build
RUN mkdir -p /app/data

# Set DATABASE_URL for build stage and initialize database
ENV DATABASE_URL="file:/app/data/prisma.db"
RUN DATABASE_URL="file:/app/data/prisma.db" npx prisma migrate deploy

# Build Next.js app
RUN npm run build

# Production stage
FROM node:24-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

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
