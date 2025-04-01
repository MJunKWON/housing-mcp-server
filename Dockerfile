FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/index.js"]