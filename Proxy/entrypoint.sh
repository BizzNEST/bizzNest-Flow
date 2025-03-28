#!/bin/bash
DOMAIN=${DOMAIN_NAME}
EMAIL="buenrostroalan93@gmail.com"

certbot certonly --webroot-path=/var/www/html --email Bnaccounts@digitalnest.org --agree-tos --no-eff-email --staging -d ${DOMAIN_NAME} 

#mkdir 
#certbot certonly --nginx --non-interactive --agree-tos \
 # --email "$EMAIL" \
  #-d "$DOMAIN_NAME" \
  #-d "www.$DOMAIN_NAME" \
  #--cert-name "$DOMAIN_NAME" || {
  #echo "Certificate generation failed"
  #tail -n 50 /var/log/letsencrypt/letsencrypt.log
  #exit 1
#}

Keep the container running
tail -f /var/log/nginx/access.log
