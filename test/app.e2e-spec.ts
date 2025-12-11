import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { Server } from 'http';

interface AuthResponse {
  access_token: string;
}
interface IdResponse {
  id: number;
}
interface InventoryItem {
  warehouseId: number;
  quantity: number;
}
interface TransactionItem {
  type: string;
}

describe('System Full Flow (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let httpServer: Server;

  let adminToken: string;
  let managerToken: string;

  let productId: number;
  let kyivWarehouseId: number;
  let lvivWarehouseId: number;

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
    await prisma.warehouse.deleteMany();
    await prisma.user.deleteMany();

    // Register
    await request(httpServer)
      .post('/auth/register')
      .send({ username: 'superadmin', password: '123', role: 'ADMIN' });

    await request(httpServer)
      .post('/auth/register')
      .send({ username: 'manager', password: '123', role: 'MANAGER' });

    // Login Admin
    const adminRes = await request(httpServer)
      .post('/auth/login')
      .send({ username: 'superadmin', password: '123' });
    const adminBody = adminRes.body as AuthResponse;
    adminToken = adminBody.access_token;

    // Login Manager
    const managerRes = await request(httpServer)
      .post('/auth/login')
      .send({ username: 'manager', password: '123' });
    const managerBody = managerRes.body as AuthResponse;
    managerToken = managerBody.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  // --- STEP 1: ADMIN CREATES RESOURCES ---

  it('1. Admin should create Warehouses', async () => {
    const res1 = await request(httpServer)
      .post('/warehouses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Kyiv Hub', location: 'Kyiv' })
      .expect(201);
    const body1 = res1.body as IdResponse;
    kyivWarehouseId = body1.id;

    const res2 = await request(httpServer)
      .post('/warehouses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Lviv Branch', location: 'Lviv' })
      .expect(201);
    const body2 = res2.body as IdResponse;
    lvivWarehouseId = body2.id;
  });

  it('2. Admin should create a Product', async () => {
    const res = await request(httpServer)
      .post('/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ sku: 'IPHONE_15', name: 'iPhone 15', description: 'Phone' })
      .expect(201);
    const body = res.body as IdResponse;
    productId = body.id;
  });

  // --- STEP 2: MANAGER PERFORMS OPERATIONS ---

  it('3. Manager should SUPPLY stock (100 items to Kyiv)', async () => {
    await request(httpServer)
      .post('/inventory/supply')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({
        productId: productId,
        warehouseId: kyivWarehouseId,
        amount: 100,
      })
      .expect(201);

    const res = await request(httpServer)
      .get(`/inventory/warehouse/${kyivWarehouseId}`)
      .set('Authorization', `Bearer ${managerToken}`)
      .expect(200);

    const body = res.body as InventoryItem[];
    expect(body[0].quantity).toBe(100);
  });

  it('4. Manager should TRANSFER stock (30 items Kyiv -> Lviv)', async () => {
    await request(httpServer)
      .post('/inventory/transfer')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({
        productId: productId,
        fromWarehouseId: kyivWarehouseId,
        toWarehouseId: lvivWarehouseId,
        amount: 30,
      })
      .expect(201);
  });

  it('5. Manager should WRITE-OFF stock (5 items from Lviv)', async () => {
    await request(httpServer)
      .post('/inventory/write-off')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({
        productId: productId,
        warehouseId: lvivWarehouseId,
        amount: 5,
        reason: 'Damaged',
      })
      .expect(201);
  });

  // --- STEP 3: VERIFICATION ---

  it('6. Verify Final Inventory State', async () => {
    const res = await request(httpServer)
      .get('/inventory')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const body = res.body as InventoryItem[];
    const kyivStock = body.find((i) => i.warehouseId === kyivWarehouseId);
    const lvivStock = body.find((i) => i.warehouseId === lvivWarehouseId);

    expect(kyivStock?.quantity).toBe(70);
    expect(lvivStock?.quantity).toBe(25);
  });

  it('7. Admin should see 3 Transactions in Audit Log', async () => {
    const res = await request(httpServer)
      .get('/transactions')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const body = res.body as TransactionItem[];
    expect(body.length).toBeGreaterThanOrEqual(3);

    const types = body.map((t) => t.type);
    expect(types).toContain('IN');
    expect(types).toContain('TRANSFER');
    expect(types).toContain('OUT');
  });

  // --- STEP 4: ACCESS CONTROL ---

  it('8. User (without role) should NOT be able to delete warehouse', async () => {
    await request(httpServer)
      .post('/auth/register')
      .send({ username: 'simpleuser', password: '123', role: 'USER' });

    const userRes = await request(httpServer)
      .post('/auth/login')
      .send({ username: 'simpleuser', password: '123' });

    const userBody = userRes.body as AuthResponse;
    const userToken = userBody.access_token;

    await request(httpServer)
      .delete(`/warehouses/${kyivWarehouseId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });
});
