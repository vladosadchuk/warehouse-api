import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { NotFoundException } from '@nestjs/common';

const mockProductsRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: typeof mockProductsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: ProductsRepository, useValue: mockProductsRepository },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get(ProductsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- TEST CREATE ---
  describe('create', () => {
    it('should create a new product', async () => {
      const dto = { sku: '123', name: 'Test', description: 'Desc' };
      const expectedResult = { id: 1, ...dto };

      repository.create.mockResolvedValue(expectedResult);

      const result = await service.create(dto);

      expect(result).toEqual(expectedResult);
      expect(repository.create).toHaveBeenCalledWith(dto);
    });
  });

  // --- TEST FIND ALL ---
  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products = [
        { id: 1, name: 'P1' },
        { id: 2, name: 'P2' },
      ];
      repository.findAll.mockResolvedValue(products);

      const result = await service.findAll();

      expect(result).toEqual(products);
      expect(repository.findAll).toHaveBeenCalled();
    });
  });

  // --- TEST FIND ONE ---
  describe('findOne', () => {
    it('should return a product if found', async () => {
      const product = { id: 1, name: 'P1' };
      repository.findOne.mockResolvedValue(product);

      const result = await service.findOne(1);
      expect(result).toEqual(product);
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findOne.mockResolvedValue(null); // Імітуємо, що товару немає

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  // --- TEST DELETE ---
  describe('remove', () => {
    it('should delete product successfully', async () => {
      repository.delete.mockResolvedValue(true); // Успішне видалення

      const result = await service.remove(1);
      expect(result).toEqual({ message: 'Product #1 removed successfully' });
    });

    it('should throw NotFoundException if product not found', async () => {
      repository.delete.mockResolvedValue(false); // Не знайшло

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
