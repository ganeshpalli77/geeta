FROM node:18-alpine AS builder
WORKDIR /app
# Ensure devDependencies (like vite) are installed during the build step
ENV NODE_ENV=development

# Install dependencies based on package-lock.json for reproducible installs
COPY package*.json ./
COPY package-lock.json ./
# Install including dev dependencies so build tools (vite, etc.) are available
RUN npm ci --silent --include=dev

# Rebuild esbuild to ensure the binary matches the installed version (avoids host vs container mismatch)
RUN npm rebuild esbuild --silent || true

# Copy source and build
COPY . .
RUN npm run build

FROM nginx:stable-alpine
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8125
CMD ["nginx", "-g", "daemon off;"]

