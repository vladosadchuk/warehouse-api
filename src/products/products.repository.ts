import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';

export abstract class ProductsRepository {
  abstract create(data: CreateProductDto): Promise<Product>;
  abstract update(id: number, data: UpdateProductDto): Promise<Product | null>;
  abstract delete(id: number): Promise<boolean>;
  abstract findAll(): Promise<Product[]>;
  abstract findOne(id: number): Promise<Product | null>;
}
