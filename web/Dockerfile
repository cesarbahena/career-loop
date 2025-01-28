# Stage 1: Install dependencies
FROM node:20-slim AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Stage 2: Build the application
FROM base AS build
WORKDIR /app
COPY . .
RUN npm run build

# Stage 3: Production server
FROM node:20-slim AS production

# Create app user
RUN groupadd -r appuser && useradd -r -g appuser -u 1001 appuser

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Copy built application
COPY --from=build --chown=appuser:appuser /app/.output ./.output

# Switch to non-root user
USER appuser

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
