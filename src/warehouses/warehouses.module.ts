import { Module } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { WarehousesController } from './warehouses.controller';
import { WarehousesRepository } from './warehouses.repository';
import { PrismaWarehousesRepository } from './repositories/prisma-warehouses.repository';

@Module({
  controllers: [WarehousesController],
  providers: [
    WarehousesService,
    { provide: WarehousesRepository, useClass: PrismaWarehousesRepository },
  ],
  exports: [WarehousesService],
})
export class WarehousesModule {}
