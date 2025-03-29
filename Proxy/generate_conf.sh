#!/bin/bash
cat <<EOF > nginx.conf
user  nginx;
worker_processes  auto;
pid /var/run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 1024;
}

https {
    server_tokens off;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Gzip settings
    gzip on;
    gzip_disable "msie6";

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
    
    server {
        listen 5555;
        server_name localhost;
    
        location /health {
            add_header Content-Type text/plain;
            return 200 'OK';
        }
    }
    
    server {
        listen 443 ssl;
        server_name $1 www.$1;

        ssl_certificate /etc/letsencrypt/live/$1/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/$1/privkey.pem;
    }
}
EOF
