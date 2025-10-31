# Step 1: Build the React app
FROM node:24-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the React app
CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0" ] 