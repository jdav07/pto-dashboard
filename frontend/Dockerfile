# ---- Stage 1: Build ----
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies and build
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_BASE_URL
RUN npm run build  # Outputs to /app/dist

# ---- Stage 2: Production ----
FROM node:20-alpine AS production

WORKDIR /app

# Install a minimal static server globally
RUN npm install -g serve

# Copy only the build output from the first stage
COPY --from=build /app/dist ./dist

# Listen on port 8080 in Railway
EXPOSE 8080
ENV PORT=8080

# Serve the dist folder
CMD ["serve", "-s", "dist", "-l", "8080"]
