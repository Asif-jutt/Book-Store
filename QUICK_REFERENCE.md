# 🚀 Quick Reference Guide

## 1. Getting Started

### Local Development Setup

```bash
# From Backend folder
npm install                    # Install dependencies

# Copy environment
cp .env.example .env           # Create .env file
# Edit .env with your values

# Start MongoDB locally (or use Docker)
mongod                         # Start MongoDB

# Start Redis locally (or use Docker)
redis-server                   # Start Redis

# Run development server
npm run dev                    # Starts with nodemon
```

### Docker Setup (Recommended)

```bash
# From project root
docker-compose up -d           # Start all services

# Check status
docker-compose ps              # View running services

# View logs
docker-compose logs -f api     # Follow API logs
docker-compose logs -f mongodb # Follow MongoDB logs

# Stop everything
docker-compose down            # Stop all services
```

---

## 2. Health Checks

```bash
# API is running
curl http://localhost:5000/health

# API is ready to accept requests
curl http://localhost:5000/ready

# Check services in docker
docker-compose ps              # All healthy?
```

---

## 3. API Documentation

```
Interactive API Docs: http://localhost:5000/api-docs
OpenAPI JSON: http://localhost:5000/api-docs.json
```

---

## 4. Database Access

```bash
# MongoDB
docker-compose exec mongodb mongosh
db.books.find()

# Redis CLI
docker-compose exec redis redis-cli
ping
keys *
```

---

## 5. Common Endpoints

### Books

```
GET    /api/books                  # List all books (paginated)
GET    /api/books?q=nodejs         # Search books
GET    /api/books?category=tech    # Filter by category
GET    /api/books/popular          # Get popular books
GET    /api/books/:id              # Get single book
POST   /api/books                  # Create book (admin)
PATCH  /api/books/:id              # Update book (admin)
DELETE /api/books/:id              # Delete book (admin)
```

### Reviews

```
GET    /api/reviews/book/:bookId   # Get reviews for book
POST   /api/reviews/book/:bookId   # Add/update review (auth)
GET    /api/reviews/user/mine/:bookId # Get your review
PATCH  /api/reviews/:id/helpful    # Mark helpful (auth)
DELETE /api/reviews/:id            # Delete review (auth)
```

### Cart

```
GET    /api/cart                   # Get your cart
POST   /api/cart                   # Add to cart (auth)
PATCH  /api/cart/:bookId           # Update quantity (auth)
DELETE /api/cart/:bookId           # Remove from cart (auth)
DELETE /api/cart                   # Clear cart (auth)
```

### Wishlist

```
GET    /api/wishlist               # Get your wishlist
POST   /api/wishlist               # Add to wishlist (auth)
DELETE /api/wishlist/:bookId       # Remove from wishlist (auth)
GET    /api/wishlist/:bookId       # Check if in wishlist
```

---

## 6. Environment Variables

### Required

```env
NODE_ENV=development              # development or production
PORT=5000

MONGODB_URI=mongodb://localhost:27017/bookstore
REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars
```

### Optional (with defaults)

```env
JWT_EXPIRY=15m                    # Access token expiry
REFRESH_TOKEN_EXPIRY=7d           # Refresh token expiry
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

### Stripe

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Email (Nodemailer)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@bookstore.com
```

---

## 7. Testing

```bash
# Run tests
npm test                      # Run all tests once

# Watch mode
npm run test:watch            # Re-run on file change

# Coverage report
npm run test:coverage         # Generate coverage report
```

---

## 8. Production Deployment

### Docker Build & Deploy

```bash
# Build image
docker build -t bookstore-api:latest -f infra/docker/Dockerfile .

# Tag for registry
docker tag bookstore-api:latest your-registry/bookstore-api:latest

# Push to registry
docker push your-registry/bookstore-api:latest

# Deploy
docker run -d \
  -e MONGODB_URI="..." \
  -e REDIS_HOST="..." \
  -p 5000:5000 \
  your-registry/bookstore-api:latest
```

