# 1) Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Install pnpm and dependencies
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy source and build
COPY . .
RUN pnpm build

# 2) Serve stage
FROM nginx:alpine
# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*
# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]