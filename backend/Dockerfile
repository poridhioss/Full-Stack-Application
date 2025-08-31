FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy source code
COPY . .

# Use non-root user
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
USER nodejs

# Expose app port
EXPOSE 5000

# Run the app
CMD ["npm", "start"]
