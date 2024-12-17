# Build stage
FROM node:20.17.0 AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build Angular application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built static files from build stage to nginx html directory
COPY --from=build /app/dist/carrito-duoc-uc/browser /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Configure nginx to run in the foreground
CMD ["nginx", "-g", "daemon off;"]