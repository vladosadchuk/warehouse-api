import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryRepository } from './inventory.repository';
import { PrismaInventoryRepository } from './repositories/prisma-inventory.repository';

@Module({
  controllers: [InventoryController],
  providers: [
    InventoryService,
    { provide: InventoryRepository, useClass: PrismaInventoryRepository },
  ],
})
export class InventoryModule {}
