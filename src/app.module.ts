import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { InventoryModule } from './inventory/inventory.module';
import { PrismaModule } from './database/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ProductsModule,
    WarehousesModule,
    InventoryModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
