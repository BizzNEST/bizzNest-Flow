#!/bin/bash
DOMAIN="example.com"
EMAIL="admin@example.com"

sudo certbot certonly --nginx --non-interactive --agree-tos \
  --email "$EMAIL" \
  -d "$DOMAIN" \
  -d "www.$DOMAIN" \
  --cert-name "$DOMAIN" || {
  echo "Certificate generation failed"
  tail -n 50 /var/log/letsencrypt/letsencrypt.log
  exit 1
}

Keep the container running
tail -f /var/log/nginx/access.log