### Environment for Production

```bash
# Copy production env
cp .env.example .env.production
# Edit with production values (real DBs, real Stripe keys, etc.)
```

---

## 9. Monitoring & Logs

```bash
# View application logs
tail -f Backend/logs/all.log
tail -f Backend/logs/error.log
tail -f Backend/logs/exceptions.log

# Docker logs
docker-compose logs api
docker-compose logs -f --tail=50 api  # Last 50 lines
```

---

## 10. Database Backup

```bash
# Backup MongoDB
docker-compose exec mongodb mongodump --out /data/backup

# Backup Redis
docker-compose exec redis redis-cli BGSAVE

# View backups
docker-compose exec mongodb ls -la /data/backup
```

---

## 11. Performance Tips

```bash
# Clear Redis cache
docker-compose exec redis redis-cli FLUSHALL

# Check database indexes
docker-compose exec mongodb mongosh
db.books.getIndexes()

# Monitor database performance
db.setProfilingLevel(1)
db.system.profile.find().pretty()
```

---

## 12. Common Issues

### Port Already in Use

```bash
# Find process on port 5000
lsof -i :5000
# Kill it
kill -9 <PID>
```

### MongoDB Connection Failed

```bash
# Verify MongoDB is running
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

### Redis Connection Failed

```bash
# Verify Redis is running
docker-compose exec redis ping
```

### JWT Token Invalid

```bash
# Generate new JWT secret (min 32 chars)
openssl rand -base64 32
# Update in .env
```

---

## 13. Git & Deployment

```bash
# Commit changes
git add .
git commit -m "feature: add feature"
git push origin develop

# Deploy to staging
# (Automatic via GitHub Actions when pushing to develop)

# Deploy to production
git checkout main
git merge develop
git push origin main
# (Automatic via GitHub Actions)
```

---

## 14. File Structure Quick Map

```
Backend/
├── src/
│   ├── config/          → Database, cache, logger setup
│   ├── domain/          → Business models (entities)
│   ├── usecases/        → Application business logic
│   ├── adapters/        → Controllers, repos, services
│   ├── middlewares/     → Auth, validation, logging
│   ├── utils/           → Helpers, errors, JWT
│   ├── routes/          → API endpoints
│   └── app.js           → Express setup
├── logs/                → Application logs
├── uploads/             → User uploads (PDFs, covers)
└── index.js             → Entry point

infra/
├── docker/Dockerfile    → Docker image
└── nginx/nginx.conf     → Reverse proxy config

.github/workflows/
└── ci-cd.yml            → GitHub Actions pipeline
```

---

## 15. Admin Commands

### Create Admin User

```bash
npm run seedAdmin
```

### Seed Sample Books

```bash
npm run seedBooks
```

### Seed 100 Books

```bash
npm run seed100Books
```

---

## 🎯 Command Cheatsheet

| Task             | Command                                        |
| ---------------- | ---------------------------------------------- |
| Start dev        | `npm run dev`                                  |
| Start docker     | `docker-compose up -d`                         |
| Stop docker      | `docker-compose down`                          |
| View logs        | `docker-compose logs -f api`                   |
| Check health     | `curl http://localhost:5000/health`            |
| API docs         | Open `http://localhost:5000/api-docs`          |
| Database console | `docker-compose exec mongodb mongosh`          |
| Clear cache      | `docker-compose exec redis redis-cli FLUSHALL` |
| Run tests        | `npm test`                                     |
| Deploy           | `git push origin main`                         |

---

## 📞 Resources

- **Architecture**: See `ARCHITECTURE.md`
- **Deployment**: See `DEPLOYMENT.md`
- **Implementation**: See `IMPLEMENTATION_SUMMARY.md`
- **Environment**: See `.env.example`
- **API Docs**: http://localhost:5000/api-docs

---

**Last Updated:** 2026-03-14  
**Status:** Production Ready ✅
