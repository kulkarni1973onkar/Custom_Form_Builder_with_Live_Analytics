FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build Next.js application
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
