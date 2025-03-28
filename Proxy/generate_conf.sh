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

    server {
        listen 127.0.0.1:5555;
        
        location /health {
            stub_status on;
            access_log off;
            allow 127.0.0.1;
            deny all;
        }
    }
}
EOF
