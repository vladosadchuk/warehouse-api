import { Injectable } from '@nestjs/common';
import { InventoryRepository } from '../inventory.repository';
import { Inventory } from '../entities/inventory.entity';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class PrismaInventoryRepository implements InventoryRepository {
  constructor(private prisma: PrismaService) {}

  async findByProductAndWarehouse(
    productId: number,
    warehouseId: number,
  ): Promise<Inventory | null> {
    return this.prisma.inventory.findUnique({
      where: { productId_warehouseId: { productId, warehouseId } },
    }) as Promise<Inventory | null>;
  }

  async findAllByWarehouse(warehouseId: number): Promise<Inventory[]> {
    return this.prisma.inventory.findMany({
      where: { warehouseId },
    }) as Promise<Inventory[]>;
  }

  async findAll(): Promise<Inventory[]> {
    return this.prisma.inventory.findMany() as Promise<Inventory[]>;
  }

  async save(item: Inventory): Promise<Inventory> {
    return this.prisma.inventory.upsert({
      where: {
        productId_warehouseId: {
          productId: item.productId,
          warehouseId: item.warehouseId,
        },
      },
      update: { quantity: item.quantity },
      create: {
        productId: item.productId,
        warehouseId: item.warehouseId,
        quantity: item.quantity,
      },
    }) as Promise<Inventory>;
  }

  async delete(productId: number, warehouseId: number): Promise<boolean> {
    try {
      await this.prisma.inventory.delete({
        where: { productId_warehouseId: { productId, warehouseId } },
      });
      return true;
    } catch {
      return false;
    }
  }
}
