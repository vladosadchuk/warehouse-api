/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import { WarehousesRepository } from '../warehouses.repository';
import { CreateWarehouseDto } from '../dto/create-warehouse.dto';
import { Warehouse } from '../entities/warehouse.entity';
import { UpdateWarehouseDto } from '../dto/update-warehouse.dto';

@Injectable()
export class InMemoryWarehousesRepository implements WarehousesRepository {
  private warehouses: Warehouse[] = [];
  private idCounter = 1;

  async create(data: CreateWarehouseDto): Promise<Warehouse> {
    const warehouse: Warehouse = {
      id: this.idCounter++,
      ...data,
    };
    this.warehouses.push(warehouse);
    return warehouse;
  }

  async update(
    id: number,
    data: UpdateWarehouseDto,
  ): Promise<Warehouse | null> {
    const index = this.warehouses.findIndex((w) => w.id === id);
    if (index === -1) return null;
    this.warehouses[index] = { ...this.warehouses[index], ...data };
    return this.warehouses[index];
  }

  async delete(id: number): Promise<boolean> {
    const index = this.warehouses.findIndex((w) => w.id === id);
    if (index === -1) return false;

    this.warehouses.splice(index, 1);
    return true;
  }

  async findAll(): Promise<Warehouse[]> {
    return this.warehouses;
  }

  async findOne(id: number): Promise<Warehouse | null> {
    return this.warehouses.find((w) => w.id === id) || null;
  }
}
