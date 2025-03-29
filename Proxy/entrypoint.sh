#!/bin/bash
set -e  # Exit on error

# Phase 1: Generate initial Nginx config without SSL
cat <<EOF > nginx.conf
user  nginx;
worker_processes  auto;

events { worker_connections 1024; }

http {
    server_tokens off;
    include /etc/nginx/mime.types;

    # HTTP server block for Certbot challenges
    server {
        listen 80;
        server_name $1 www.$1;

        location /.well-known/acme-challenge/ {
            root /var/www/html;
        }

        location / {
            return 301 https://\$host\$request_uri;
        }
    }

    # Your other server blocks (e.g., health check)
    server {
        listen 5555;
        server_name localhost;
        location /health { return 200 'OK'; }
    }
}
EOF

# Start Nginx temporarily
echo "Starting Nginx for Certbot..."
nginx -c /nginx.conf

# Phase 2: Obtain SSL certificates using Certbot's Nginx plugin
echo "Obtaining SSL certificate..."
certbot --nginx --non-interactive --agree-tos -d $DOMAIN_NAME

# Certbot will automatically:
# 1. Modify your Nginx config to include SSL settings
# 2. Reload Nginx

# Phase 3: Update proxy settings (if needed)
# Certbot adds a new SSL server block. Add your proxy configuration there:
sed -i '/ssl_certificate_key/a \    location / {\n        proxy_pass http://backend-'"$2"':3000;\n        include proxy_params;\n    }' /etc/nginx/sites-enabled/default

# Reload Nginx to apply proxy settings
nginx -s reload
