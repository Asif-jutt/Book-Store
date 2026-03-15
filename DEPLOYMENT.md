# 📦 Bookstore - Quick Start & Deployment Guide

## Quick Start (Local Development)

### 1. Prerequisites

```bash
# Check Node version (need 18+)
node --version  # v18.x.x

# Install Docker & Docker Compose
# Download from: https://www.docker.com/products/docker-desktop
```

### 2. Setup Backend

```bash
cd Backend

# Install dependencies
npm install

# Copy .env template
cp .env.example .env

# Edit .env with your settings (minimum required):
# - MONGODB_URI
# - JWT_SECRET
# - STRIPE_SECRET_KEY (optional)
```

### 3. Start Database & Cache

```bash
# Option A: Using Docker (Recommended)
docker run -d -p 27017:27017 --name bookstore-mongo mongo:7.0-alpine
docker run -d -p 6379:6379 --name bookstore-redis redis:7-alpine

# Option B: Install locally
# MongoDB: https://docs.mongodb.com/manual/installation/
# Redis: https://redis.io/download
```

### 4. Run Backend

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

Backend runs at: http://localhost:5000
API Docs at: http://localhost:5000/api-docs

### 5. Setup Frontend

```bash
cd ../Front-end

npm install

npm run dev
```

Frontend runs at: http://localhost:5173

## Docker Compose (Full Stack)

### Easiest Way - One Command

```bash
# From project root
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop everything
docker-compose down

# Stop and remove volumes (clean reset)
docker-compose down -v
```

Services started:

- API: http://localhost:5000
- MongoDB: Port 27017
- Redis: Port 6379
- Nginx: http://localhost
- Swagger Docs: http://localhost:5000/api-docs

## Environment Variables

Copy `.env.example` to `.env`:

```env
# Critical (must change)
JWT_SECRET=your-unique-secret-key
JWT_REFRESH_SECRET=your-unique-refresh-secret
MONGODB_URI=mongodb://localhost:27017/bookstore

# Optional but recommended
STRIPE_SECRET_KEY=sk_test_xxxx
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Production Deployment

### Option 1: Docker on VPS/EC2

```bash
# Build image
docker build -f infra/docker/Dockerfile -t bookstore-api:v1.0.0 .

# Push to registry (Docker Hub, ECR, etc)
docker tag bookstore-api:v1.0.0 myregistry/bookstore-api:v1.0.0
docker push myregistry/bookstore-api:v1.0.0

# Run on server
docker pull myregistry/bookstore-api:v1.0.0
docker run -d \
  -p 5000:5000 \
  --name bookstore-api \
  --env-file .env-prod \
  -v /data/logs:/app/logs \
  myregistry/bookstore-api:v1.0.0
```

### Option 2: Docker Compose on Server

```bash
# Copy to server
rsync -av ./Backend user@server:/app/
rsync -av docker-compose.yml user@server:/app/

# SSH into server
ssh user@server

# Create production .env
cp .env.example .env
# Edit .env with production values

# Start services
docker-compose up -d

# Check health
curl http://localhost:5000/health
```

### Option 3: Kubernetes (EKS, GKE, AKS)

```bash
# Build image
docker build -f infra/docker/Dockerfile -t bookstore-api:v1.0.0 .

# Create k8s ConfigMap for environment
kubectl create configmap bookstore-config --from-file=.env

# Deploy with kubectl or Helm
kubectl apply -f k8s/deployment.yaml
```

### Option 4: Serverless (AWS Lambda/Vercel)

```bash
# The app supports serverless with environment variable VERCEL=true
# Already compatible with Vercel deployment
```

## SSL/HTTPS Setup

### Using Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Update Nginx config
nano ./infra/nginx/nginx.conf
# Uncomment SSL section and set:
# ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
# ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

# Reload Nginx
docker-compose exec nginx nginx -s reload
```

## Monitoring & Logging

### View Application Logs

