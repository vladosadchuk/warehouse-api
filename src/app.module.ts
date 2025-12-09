import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [ProductsModule, WarehousesModule, InventoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
