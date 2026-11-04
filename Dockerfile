# ==============================================================================
# Production Multi-Stage Dockerfile for Anis Ahmed DevOps Portfolio
# Lightweight Alpine Nginx image (~28MB) hardened for zero-privilege execution
# ==============================================================================

FROM nginx:1.27-alpine-slim

# Remove default nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy static assets
COPY index.html /usr/share/nginx/html/index.html
COPY styles.css /usr/share/nginx/html/styles.css
COPY app.js /usr/share/nginx/html/app.js

# Hardening: Run as non-root unprivileged user
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx

USER nginx

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/index.html || exit 1

CMD ["nginx", "-g", "daemon off;"]
