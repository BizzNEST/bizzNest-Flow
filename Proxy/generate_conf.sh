#!/bin/bash
cat <<EOF > nginx.conf
user  nginx;
worker_processes  auto;
events {
    worker_connections  1024;
    }
http {
    server {
        listen 80;
    
        location / {
            proxy_pass http://backend-development:3000;
        }
    }
}
EOF
