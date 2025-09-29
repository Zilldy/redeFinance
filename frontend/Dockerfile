# Build stage
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*
# Copy built Angular app
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
# Rename index.csr.html to index.html
RUN if [ -f /usr/share/nginx/html/index.csr.html ]; then \
      mv /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html; \
    fi
# Set proper permissions
RUN chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html
# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]