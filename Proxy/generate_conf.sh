#!/bin/bash
cat <<EOF > nginx.conf
user  nginx;
worker_processes  auto;

server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://backend-development:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF
