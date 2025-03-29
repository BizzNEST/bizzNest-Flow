# Use the official Nginx image as a base
FROM nginx:latest

# Install Certbot and necessary dependencies
RUN apt-get update && apt-get install -y certbot python3-certbot-nginx && rm -rf /var/lib/apt/lists/*

# Arguments for creating custom Nginx configuration on build.
ARG DOMAIN_NAME
ARG ENVIRONMENT_TYPE
ENV ENVIRONMENT_TYPE=$ENVIRONMENT_TYPE
ENV DOMAIN_NAME=$DOMAIN_NAME
RUN echo "Building A NGINX server for $DOMAIN_NAME, Configured as a $ENVIRONMENT_TYPE type ENVIRONMENT"
# Expose ports for HTTP and HTTPS
EXPOSE 80 443

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Command to start Nginx and handle SSL certificate generation
CMD ["/entrypoint.sh"]









