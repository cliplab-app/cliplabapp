# SSL Configuration Guide for ClipLab

## Overview
SSL certificates enable HTTPS for your ClipLab marketplace, providing security and trust for your users. The implementation depends on your hosting platform.

## Common Hosting Platforms & SSL Setup

### 1. Vercel (Recommended for React Apps)
```bash
# Deploy to Vercel
npm install -g vercel
vercel

# SSL is automatic with custom domains
vercel domains add yourdomain.com
# Follow prompts to configure DNS
```

**Benefits:**
- Automatic SSL certificates
- Global CDN
- Zero configuration
- Supports custom domains

### 2. Netlify
```bash
# Deploy to Netlify
npm run build
# Upload build folder to Netlify

# For custom domains:
# 1. Go to Site Settings > Domain Management
# 2. Add custom domain
# 3. SSL is automatic
```

**Benefits:**
- Free SSL certificates
- Automatic renewal
- One-click deployment

### 3. Cloudflare Pages
```bash
# Connect GitHub repo to Cloudflare Pages
# Build command: npm run build
# Build output: dist/ (or build/)

# SSL is automatic
# Additional security features available
```

**Benefits:**
- Free SSL + security features
- DDoS protection
- Global CDN

### 4. AWS S3 + CloudFront
```bash
# Build your app
npm run build

# Upload to S3 bucket
aws s3 sync build/ s3://your-bucket-name

# Configure CloudFront distribution
# SSL certificate via AWS Certificate Manager
```

**Configuration:**
1. Create S3 bucket for static hosting
2. Set up CloudFront distribution
3. Request SSL certificate in ACM
4. Configure Route 53 for DNS

### 5. Traditional VPS/Server (nginx)
```nginx
# /etc/nginx/sites-available/cliplab
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    root /var/www/cliplab/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

**Setup with Let's Encrypt:**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (add to crontab)
0 12 * * * /usr/bin/certbot renew --quiet
```

## DNS Configuration

### For Custom Domain
```bash
# Point your domain to hosting platform
# Example DNS records:

# For Vercel/Netlify:
A record: @ -> IP provided by platform
CNAME record: www -> platform-url

# For Cloudflare:
A record: @ -> IP (proxy enabled)
CNAME record: www -> @ (proxy enabled)
```

## Security Headers (Optional)
Add to your hosting platform or server:

```javascript
// For platforms supporting _headers file
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com;
```

## Recommended Approach

### For ClipLab Marketplace:
1. **Vercel** (Easiest): Zero-config SSL, perfect for React apps
2. **Cloudflare Pages**: Free SSL + security features
3. **Netlify**: Simple deployment with automatic SSL

### Quick Setup with Vercel:
```bash
# 1. Build your app
npm run build

# 2. Deploy to Vercel
npx vercel

# 3. Add custom domain (if needed)
npx vercel domains add cliplab.com

# 4. Configure DNS as instructed by Vercel
# SSL is automatically provisioned
```

## Testing SSL
```bash
# Check SSL configuration
curl -I https://yourdomain.com

# Test SSL rating
# Visit: https://www.ssllabs.com/ssltest/
```

## Cost Considerations
- **Free Options**: Let's Encrypt, Cloudflare, Vercel, Netlify
- **Paid Options**: Commercial SSL certificates ($10-100/year)
- **Enterprise**: Extended Validation certificates ($200-1000/year)

For ClipLab, free SSL from hosting platforms is sufficient and recommended.