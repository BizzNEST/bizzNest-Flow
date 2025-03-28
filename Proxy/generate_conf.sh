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
            stub_status on;         # Enable status endpoint
            access_log off;         # Disable logging for this endpoint
            allow 127.0.0.1;        # Only allow localhost access
            deny all;               # Deny all other connections
        }
    }
}
}
EOF
