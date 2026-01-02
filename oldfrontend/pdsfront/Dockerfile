# Multi-stage build for a dynamic Next.js app (Node runtime)
# 1) Build the app with Next.js standalone output
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copy source
COPY . .

# Build-time vars (public only used at build for embedding defaults)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_BASE_PATH
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_BASE_PATH=${NEXT_PUBLIC_BASE_PATH}

# Build Next.js (produces .next/standalone)
RUN npm run build

# 2) Runtime image using Node to serve the app
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Required at runtime for SSR to reach backend inside Docker network
# Can be overridden by docker-compose env
ENV PORT=3000
EXPOSE 3000

# Copy the standalone server and static assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Start Next.js standalone server
CMD ["node", "server.js"]
