# Security Setup Guide

## Overview
The Material Tracker API server includes multiple layers of security to protect your data when running on your Unraid server or any public-facing environment.

## Security Features

### 1. API Key Authentication
All API endpoints (except `/health`) require a valid API key passed in the `x-api-key` header.

**Setup:**
1. Generate a secure random key:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. Add to `.env` (server):
   ```bash
   API_KEY=your-generated-key-here
   ```

3. Add to `.env.local` (mobile app):
   ```bash
   EXPO_PUBLIC_API_KEY=same-key-here
   ```

**Usage:**
```bash
curl -H "x-api-key: YOUR_KEY" http://your-server:3001/api/materials
```

### 2. CORS Protection
Control which domains can access your API.

**Configuration (.env):**
```bash
# Allow all origins (development only):
ALLOWED_ORIGINS=

# Production - specific domains only:
ALLOWED_ORIGINS=http://192.168.1.100:8081,https://yourdomain.com
```

### 3. Rate Limiting
Prevents abuse by limiting requests per IP address.

**Default Settings:**
- Window: 15 minutes (900,000 ms)
- Max Requests: 100 per window

**Configuration (.env):**
```bash
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. HTTP Security Headers (Helmet)
Automatically adds security headers to all responses:
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- And more...

## Quick Start

### Development (Local)
```bash
# 1. Copy environment template
cp .env.example .env

# 2. Generate API key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 3. Edit .env and add your key
# API_KEY=generated-key-here

# 4. Copy key to mobile app config
# Edit .env.local: EXPO_PUBLIC_API_KEY=same-key

# 5. Start server
npm run server
```

### Production (Unraid)
1. **Set strong API key** in `.env`
2. **Configure ALLOWED_ORIGINS** with your actual domain/IP
3. **Use Docker** (includes security best practices):
   ```bash
   docker-compose up -d
   ```
4. **Set firewall rules** on Unraid to restrict port 3001 access
5. **Use HTTPS** with a reverse proxy (Nginx Proxy Manager, Traefik)

## Testing Security

### Test Health Endpoint (Public)
```bash
curl http://localhost:3001/health
# Should return: {"status":"ok","timestamp":...}
```

### Test Without API Key (Should Fail)
```bash
curl http://localhost:3001/api/materials
# Should return: {"error":"Unauthorized: Invalid or missing API key"}
```

### Test With API Key (Should Succeed)
```bash
curl -H "x-api-key: YOUR_KEY" http://localhost:3001/api/materials
# Should return: []
```

## Best Practices

### ✅ DO:
- Use a strong, randomly generated API key
- Rotate API keys periodically
- Set specific ALLOWED_ORIGINS in production
- Use HTTPS in production (reverse proxy)
- Monitor server logs for suspicious activity
- Keep dependencies updated

### ❌ DON'T:
- Commit `.env` or `.env.local` to git (already in .gitignore)
- Share your API key publicly
- Use empty ALLOWED_ORIGINS in production
- Expose port 3001 directly to the internet without a reverse proxy

## Advanced: Reverse Proxy Setup

For production, use Nginx Proxy Manager or similar:

```nginx
server {
    listen 443 ssl;
    server_name materialtracker.yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Troubleshooting

### API Key Not Working
- Verify key matches in both `.env` and `.env.local`
- Check for extra spaces or quotes
- Ensure header name is exactly `x-api-key` (lowercase)

### CORS Errors
- Add your client domain to ALLOWED_ORIGINS
- For development, leave ALLOWED_ORIGINS empty
- Check browser console for specific CORS error

### Rate Limit Exceeded
- Wait 15 minutes or adjust limits in `.env`
- Check for loops or excessive polling in client code

## Security Checklist

- [ ] Strong API key generated and configured
- [ ] ALLOWED_ORIGINS set for production
- [ ] Rate limits appropriate for your use case
- [ ] Using HTTPS in production
- [ ] Firewall rules configured
- [ ] Regular security updates scheduled
- [ ] Logs monitored for abuse
- [ ] Backups configured

## Further Reading
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [Helmet.js Documentation](https://helmetjs.github.io/)
