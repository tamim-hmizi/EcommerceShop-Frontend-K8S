# Stage 1: Build React App
FROM node:22.14-alpine AS build
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve static build with a lightweight web server
FROM node:22.14-alpine
WORKDIR /app

# Install a simple static server
RUN npm install -g serve

# Copy build from previous stage
COPY --from=build /app/dist ./build

# Expose port used by 'serve'
EXPOSE 3000

# Start frontend server
CMD ["serve", "-s", "build", "-l", "3000"]
