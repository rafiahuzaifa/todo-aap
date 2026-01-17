FROM node:20-alpine

WORKDIR /app

# Copy project files
COPY frontend/phase-2-web/package.json ./
COPY frontend/phase-2-web/package-lock.json ./

# Install dependencies
RUN npm ci

COPY frontend/phase-2-web .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Run application
CMD ["npm", "start"]
