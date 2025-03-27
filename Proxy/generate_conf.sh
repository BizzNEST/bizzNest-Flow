#!/bin/bash
cat <<EOF > nginx.conf
user  nginx;
worker_processes  auto;

http {
    server {
        listen 80;
        server_name localhost;
    
        location / {
            proxy_pass http://backend-development:3000;
        }
    }
}
EOF
