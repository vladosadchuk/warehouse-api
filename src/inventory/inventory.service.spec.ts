import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { InventoryRepository } from './inventory.repository';
import { TransactionsService } from '../transactions/transactions.service';

describe('InventoryService', () => {
  let service: InventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: InventoryRepository,
          useValue: {
            findByProductAndWarehouse: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            findAll: jest.fn(),
            findAllByWarehouse: jest.fn(),
          },
        },
        {
          provide: TransactionsService,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
