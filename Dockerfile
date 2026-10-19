# ==============================================================================
# DrawFreely - Production Dockerfile
# Ultra-lightweight Nginx container for serving static whiteboard assets
# ==============================================================================
FROM nginx:alpine-slim

LABEL maintainer="DrawFreely Team"
LABEL description="DrawFreely - Free & Open Source Local-First Virtual Whiteboard"

# Remove default nginx configuration
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy custom optimized Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static frontend assets
COPY dist /usr/share/nginx/html

# Expose standard HTTP port
EXPOSE 80

# Health check using the /healthz endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:80/healthz || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
