import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryRepository } from './inventory.repository';
import { PrismaInventoryRepository } from './repositories/prisma-inventory.repository';
import { TransactionsService } from '../transactions/transactions.service';

@Module({
  controllers: [InventoryController],
  providers: [
    InventoryService,
    TransactionsService,
    { provide: InventoryRepository, useClass: PrismaInventoryRepository },
  ],
})
export class InventoryModule {}
