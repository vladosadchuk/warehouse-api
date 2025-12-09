import { Inventory } from './entities/inventory.entity';

export abstract class InventoryRepository {
  abstract findByProductAndWarehouse(
    productId: number,
    warehouseId: number,
  ): Promise<Inventory | null>;
  abstract save(inventory: Inventory): Promise<Inventory>;
  abstract delete(productId: number, warehouseId: number): Promise<boolean>;
  abstract findAll(): Promise<Inventory[]>;
  abstract findAllByWarehouse(warehouseId: number): Promise<Inventory[]>;
}
