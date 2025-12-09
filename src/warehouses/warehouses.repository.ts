import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { Warehouse } from './entities/warehouse.entity';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

export abstract class WarehousesRepository {
  abstract create(data: CreateWarehouseDto): Promise<Warehouse>;
  abstract update(
    id: number,
    data: UpdateWarehouseDto,
  ): Promise<Warehouse | null>;
  abstract delete(id: number): Promise<boolean>;
  abstract findAll(): Promise<Warehouse[]>;
  abstract findOne(id: number): Promise<Warehouse | null>;
}
