import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { InMemoryProductsRepository } from './repositories/in-memory-products.repository';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    { provide: ProductsRepository, useClass: InMemoryProductsRepository },
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
