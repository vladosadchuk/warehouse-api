import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { WarehousesRepository } from './warehouses.repository';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

@Injectable()
export class WarehousesService {
  constructor(private readonly warehousesRepository: WarehousesRepository) {}

  create(createWarehouseDto: CreateWarehouseDto) {
    return this.warehousesRepository.create(createWarehouseDto);
  }

  async update(id: number, updateWarehouseDto: UpdateWarehouseDto) {
    const updated = await this.warehousesRepository.update(
      id,
      updateWarehouseDto,
    );
    if (!updated) throw new NotFoundException(`Warehouse #${id} not found`);
    return updated;
  }

  async remove(id: number) {
    const deleted = await this.warehousesRepository.delete(id);
    if (!deleted) throw new NotFoundException(`Warehouse #${id} not found`);
    return { message: `Warehouse #${id} removed successfully` };
  }

  findAll() {
    return this.warehousesRepository.findAll();
  }

  async findOne(id: number) {
    const warehouse = await this.warehousesRepository.findOne(id);
    if (!warehouse) throw new NotFoundException(`Warehouse #${id} not found`);
    return warehouse;
  }
}
