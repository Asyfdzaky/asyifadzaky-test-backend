# Postman Collection - Travel Management API

## 📦 Files Included

1. **postman_collection.json** - Complete API collection with all endpoints
2. **postman_environment.json** - Environment variables for local testing

## 🚀 Quick Start

### 1. Import to Postman

1. Open Postman
2. Click **Import** button
3. Import both files:
   - `postman_collection.json`
   - `postman_environment.json`
4. Select the **"Travel API - Local Environment"** from the environment dropdown

### 2. Initial Setup

Before testing, make sure:

- Your API server is running on `http://localhost:3000`
- Database is seeded with admin user (run `npx prisma db seed`)

### 3. Testing Flow

Follow this recommended order:

#### **Step 1: Authentication**

1. **Login as Admin** - Uses seeded admin account
   - Email: `admin@mail.com`
   - Password: `admin123`
   - ✅ Auto-saves token to `admin_token` variable

2. **Register Tourist** - Create a tourist account
   - ✅ Auto-saves token to `tourist_token` variable

#### **Step 2: Create Users (as Admin)**

3. **Create Employee** - Create an employee account
   - ✅ Auto-saves `employee_user_id` variable

4. **Login as Employee** - Login with created employee
   - Email: `employee@example.com`
   - Password: `password123`
   - ✅ Auto-saves token to `employee_token` variable

#### **Step 3: Test User Management**

All endpoints in "Users Management (ADMIN)" folder require admin token

#### **Step 4: Test Employee Management**

All endpoints in "Employees (ADMIN)" folder require admin token

#### **Step 5: Test Tourist Management**

- Use employee token
- Create a tourist using "Create Tourist (by Employee)"
- ✅ Auto-saves `new_tourist_id` for trip creation

#### **Step 6: Test Trip Management**

- Create trips as EMPLOYEE
- View trips as both EMPLOYEE and TOURIST
- Update/Cancel/Delete as EMPLOYEE

## 🔐 Role-Based Access

### ADMIN Role

- ✅ Create/Update/Delete Users (Employees & Tourists)
- ✅ Manage Employees
- ❌ Cannot manage Trips directly

### EMPLOYEE Role

- ✅ Create/Update/Delete Tourists
- ✅ Create/Update/Cancel/Delete Trips
- ✅ View all Trips
- ❌ Cannot manage Employees

### TOURIST Role

- ✅ View their own Trips only
- ❌ Cannot create or modify Trips
- ❌ Cannot access user management

## 📋 API Endpoints Overview

### Authentication

- `POST /auth/register` - Register new tourist
- `POST /auth/login` - Login (all roles)

### Users (ADMIN only)

- `POST /users/employee` - Create employee
- `POST /users/tourist` - Create tourist
- `PUT /users/:id` - Update user info
- `PUT /users/:id/credentials` - Update email/password
- `DELETE /users/:id` - Delete user

### Employees (ADMIN only)

- `GET /employees` - List all employees
- `GET /employees/:userId` - Get employee details
- `PUT /employees/:userId` - Update employee
- `DELETE /employees/:userId` - Delete employee

### Tourists (EMPLOYEE only)

- `GET /tourists` - List all tourists
- `GET /tourists/:userId` - Get tourist details
- `PUT /tourists/:userId` - Update tourist
- `DELETE /tourists/:userId` - Delete tourist

### Trips (EMPLOYEE & TOURIST)

- `POST /trips` - Create trip (EMPLOYEE)
- `GET /trips` - List trips (all for EMPLOYEE, own for TOURIST)
- `GET /trips/:id` - Get trip details
- `PUT /trips/:id` - Update trip (EMPLOYEE)
- `PATCH /trips/:id/cancel` - Cancel trip (EMPLOYEE)
- `DELETE /trips/:id` - Delete trip (EMPLOYEE)

## 🔧 Environment Variables

The collection automatically manages these variables:

| Variable           | Description              | Auto-populated                   |
| ------------------ | ------------------------ | -------------------------------- |
| `base_url`         | API base URL             | Manual (default: localhost:3000) |
| `admin_token`      | Admin JWT token          | ✅ Yes                           |
| `employee_token`   | Employee JWT token       | ✅ Yes                           |
| `tourist_token`    | Tourist JWT token        | ✅ Yes                           |
| `employee_user_id` | Created employee user ID | ✅ Yes                           |
| `tourist_user_id`  | Created tourist user ID  | ✅ Yes                           |
| `new_tourist_id`   | Tourist ID for trips     | ✅ Yes                           |
| `trip_id`          | Created trip ID          | ✅ Yes                           |

## 📝 Sample Data

### Gender Enum Values

- `MALE`
- `FEMALE`
- `OTHER`

### Trip Status Enum Values

- `PLANNED`
- `ONGOING`
- `COMPLETED`
- `CANCELED`

### Sample Trip Destination JSON

```json
{
  "country": "Indonesia",
  "city": "Bali",
  "hotel": "Grand Hyatt Bali",
  "activities": ["Beach", "Temple Tour", "Surfing"]
}
```

## ⚠️ Important Notes

1. **Token Management**: Tokens are automatically saved when you login. Make sure to login before testing protected endpoints.

2. **Tourist ID for Trips**: When creating a trip, you need a `touristId`. Use the `new_tourist_id` variable that's auto-populated when you create a tourist.

3. **Date Format**: Use ISO 8601 format for dates: `2025-01-15T00:00:00.000Z`

4. **Forbidden Access**: If you get 403 Forbidden, check:
   - You're using the correct role's token
   - The endpoint allows that role
   - Token hasn't expired

5. **Tourist Access**: Tourists can only view their own trips. If a tourist tries to access another tourist's trip, they'll get a 403 error.

## 🧪 Testing Scenarios

### Scenario 1: Complete Trip Creation Flow

1. Login as Admin → Create Employee
2. Login as Employee → Create Tourist
3. As Employee → Create Trip for that Tourist
4. Login as Tourist → View their trips

### Scenario 2: Role-Based Access Testing

1. Login as Tourist → Try to create a trip (should fail)
2. Login as Employee → Try to manage employees (should fail)
3. Login as Admin → Try to create trips (should fail)

### Scenario 3: Trip Management

1. Create trip as Employee
2. Update trip status to ONGOING
3. Cancel trip
4. Delete trip

## 🐛 Troubleshooting

**Problem**: "Unauthorized" error

- **Solution**: Make sure you've logged in and the token is saved

**Problem**: "Forbidden" error

- **Solution**: Check if your role has access to this endpoint

**Problem**: "Tourist not found" when creating trip

- **Solution**: Use the correct `touristId` from the environment variable

**Problem**: Variables not auto-populating

- **Solution**: Check that the environment is selected in Postman

## 📞 Support

For issues or questions about the API, refer to the NestJS application code or contact the development team.

---

**Happy Testing! 🎉**
