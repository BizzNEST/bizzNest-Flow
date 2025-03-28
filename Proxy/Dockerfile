# Use the official Nginx image as a base
FROM nginx:latest

# Install Certbot and necessary dependencies
RUN sudo snap install --classic certbot
RUN sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Arguments for creating custom Nginx configuration on build.
ARG DOMAIN_NAME
ARG ENVIRONMENT_TYPE
ENV ENVIRONMENT_TYPE=$ENVIRONMENT_TYPE
ENV DOMAIN_NAME=$DOMAIN_NAME
RUN echo "Building A NGINX server for $DOMAIN_NAME, Configured as a $ENVIRONMENT_TYPE type ENVIRONMENT"
COPY generate_conf.sh /generate_conf.sh
RUN echo "Creating the nginx configuration for $DOMAIN_NAME"
RUN bash /generate_conf.sh $DOMAIN_NAME $ENVIRONMENT_TYPE
RUN echo "Moving generated file to proper location"
RUN mv /nginx.conf /etc/nginx/nginx.conf

# Expose ports for HTTP and HTTPS
EXPOSE 80 443

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Command to start Nginx and handle SSL certificate generation
CMD ["/entrypoint.sh"]









