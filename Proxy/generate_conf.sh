#!/bin/bash
cat <<EOF > nginx.conf
user  nginx;
worker_processes  auto;
pid /var/run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

EOF
