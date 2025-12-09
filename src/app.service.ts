import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiInfo() {
    return {
      name: 'Smart Warehouse API',
      version: '1.0.0',
      description: 'API for managing products, warehouses, and inventory flow.',
      author: 'Vladyslav Osadchuk',
      endpoints: {
        products: '/products',
        warehouses: '/warehouses',
        inventory: '/inventory',
      },
      serverTime: new Date().toISOString(),
    };
  }
}
