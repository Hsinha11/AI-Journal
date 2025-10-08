# --- Stage 1: Build the React App ---
FROM node:18-slim AS build

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Run the build script to generate static files
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:1.25-alpine

# Copy the built static files from the 'build' stage to Nginx's web root
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80