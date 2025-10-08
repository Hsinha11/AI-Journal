# --- Stage 1: Build Dependencies ---
# Use an official Node.js image as a base
FROM node:18-slim AS deps

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production


# --- Stage 2: Production Image ---
FROM node:18-slim AS release

WORKDIR /usr/src/app

# Copy the installed dependencies from the 'deps' stage
COPY --from=deps /usr/src/app/node_modules ./node_modules

# Copy the rest of your application code
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# The command to run your application
CMD ["node", "server.js"]