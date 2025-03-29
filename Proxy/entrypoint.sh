#!/bin/bash
# Ensure Nginx is started
set -e  # Exit immediately on error

echo -e "\033[1;34m[INFO] Testing Nginx configuration...\033[0m"
if ! nginx -t 2>&1 | tee /tmp/nginx-config-test.log; then
  echo -e "\033[1;31m[ERROR] Configuration test failed:\033[0m"
  cat /tmp/nginx-config-test.log
  exit 1
fi

# Start Nginx with enhanced logging
echo -e "\033[1;34m[INFO] Starting Nginx with verbose logging...\033[0m"
{
  nginx -g "daemon off; error_log /dev/stderr debug;" 2>&1 | 
    awk '{print "\033[1;33m[NGINX] " $0 "\033[0m"}'
} > >(tee -a /var/log/nginx/verbose.log) 2>&1 &

# Store PID and setup cleanup
NGINX_PID=$!
trap "echo -e '\033[1;34m[INFO] Stopping Nginx...\033[0m'; kill $NGINX_PID" EXIT

# Monitor process
echo -e "\033[1;32m[SUCCESS] Nginx started with PID $NGINX_PID\033[0m"
echo -e "\033[1;34m[INFO] Monitoring process...\033[0m"

# Watch logs in real-time (optional)
tail -f /var/log/nginx/verbose.log -n 20 | 
  awk '{print "\033[1;36m[LOG] " $0 "\033[0m"}' &

# Wait for process exit
wait $NGINX_PID

# Wait for Nginx to be fully up

# Obtain SSL certificate using Certbot

#echo "Obtaining SSL certificate for $DOMAIN_NAME."
#certbot certonly --webroot --non-interactive --agree-tos -d $DOMAIN_NAME --redirect || { echo "Certbot failed"; tail -n 50 /var/log/letsencrypt/letsencrypt.log; exit 1; }

# Set up automatic renewal (ensure cron is running or use another approach)
echo "0 12 * * * root certbot renew --quiet && nginx -s reload" >> /etc/crontab

# Keep the container running
tail -f /var/log/nginx/access.log
