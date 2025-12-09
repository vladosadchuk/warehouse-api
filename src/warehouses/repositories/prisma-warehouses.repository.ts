import { Injectable } from '@nestjs/common';
import { WarehousesRepository } from '../warehouses.repository';
import { CreateWarehouseDto } from '../dto/create-warehouse.dto';
import { UpdateWarehouseDto } from '../dto/update-warehouse.dto';
import { Warehouse } from '../entities/warehouse.entity';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class PrismaWarehousesRepository implements WarehousesRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateWarehouseDto): Promise<Warehouse> {
    return this.prisma.warehouse.create({ data }) as Promise<Warehouse>;
  }

  async findAll(): Promise<Warehouse[]> {
    return this.prisma.warehouse.findMany() as Promise<Warehouse[]>;
  }

  async findOne(id: number): Promise<Warehouse | null> {
    return this.prisma.warehouse.findUnique({
      where: { id },
    }) as Promise<Warehouse | null>;
  }

  async update(
    id: number,
    data: UpdateWarehouseDto,
  ): Promise<Warehouse | null> {
    try {
      return (await this.prisma.warehouse.update({
        where: { id },
        data,
      })) as Warehouse;
    } catch {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.warehouse.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
