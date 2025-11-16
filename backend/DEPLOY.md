# Backend Deployment Guide

## Quick Deploy Options

### 1. Railway (Recommended - Easiest)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up

# Set environment variable
railway variables set E2B_API_KEY=your_key_here
```
Your backend will be live at: `https://your-app.up.railway.app`

### 2. Render
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Set:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Add Environment Variable: `E2B_API_KEY=your_key`

### 3. Heroku
```bash
# Install Heroku CLI
npm i -g heroku

# Deploy
heroku create aindrocode-backend
git subtree push --prefix backend heroku main

# Set environment
heroku config:set E2B_API_KEY=your_key
```

### 4. VPS (DigitalOcean, AWS, Linode)
```bash
# SSH into your server
ssh root@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Clone and setup
git clone your-repo
cd backend
npm install

# Create .env file
nano .env
# Add: E2B_API_KEY=your_key

# Start with PM2
pm2 start server.js --name aindrocode
pm2 save
pm2 startup

# Setup Nginx reverse proxy (optional)
sudo apt install nginx
sudo nano /etc/nginx/sites-available/aindrocode
```

Nginx config:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## After Deployment

Update your frontend `.env`:
```bash
VITE_BACKEND_URL=https://your-backend-url.com
```

## Get e2b API Key

1. Go to https://e2b.dev
2. Sign up and create an account
3. Go to Settings → API Keys
4. Copy your API key
5. Add to backend environment variables

## Test Your Backend

```bash
# Health check
curl https://your-backend-url.com/health

# Test code execution
curl -X POST https://your-backend-url.com/api/execute/run \
  -H "Content-Type: application/json" \
  -d '{"code": "console.log(\"Hello\")", "language": "javascript"}'
```

## Monitoring

Use Railway/Render dashboard or PM2:
```bash
pm2 logs aindrocode
pm2 monit
```
