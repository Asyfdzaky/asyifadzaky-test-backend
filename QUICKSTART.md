# 🚀 Quick Start Guide

## Local Development

```bash
# 1. Clone & Install
git clone <repo-url>
cd asyifadzaky-test-backend
npm install

# 2. Setup Database (Supabase)
# - Buat project di supabase.com
# - Copy connection string

# 3. Configure Environment
cp .env.example .env
# Edit .env dengan DATABASE_URL dari Supabase

# 4. Setup Database
npx prisma generate
npx prisma migrate deploy
npx prisma db seed

# 5. Run Development
npm run start:dev
```

Server: `http://localhost:3000`

## Deploy to Render

```bash
# 1. Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Deploy di Render
# - Buka render.com
# - New Web Service
# - Connect GitHub repo
# - Build: npm install && npx prisma generate && npm run build
# - Start: npx prisma migrate deploy && npm run start:prod

# 3. Set Environment Variables
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
NODE_ENV=production
```

## Test API

```bash
# Login
curl -X POST https://your-app.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mail.com","password":"admin123"}'

# Response
{
  "accessToken": "eyJhbGci..."
}
```

## Default Admin

- Email: `admin@mail.com`
- Password: `admin123`

## Dokumentasi Lengkap

Lihat [README.md](README.md) untuk dokumentasi lengkap semua endpoint.
