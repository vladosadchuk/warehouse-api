import { BadRequestException, Injectable } from '@nestjs/common';
import { SupplyInventoryDto } from './dto/supply-inventory.dto';
import { TransferInventoryDto } from './dto/transfer-inventory.dto';
import { InventoryRepository } from './inventory.repository';
import { WriteOffInventoryDto } from './dto/write-off-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  // Scenario A: Supply
  async supply(dto: SupplyInventoryDto) {
    const item = await this.inventoryRepository.findByProductAndWarehouse(
      dto.productId,
      dto.warehouseId,
    );

    if (item) {
      item.quantity += dto.amount;
      await this.inventoryRepository.save(item);
    } else {
      await this.inventoryRepository.save({
        productId: dto.productId,
        warehouseId: dto.warehouseId,
        quantity: dto.amount,
      });
    }

    return { message: 'Supply successful' };
  }

  // Scenario B: Transfer
  async transfer(dto: TransferInventoryDto) {
    const sourceItem = await this.inventoryRepository.findByProductAndWarehouse(
      dto.productId,
      dto.fromWarehouseId,
    );

    if (!sourceItem || sourceItem.quantity < dto.amount) {
      throw new BadRequestException('Insufficient stock in source warehouse');
    }

    // Prepare target item
    let targetItem = await this.inventoryRepository.findByProductAndWarehouse(
      dto.productId,
      dto.toWarehouseId,
    );
    if (!targetItem) {
      // Init target item structure if not exists (but don't save yet in real DB logic, but here it's fine)
      targetItem = {
        productId: dto.productId,
        warehouseId: dto.toWarehouseId,
        quantity: 0,
      };
    }

    // Execute transfer (In memory strict sequence)
    sourceItem.quantity -= dto.amount;
    targetItem.quantity += dto.amount;

    await this.inventoryRepository.save(sourceItem);
    await this.inventoryRepository.save(targetItem);

    return { message: 'Transfer successful' };
  }

  async writeOff(dto: WriteOffInventoryDto) {
    const item = await this.inventoryRepository.findByProductAndWarehouse(
      dto.productId,
      dto.warehouseId,
    );

    if (!item || item.quantity < dto.amount) {
      throw new BadRequestException('Insufficient stock to write off');
    }

    item.quantity -= dto.amount;
    await this.inventoryRepository.save(item);

    return {
      message: 'Write-off successful',
      remainingStock: item.quantity,
      reason: dto.reason,
    };
  }

  async remove(productId: number, warehouseId: number) {
    const deleted = await this.inventoryRepository.delete(
      productId,
      warehouseId,
    );
    if (!deleted) throw new BadRequestException('Inventory item not found');
    return { message: 'Inventory record removed' };
  }

  findAll() {
    return this.inventoryRepository.findAll();
  }

  async findByWarehouse(warehouseId: number) {
    return this.inventoryRepository.findAllByWarehouse(warehouseId);
  }
}
