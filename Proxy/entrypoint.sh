#!/bin/bash
# Ensure Nginx is started
nginx &

# Wait for Nginx to be fully up

# Obtain SSL certificate using Certbot

echo "Obtaining SSL certificate for $DOMAIN_NAME."
certbot --webroot --non-interactive --agree-tos -d $DOMAIN_NAME --redirect || { echo "Certbot failed"; tail -n 50 /var/log/letsencrypt/letsencrypt.log; exit 1; }

# Set up automatic renewal (ensure cron is running or use another approach)
echo "0 12 * * * root certbot renew --quiet && nginx -s reload" >> /etc/crontab

# Keep the container running
tail -f /var/log/nginx/access.log
