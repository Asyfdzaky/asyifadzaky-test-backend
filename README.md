# Mlaku-Mlaku Backend API

Backend API untuk aplikasi manajemen perjalanan wisata yang dibangun dengan NestJS, Prisma ORM, dan PostgreSQL.

## 📋 Daftar Isi

- [Tech Stack](#-tech-stack)
- [Fitur](#-fitur)
- [Setup Lokal](#-setup-lokal)
- [Database Setup](#-database-setup-supabase)
- [Deployment ke Render](#-deployment-ke-render)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#-environment-variables)
- [Testing](#-testing)

## 🛠 Tech Stack

- **Framework:** NestJS 11
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma 7
- **Authentication:** JWT + Passport
- **Validation:** class-validator & class-transformer
- **Deployment:** Render.com

## ✨ Fitur

- 🔐 **Authentication & Authorization** - JWT-based dengan role-based access control
- 👥 **User Management** - CRUD untuk Admin, Employee, dan Tourist
- 💼 **Employee Management** - Kelola data karyawan
- 🏖️ **Tourist Management** - Kelola data wisatawan
- ✈️ **Trip Management** - Kelola perjalanan wisata
- 🔒 **Role-Based Access** - ADMIN, EMPLOYEE, TOURIST dengan permission berbeda

## 🚀 Setup Lokal

### 1. Clone Repository

```bash
git clone <repository-url>
cd asyifadzaky-test-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env` di root folder:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# JWT
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"

# Server
PORT=3000
NODE_ENV=development
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run Database Migration

```bash
npx prisma migrate deploy
```

### 6. Seed Database (Optional)

```bash
npx prisma db seed
```

Ini akan membuat admin user:

- Email: `admin@mail.com`
- Password: `admin123`

### 7. Run Development Server

```bash
npm run start:dev
```

Server akan berjalan di `http://localhost:3000`

## 🗄️ Database Setup (Supabase)

### 1. Buat Project di Supabase

1. Buka [supabase.com](https://supabase.com)
2. Sign up / Login
3. Klik **New Project**
4. Isi detail project:
   - Name: `mlaku-mlaku-db`
   - Database Password: (simpan password ini!)
   - Region: Southeast Asia (Singapore)
5. Klik **Create new project**

### 2. Dapatkan Connection String

1. Buka project → **Settings** → **Database**
2. Scroll ke **Connection string** → **URI**
3. Copy connection string:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
4. Ganti `[YOUR-PASSWORD]` dengan password database Anda

### 3. Setup Database

```bash
# Set DATABASE_URL
export DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"

# Run migration
npx prisma migrate deploy

# Seed database
npx prisma db seed
```

## 🌐 Deployment ke Render

### 1. Persiapan

Pastikan code sudah di-push ke GitHub:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy di Render

1. **Buka [render.com](https://render.com)** dan login
2. Klik **New +** → **Web Service**
3. Connect repository GitHub Anda
4. Konfigurasi:
   - **Name:** `mlaku-mlaku-api`
   - **Region:** Singapore
   - **Branch:** `main`
   - **Runtime:** Node
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npx prisma migrate deploy && npm run start:prod`
   - **Instance Type:** Free

5. **Environment Variables** - Tambahkan:

   ```
   DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
   NODE_ENV=production
   PORT=3000
   ```

6. Klik **Create Web Service**

### 3. Verifikasi Deployment

Setelah deploy selesai, test endpoint:

```bash
curl https://mlaku-mlaku-api.onrender.com/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mail.com","password":"admin123"}'
```

## 📡 API Endpoints

### Base URL

- **Local:** `http://localhost:3000`
- **Production:** `https://mlaku-mlaku-api.onrender.com`

---

### 🔐 Authentication

#### 1. Register (Tourist)

**Endpoint:** `POST /auth/register`

**Request Body:**

```json
{
  "email": "tourist@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+628123456789",
  "gender": "MALE",
  "age": 25,
  "address": "Jl. Sudirman No. 123, Jakarta"
}
```

**Response (201):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Gender Options:** `MALE`, `FEMALE`, `OTHER`

---

#### 2. Login (All Roles)

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "email": "admin@mail.com",
  "password": "admin123"
}
```

**Response (200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401):**

```json
{
  "message": "Invalid credentials",
  "error": "Unauthorized",
  "statusCode": 401
}
```

---

### 👥 Users Management (ADMIN Only)

**Headers Required:**

```
Authorization: Bearer {admin_token}
```

#### 1. Create Employee

**Endpoint:** `POST /users/employee`

**Request Body:**

```json
{
  "email": "employee@example.com",
  "password": "password123",
  "name": "Jane Smith",
  "position": "Travel Coordinator"
}
```

**Response (201):**

```json
{
  "message": "Employee account created successfully",
  "data": {
    "id": "uuid-here",
    "name": "Jane Smith",
    "email": "employee@example.com",
    "role": "EMPLOYEE"
  }
}
```

---

#### 2. Create Tourist (by Admin/Employee)

**Endpoint:** `POST /users/tourist`

**Headers:** `Authorization: Bearer {admin_or_employee_token}`

**Request Body:**

```json
{
  "email": "tourist2@example.com",
  "password": "password123",
  "fullName": "Alice Johnson",
  "phone": "+628987654321",
  "gender": "FEMALE",
  "age": 30,
  "address": "Jl. Gatot Subroto No. 456, Bali"
}
```

**Response (201):**

```json
{
  "message": "Tourist account created successfully",
  "data": {
    "email": "tourist2@example.com",
    "fullName": "Alice Johnson",
    "phone": "+628987654321",
    "gender": "FEMALE",
    "age": 30,
    "address": "Jl. Gatot Subroto No. 456, Bali"
  }
}
```

---

#### 3. Update User

**Endpoint:** `PUT /users/:id`

**Request Body:**

```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

**Response (200):**

```json
{
  "id": "uuid-here",
  "name": "Updated Name",
  "email": "updated@example.com",
  "role": "TOURIST",
  "createdAt": "2025-12-18T08:00:00.000Z",
  "updatedAt": "2025-12-18T09:00:00.000Z"
}
```

---

#### 4. Update User Credentials

**Endpoint:** `PUT /users/:id/credentials`

**Request Body:**

```json
{
  "email": "newemail@example.com",
  "password": "newpassword123"
}
```

**Response (200):**

```json
{
  "message": "Credentials updated successfully"
}
```

---

#### 5. Delete User

**Endpoint:** `DELETE /users/:id`

**Response (200):**

```json
{
  "message": "User deleted successfully"
}
```

---

### 💼 Employees (ADMIN Only)

**Headers Required:**

```
Authorization: Bearer {admin_token}
```

#### 1. Get All Employees

**Endpoint:** `GET /employees`

**Response (200):**

```json
[
  {
    "id": "employee-uuid",
    "userId": "user-uuid",
    "position": "Travel Coordinator",
    "user": {
      "id": "user-uuid",
      "name": "Jane Smith",
      "email": "employee@example.com",
      "role": "EMPLOYEE"
    },
    "createdAt": "2025-12-18T08:00:00.000Z",
    "updatedAt": "2025-12-18T08:00:00.000Z"
  }
]
```

---

#### 2. Get Employee by User ID

**Endpoint:** `GET /employees/:userId`

**Response (200):**

```json
{
  "id": "employee-uuid",
  "userId": "user-uuid",
  "position": "Travel Coordinator",
  "user": {
    "id": "user-uuid",
    "name": "Jane Smith",
    "email": "employee@example.com",
    "role": "EMPLOYEE"
  },
  "createdAt": "2025-12-18T08:00:00.000Z",
  "updatedAt": "2025-12-18T08:00:00.000Z"
}
```

---

#### 3. Update Employee

**Endpoint:** `PUT /employees/:userId`

**Request Body:**

```json
{
  "position": "Senior Travel Coordinator"
}
```

**Response (200):**

```json
{
  "id": "employee-uuid",
  "userId": "user-uuid",
  "position": "Senior Travel Coordinator",
  "updatedAt": "2025-12-18T09:00:00.000Z"
}
```

---

#### 4. Delete Employee

**Endpoint:** `DELETE /employees/:userId`

**Response (200):**

```json
{
  "message": "Employee deleted successfully"
}
```

---

### 🏖️ Tourists (EMPLOYEE Only)

**Headers Required:**

```
Authorization: Bearer {employee_token}
```

#### 1. Get All Tourists

**Endpoint:** `GET /tourists`

**Response (200):**

```json
[
  {
    "id": "tourist-uuid",
    "userId": "user-uuid",
    "phone": "+628123456789",
    "gender": "MALE",
    "age": 25,
    "address": "Jl. Sudirman No. 123, Jakarta",
    "user": {
      "id": "user-uuid",
      "name": "John Doe",
      "email": "tourist@example.com",
      "role": "TOURIST"
    },
    "createdAt": "2025-12-18T08:00:00.000Z",
    "updatedAt": "2025-12-18T08:00:00.000Z"
  }
]
```

---

#### 2. Get Tourist by User ID

**Endpoint:** `GET /tourists/:userId`

**Response (200):**

```json
{
  "id": "tourist-uuid",
  "userId": "user-uuid",
  "phone": "+628123456789",
  "gender": "MALE",
  "age": 25,
  "address": "Jl. Sudirman No. 123, Jakarta",
  "user": {
    "id": "user-uuid",
    "name": "John Doe",
    "email": "tourist@example.com",
    "role": "TOURIST"
  }
}
```

---

#### 3. Update Tourist

**Endpoint:** `PUT /tourists/:userId`

**Request Body:**

```json
{
  "phone": "+628111222333",
  "address": "Jl. Thamrin No. 789, Surabaya",
  "age": 26
}
```

**Response (200):**

```json
{
  "id": "tourist-uuid",
  "userId": "user-uuid",
  "phone": "+628111222333",
  "gender": "MALE",
  "age": 26,
  "address": "Jl. Thamrin No. 789, Surabaya",
  "updatedAt": "2025-12-18T09:00:00.000Z"
}
```

---

#### 4. Delete Tourist

**Endpoint:** `DELETE /tourists/:userId`

**Response (200):**

```json
{
  "message": "Tourist deleted successfully"
}
```

---

### ✈️ Trips

#### 1. Create Trip (EMPLOYEE Only)

**Endpoint:** `POST /trips`

**Headers:** `Authorization: Bearer {employee_token}`

**Request Body:**

```json
{
  "touristId": "tourist-uuid",
  "startDate": "2025-01-15T00:00:00.000Z",
  "endDate": "2025-01-20T00:00:00.000Z",
  "destination": {
    "country": "Indonesia",
    "city": "Bali",
    "hotel": "Grand Hyatt Bali",
    "activities": ["Beach", "Temple Tour", "Surfing"]
  }
}
```

**Response (201):**

```json
{
  "id": "trip-uuid",
  "touristId": "tourist-uuid",
  "startDate": "2025-01-15T00:00:00.000Z",
  "endDate": "2025-01-20T00:00:00.000Z",
  "destination": {
    "country": "Indonesia",
    "city": "Bali",
    "hotel": "Grand Hyatt Bali",
    "activities": ["Beach", "Temple Tour", "Surfing"]
  },
  "status": "PLANNED",
  "canceledAt": null,
  "createdAt": "2025-12-18T08:00:00.000Z",
  "updatedAt": "2025-12-18T08:00:00.000Z"
}
```

**Trip Status Options:** `PLANNED`, `ONGOING`, `COMPLETED`, `CANCELED`

---

#### 2. Get All Trips

**Endpoint:** `GET /trips`

**Headers:** `Authorization: Bearer {token}`

**Response for EMPLOYEE (200):**

```json
[
  {
    "id": "trip-uuid",
    "touristId": "tourist-uuid",
    "startDate": "2025-01-15T00:00:00.000Z",
    "endDate": "2025-01-20T00:00:00.000Z",
    "destination": {
      "country": "Indonesia",
      "city": "Bali",
      "hotel": "Grand Hyatt Bali",
      "activities": ["Beach", "Temple Tour", "Surfing"]
    },
    "status": "PLANNED",
    "canceledAt": null,
    "tourist": {
      "id": "tourist-uuid",
      "user": {
        "name": "John Doe",
        "email": "tourist@example.com"
      }
    },
    "createdAt": "2025-12-18T08:00:00.000Z",
    "updatedAt": "2025-12-18T08:00:00.000Z"
  }
]
```

**Response for TOURIST (200):**

```json
[
  {
    "id": "trip-uuid",
    "touristId": "tourist-uuid",
    "startDate": "2025-01-15T00:00:00.000Z",
    "endDate": "2025-01-20T00:00:00.000Z",
    "destination": {
      "country": "Indonesia",
      "city": "Bali",
      "hotel": "Grand Hyatt Bali",
      "activities": ["Beach", "Temple Tour", "Surfing"]
    },
    "status": "PLANNED",
    "canceledAt": null
  }
]
```

**Note:** Tourist hanya melihat trip mereka sendiri, Employee melihat semua trip.

---

#### 3. Get Trip by ID

**Endpoint:** `GET /trips/:id`

**Headers:** `Authorization: Bearer {token}`

**Response (200):**

```json
{
  "id": "trip-uuid",
  "touristId": "tourist-uuid",
  "startDate": "2025-01-15T00:00:00.000Z",
  "endDate": "2025-01-20T00:00:00.000Z",
  "destination": {
    "country": "Indonesia",
    "city": "Bali",
    "hotel": "Grand Hyatt Bali",
    "activities": ["Beach", "Temple Tour", "Surfing"]
  },
  "status": "PLANNED",
  "canceledAt": null,
  "tourist": {
    "id": "tourist-uuid",
    "user": {
      "name": "John Doe",
      "email": "tourist@example.com"
    }
  }
}
```

**Error (403) - Tourist accessing other's trip:**

```json
{
  "message": "Access to this trip is denied",
  "error": "Forbidden",
  "statusCode": 403
}
```

---

#### 4. Update Trip (EMPLOYEE Only)

**Endpoint:** `PUT /trips/:id`

**Headers:** `Authorization: Bearer {employee_token}`

**Request Body:**

```json
{
  "startDate": "2025-01-16T00:00:00.000Z",
  "endDate": "2025-01-22T00:00:00.000Z",
  "destination": {
    "country": "Indonesia",
    "city": "Bali",
    "hotel": "Four Seasons Resort Bali",
    "activities": ["Beach", "Temple Tour", "Surfing", "Spa"]
  },
  "status": "ONGOING"
}
```

**Response (200):**

```json
{
  "id": "trip-uuid",
  "touristId": "tourist-uuid",
  "startDate": "2025-01-16T00:00:00.000Z",
  "endDate": "2025-01-22T00:00:00.000Z",
  "destination": {
    "country": "Indonesia",
    "city": "Bali",
    "hotel": "Four Seasons Resort Bali",
    "activities": ["Beach", "Temple Tour", "Surfing", "Spa"]
  },
  "status": "ONGOING",
  "updatedAt": "2025-12-18T09:00:00.000Z"
}
```

---

#### 5. Cancel Trip (EMPLOYEE Only)

**Endpoint:** `PATCH /trips/:id/cancel`

**Headers:** `Authorization: Bearer {employee_token}`

**Response (200):**

```json
{
  "id": "trip-uuid",
  "status": "CANCELED",
  "canceledAt": "2025-12-18T09:00:00.000Z",
  "updatedAt": "2025-12-18T09:00:00.000Z"
}
```

---

#### 6. Delete Trip (EMPLOYEE Only)

**Endpoint:** `DELETE /trips/:id`

**Headers:** `Authorization: Bearer {employee_token}`

**Response (200):**

```json
{
  "message": "Trip successfully deleted",
  "data": {
    "id": "trip-uuid",
    "touristId": "tourist-uuid",
    "startDate": "2025-01-15T00:00:00.000Z",
    "endDate": "2025-01-20T00:00:00.000Z",
    "destination": {...},
    "status": "PLANNED"
  }
}
```

---

## 🔑 Environment Variables

### Development (.env)

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/mlaku_mlaku"
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"
PORT=3000
NODE_ENV=development
```

### Production (Render)

```env
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"
NODE_ENV=production
PORT=3000
```

## 🧪 Testing

### Menggunakan cURL

```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mail.com","password":"admin123"}'

# Get trips (dengan token)
curl -X GET http://localhost:3000/trips \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Menggunakan Postman

1. Import collection (jika ada)
2. Set environment variable `base_url` ke:
   - Local: `http://localhost:3000`
   - Production: `https://mlaku-mlaku-api.onrender.com`
3. Login untuk mendapatkan token
4. Token akan auto-save ke environment variable
5. Test endpoint lainnya

## 📊 Database Schema

```prisma
model User {
  id           String   @id @default(uuid())
  name         String
  email        String   @unique
  passwordHash String
  role         Role
  employee     Employee?
  tourist      Tourist?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Employee {
  id        String   @id @default(uuid())
  userId    String   @unique
  position  String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Tourist {
  id        String   @id @default(uuid())
  userId    String   @unique
  phone     String
  gender    Gender
  age       Int
  address   String
  user      User     @relation(fields: [userId], references: [id])
  trips     Trip[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Trip {
  id          String     @id @default(uuid())
  touristId   String
  startDate   DateTime
  endDate     DateTime
  destination Json
  status      TripStatus
  canceledAt  DateTime?
  tourist     Tourist    @relation(fields: [touristId], references: [id])
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

enum Role {
  ADMIN
  EMPLOYEE
  TOURIST
}

enum Gender {
  MALE
  FEMALE
  OTHER
}

enum TripStatus {
  PLANNED
  ONGOING
  COMPLETED
  CANCELED
}
```

## 🔒 Role-Based Access Control

| Endpoint                | ADMIN | EMPLOYEE | TOURIST  |
| ----------------------- | ----- | -------- | -------- |
| POST /auth/register     | ❌    | ❌       | ✅       |
| POST /auth/login        | ✅    | ✅       | ✅       |
| POST /users/employee    | ✅    | ❌       | ❌       |
| POST /users/tourist     | ✅    | ✅       | ❌       |
| PUT /users/:id          | ✅    | ❌       | ❌       |
| DELETE /users/:id       | ✅    | ❌       | ❌       |
| GET /employees          | ✅    | ❌       | ❌       |
| PUT /employees/:id      | ✅    | ❌       | ❌       |
| DELETE /employees/:id   | ✅    | ❌       | ❌       |
| GET /tourists           | ❌    | ✅       | ❌       |
| PUT /tourists/:id       | ❌    | ✅       | ❌       |
| DELETE /tourists/:id    | ❌    | ✅       | ❌       |
| POST /trips             | ❌    | ✅       | ❌       |
| GET /trips              | ❌    | ✅ (all) | ✅ (own) |
| GET /trips/:id          | ❌    | ✅       | ✅ (own) |
| PUT /trips/:id          | ❌    | ✅       | ❌       |
| PATCH /trips/:id/cancel | ❌    | ✅       | ❌       |
| DELETE /trips/:id       | ❌    | ✅       | ❌       |

## 🐛 Troubleshooting

### Error: "Cannot find module 'generated/prisma/client'"

```bash
npx prisma generate
```

### Error: "Database connection failed"

- Cek `DATABASE_URL` di `.env`
- Pastikan database Supabase bisa diakses
- Cek firewall/whitelist IP

### Error: "Unauthorized"

- Pastikan token JWT valid
- Token format: `Bearer {token}`
- Token bisa expired (default 1 hari)

### Render Cold Start Lambat

- Normal untuk free tier
- Request pertama setelah idle akan lambat
- Upgrade ke paid tier untuk mengurangi cold start

## 📞 Support

Untuk pertanyaan atau issue, silakan buat issue di repository GitHub.

## 📄 License

[MIT License](LICENSE)

---

**Dibuat dengan ❤️ menggunakan NestJS**
