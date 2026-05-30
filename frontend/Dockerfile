FROM node:18-bullseye AS builder
WORKDIR /app

# Enable corepack and prepare pnpm for reproducible installs
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy lock and manifest first to leverage docker cache
COPY package.json pnpm-lock.yaml ./

# Copy rest of the frontend sources
COPY . .

# Build-time argument to point the frontend to the backend service inside docker
ARG VITE_API_URL=http://backend:8080
ENV VITE_API_URL=${VITE_API_URL}

# Install dependencies and build
RUN pnpm install --frozen-lockfile
RUN pnpm build

FROM nginx:stable-alpine

# Copy built static files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace default nginx config with SPA-friendly fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
