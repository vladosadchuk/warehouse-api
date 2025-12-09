import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryRepository } from './inventory.repository';
import { InMemoryInventoryRepository } from './repositories/in-memory-inventory.repository';

@Module({
  controllers: [InventoryController],
  providers: [
    InventoryService,
    { provide: InventoryRepository, useClass: InMemoryInventoryRepository },
  ],
})
export class InventoryModule {}
