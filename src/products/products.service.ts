import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsRepository } from './products.repository';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  create(createProductDto: CreateProductDto) {
    return this.productsRepository.create(createProductDto);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const updated = await this.productsRepository.update(id, updateProductDto);
    if (!updated) throw new NotFoundException(`Product #${id} not found`);
    return updated;
  }

  async remove(id: number) {
    const deleted = await this.productsRepository.delete(id);
    if (!deleted) throw new NotFoundException(`Product #${id} not found`);
    return { message: `Product #${id} removed successfully` };
  }

  findAll() {
    return this.productsRepository.findAll();
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOne(id);
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return product;
  }
}
