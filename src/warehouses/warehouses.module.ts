import { Module } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { WarehousesController } from './warehouses.controller';
import { WarehousesRepository } from './warehouses.repository';
import { InMemoryWarehousesRepository } from './repositories/in-memory-warehouses.repository';

@Module({
  controllers: [WarehousesController],
  providers: [
    WarehousesService,
    { provide: WarehousesRepository, useClass: InMemoryWarehousesRepository },
  ],
  exports: [WarehousesService],
})
export class WarehousesModule {}
