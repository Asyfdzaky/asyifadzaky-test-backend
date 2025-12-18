# Render Deployment Configuration

## Build Command

```bash
npm install && npx prisma generate && npm run build
```

## Start Command

```bash
npx prisma migrate deploy && npm run start:prod
```

## Environment Variables

Tambahkan di Render Dashboard → Environment:

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
NODE_ENV=production
PORT=3000
```

## Auto-Deploy

Render akan otomatis deploy setiap kali ada push ke branch `main`.

## Health Check

Endpoint: `GET /`

## Logs

Akses logs di Render Dashboard → Logs tab
