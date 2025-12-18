import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma/prisma.service';
import { Role } from 'generated/prisma/client';
import * as bcrypt from 'bcrypt';

describe('RBAC Flow (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let adminToken: string;
  let employeeToken: string;
  let touristToken: string;

  let employeeId: string; // The UUID of the employee user
  let touristId: string; // The UUID of the tourist user
  let tripId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

    // Cleanup before tests
    await prisma.trip.deleteMany();
    await prisma.tourist.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.user.deleteMany();

    // 1. Create Admin User directly in DB
    const adminPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: 'admin@test.com',
        name: 'Super Admin',
        passwordHash: adminPassword,
        role: Role.ADMIN,
      },
    });

    // Login Admin
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@test.com', password: 'admin123' });

    adminToken = loginRes.body.accessToken;
  });

  afterAll(async () => {
    await prisma.trip.deleteMany();
    await prisma.tourist.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('Admin Role', () => {
    it('should be able to create an Employee', async () => {
      const res = await request(app.getHttpServer())
        .post('/employees')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'employee@test.com',
          password: 'emp123',
          name: 'John Employee',
          position: 'Manager',
        });

      expect(res.status).toBe(201);
    });

    it('should be able to view all employees', async () => {
      const res = await request(app.getHttpServer())
        .get('/employees')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);

      // Save employeeId for later
      employeeId = res.body[0].user.id;
    });

    it('should fail to create a Trip (Forbidden)', async () => {
      // Admin shouldn't manage trips (unless defined otherwise, but plan says Admin no manage trips)
      // Wait, current TripsController doesn't explicitly block Admin on Create/Update,
      // but it has @Roles([Role.EMPLOYEE]) on create.

      const res = await request(app.getHttpServer())
        .post('/trips')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          touristId: 'some-uuid',
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
          destination: { city: 'Paris' },
        });

      expect(res.status).toBe(403);
    });
  });

  describe('Employee Role', () => {
    beforeAll(async () => {
      // Login as Employee
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'employee@test.com', password: 'emp123' });

      employeeToken = loginRes.body.accessToken;
    });

    it('should be able to create a Tourist (Internal)', async () => {
      const res = await request(app.getHttpServer())
        .post('/tourists')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          email: 'tourist@test.com',
          password: 'tourist123',
          fullName: 'Jane Tourist',
          phone: '1234567890',
          gender: 'FEMALE',
          age: 30,
          address: '123 Travel St',
        });

      expect(res.status).toBe(201);
    });

    it('should be able to view tourists', async () => {
      const res = await request(app.getHttpServer())
        .get('/tourists')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      touristId = res.body[0].id; // This is the Tourist Profile ID, not User ID.
      // Wait, TripsService needs Tourist ID (Profile ID).
    });

    it('should be able to create a Trip for a Tourist', async () => {
      const res = await request(app.getHttpServer())
        .post('/trips')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          touristId: touristId,
          startDate: new Date().toISOString(),
          endDate: new Date(new Date().getTime() + 86400000).toISOString(),
          destination: { city: 'Bali' },
        });

      expect(res.status).toBe(201);
      tripId = res.body.id;
    });

    it('should fail to delete an Employee (Forbidden)', async () => {
      // Only Admin can delete employees
      const res = await request(app.getHttpServer())
        .delete(`/employees/${employeeId}`) // employeeId is User ID
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('Tourist Role', () => {
    beforeAll(async () => {
      // Login as Tourist
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'tourist@test.com', password: 'tourist123' });

      touristToken = loginRes.body.accessToken;
    });

    it('should be able to view own trips', async () => {
      const res = await request(app.getHttpServer())
        .get('/trips')
        .set('Authorization', `Bearer ${touristToken}`);

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].id).toBe(tripId);
    });

    it('should fail to create a Trip (Forbidden)', async () => {
      const res = await request(app.getHttpServer())
        .post('/trips')
        .set('Authorization', `Bearer ${touristToken}`)
        .send({
          touristId: touristId,
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
          destination: { city: 'Tokyo' },
        });

      expect(res.status).toBe(403);
    });

    it('should fail to cancel a Trip (Forbidden)', async () => {
      // Only Employee can cancel (PATCH /trips/:id/cancel)
      // Wait, plan said "Employee: Update/Reschedule, Cancel". Tourist: "View Own".
      // Requirement said "Tourist: View own Trip history...". Nothing about cancel.
      // So Tourist cannot cancel.
      const res = await request(app.getHttpServer())
        .patch(`/trips/${tripId}/cancel`)
        .set('Authorization', `Bearer ${touristToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('Cleanup', () => {
    it('Admin should delete Employee', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/employees/${employeeId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
    });
  });
});
