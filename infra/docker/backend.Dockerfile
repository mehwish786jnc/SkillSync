# ── Build stage ────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Install deps (cached layer)
COPY backend/package.json backend/package-lock.json* ./
RUN npm ci

# Copy prisma schema + config and generate client
COPY backend/prisma ./prisma
COPY backend/prisma.config.ts ./
RUN npx prisma generate

# Build TypeScript
COPY backend/tsconfig.json ./
COPY backend/src ./src
RUN npm run build

# ── Production stage ──────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

# Copy only production deps + built output
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules

# Copy Prisma client (generated in node_modules)
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma

# Copy built app + prisma schema (needed for migrations)
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./

EXPOSE 4000

# Run migrations then start server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
