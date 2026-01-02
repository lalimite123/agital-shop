# Stage 1: Builder
FROM node:20-slim AS builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copy dependency files (pnpm)
COPY package.json pnpm-lock.yaml ./

# Install dependencies with pnpm
RUN corepack enable && pnpm install --frozen-lockfile

# Copy prisma schema
COPY prisma ./prisma/

RUN pnpm exec prisma generate

# Copy source code
COPY . .

# Build application
RUN pnpm run build

# Prune dev dependencies for production runtime
RUN pnpm prune --prod

# Stage 2: Production
FROM node:20-slim AS runner

WORKDIR /app

# Install OpenSSL
RUN apt-get update && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Set environment
ENV NODE_ENV=production
ENV PORT=4000

# Copy files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma/
COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/node_modules ./node_modules/

# Expose port
EXPOSE 4000

# Start application
CMD ["node", "dist/main.js"]