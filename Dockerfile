# ==============================================================================
# Production Dockerfile for Anis Ahmed DevOps Portfolio
# Hardened, Unprivileged Alpine Nginx container (~25MB)
# ==============================================================================

FROM nginx:1.27-alpine-slim

# Remove default nginx html and configuration
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/*

# Copy hardened unprivileged nginx configuration (listens on 8080)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy all static assets into web root
COPY index.html styles.css app.js robots.txt sitemap.xml favicon.* og-image.png profile.* /usr/share/nginx/html/

# Hardening: Configure unprivileged permissions for nginx user (UID 101)
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx

# Run as non-root unprivileged user
USER nginx

# Container listens on unprivileged port 8080
EXPOSE 8080

# Production Health Check
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
