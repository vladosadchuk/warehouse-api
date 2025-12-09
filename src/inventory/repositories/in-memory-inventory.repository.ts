/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import { InventoryRepository } from '../inventory.repository';
import { Inventory } from '../entities/inventory.entity';

@Injectable()
export class InMemoryInventoryRepository implements InventoryRepository {
  private inventoryStore: Inventory[] = [];

  async findByProductAndWarehouse(
    productId: number,
    warehouseId: number,
  ): Promise<Inventory | null> {
    return (
      this.inventoryStore.find(
        (item) =>
          item.productId === productId && item.warehouseId === warehouseId,
      ) || null
    );
  }

  async save(item: Inventory): Promise<Inventory> {
    const existing = await this.findByProductAndWarehouse(
      item.productId,
      item.warehouseId,
    );

    if (existing) {
      existing.quantity = item.quantity; // Update quantity
      return existing;
    } else {
      this.inventoryStore.push(item); // Create new
      return item;
    }
  }

  async delete(productId: number, warehouseId: number): Promise<boolean> {
    const index = this.inventoryStore.findIndex(
      (i) => i.productId === productId && i.warehouseId === warehouseId,
    );
    if (index === -1) return false;

    this.inventoryStore.splice(index, 1);
    return true;
  }

  async findAll(): Promise<Inventory[]> {
    return this.inventoryStore;
  }

  async findAllByWarehouse(warehouseId: number): Promise<Inventory[]> {
    return this.inventoryStore.filter(
      (item) => item.warehouseId === warehouseId,
    );
  }
}
