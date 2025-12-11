import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { Server } from 'http';

interface LoginResponse {
  access_token: string;
}

interface ProductResponse {
  id: number;
  sku: string;
}

describe('Products (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtToken: string;
  let httpServer: Server; // Змінна для типізованого сервера

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    httpServer = app.getHttpServer() as Server;

    prisma = app.get<PrismaService>(PrismaService);

    await prisma.transaction.deleteMany();
    await prisma.inventory.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    await request(httpServer).post('/auth/register').send({
      username: 'testadmin',
      password: 'password',
      role: 'ADMIN',
    });

    const loginRes = await request(httpServer)
      .post('/auth/login')
      .send({ username: 'testadmin', password: 'password' });

    const body = loginRes.body as LoginResponse;
    jwtToken = body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/products (POST) - Success (with Token)', () => {
    return request(httpServer)
      .post('/products')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        sku: 'E2E_TEST_SKU',
        name: 'E2E Product',
        description: 'Created by E2E test',
      })
      .expect(201)
      .expect((res) => {
        // 5. Типізуємо відповідь всередині expect
        const body = res.body as ProductResponse;
        expect(body.id).toBeDefined();
        expect(body.sku).toEqual('E2E_TEST_SKU');
      });
  });

  it('/products (POST) - Fail (No Token)', () => {
    return request(httpServer)
      .post('/products')
      .send({ sku: 'FAIL', name: 'Fail' })
      .expect(401);
  });

  it('/products (GET)', () => {
    return request(httpServer)
      .get('/products')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .expect((res) => {
        const body = res.body as ProductResponse[];
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);
      });
  });
});