```bash
# Docker Compose
docker-compose logs -f api

# Docker (standalone)
docker logs -f bookstore-api

# File logs (if persistent)
tail -f logs/all.log
tail -f logs/error.log
```

### Health Status Checks

```bash
# API is running
curl http://localhost:5000/health

# API is ready (DB & Redis connected)
curl http://localhost:5000/ready

# Swagger UI
curl http://localhost:5000/api-docs
```

## Database Management

### MongoDB

```bash
# Connect to MongoDB in Docker
docker exec -it bookstore-mongo mongosh

# Switch database
use bookstore

# List collections
show collections

# Sample query
db.books.find().limit(5)
```

### Redis

```bash
# Connect to Redis
docker exec -it bookstore-redis redis-cli

# Check cache
KEYS *
GET book:1
TTL book:1
```

## Performance Tuning

### Enable Caching

Verify `.env`:

```env
REDIS_HOST=redis
REDIS_PORT=6379
CACHE_TTL=3600  # 1 hour
```

### Database Indexes

Already implemented in models:

```javascript
// Books collection
db.books.createIndex({ title: "text", author: "text" });
db.books.createIndex({ category: 1 });
db.books.createIndex({ price: 1 });

// Orders collection
db.orders.createIndex({ user: 1 });
db.orders.createIndex({ createdAt: -1 });
```

## Troubleshooting

### Port Already in Use

```bash
# Find process on port
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

### MongoDB Connection Refused

```bash
# Check if MongoDB is running
docker ps | grep mongo

# Restart MongoDB
docker restart bookstore-mongo

# Check logs
docker logs bookstore-mongo
```

### Redis Connection Error

```bash
# Check Redis status
docker ps | grep redis

# Restart Redis
docker restart bookstore-redis

# Test connection
docker exec bookstore-redis redis-cli ping
```

### CORS Errors on Frontend

```bash
# Update .env:
FRONTEND_URL=http://yourdomain.com

# Check Nginx config
# Ensure proxy headers are passed correctly
```

## Backup & Recovery

### MongoDB Backup

```bash
# Backup
docker exec bookstore-mongo mongodump --out /backup

# Restore
docker exec bookstore-mongo mongorestore /backup
```

### Docker Volume Backup

```bash
# Backup MongoDB volume
docker run --rm -v bookstore_mongodb_data:/data -v /backup:/backup alpine tar czf /backup/mongodb.tar.gz -C /data .

# Restore
docker run --rm -v bookstore_mongodb_data:/data -v /backup:/backup alpine tar xzf /backup/mongodb.tar.gz -C /data
```

## Updating the Application

```bash
# Pull latest code
git pull origin main

# Install new dependencies
npm install

# Build new Docker image
docker-compose build --no-cache api

# Restart services
docker-compose down
docker-compose up -d

# Check health
curl http://localhost:5000/health
```

## Cost Optimization

1. **Use smaller instances for staging**
2. **Auto-scale based on load**
3. **Use managed databases (MongoDB Atlas, AWS RDS)**
4. **CDN for static files & PDFs**
5. **Spot instances for non-critical tasks**
6. **Monitor unused resources**

## Security Checklist

- [ ] Change all default passwords
- [ ] Enable HTTPS/SSL
- [ ] Set strong JWT secrets
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Setup firewall rules
- [ ] Enable logging & monitoring
- [ ] Regular security updates
- [ ] Backup critical data
- [ ] Monitor access logs

## Support

For issues:

1. Check logs: `docker-compose logs api`
2. Review error messages in `/logs` directory
3. Check Swagger docs for API usage
4. Enable debug logging: `LOG_LEVEL=debug`

## Next Steps

✅ Production checklist:

- [ ] Setup monitoring/alerting
- [ ] Configure backups
- [ ] Setup CDN
- [ ] Enable rate limiting
- [ ] Configure Stripe webhooks
- [ ] Setup email service
- [ ] Client-side testing
- [ ] Load testing
- [ ] Security audit
- [ ] Go live!
