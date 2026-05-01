# ── Build stage ────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Install deps (cached layer)
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

# Build the Vite app
COPY frontend/ .
RUN npm run build

# ── Production stage (Nginx) ──────────────────────────────
FROM nginx:alpine

# Copy built SPA assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY infra/docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
