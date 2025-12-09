/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../products.repository';
import { CreateProductDto } from '../dto/create-product.dto';
import { Product } from '../entities/product.entity';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class InMemoryProductsRepository implements ProductsRepository {
  private products: Product[] = [];
  private idCounter = 1;

  async create(data: CreateProductDto): Promise<Product> {
    const newProduct: Product = {
      id: this.idCounter++,
      ...data,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  async update(id: number, data: UpdateProductDto): Promise<Product | null> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    // Merge existing data with new data
    this.products[index] = { ...this.products[index], ...data };
    return this.products[index];
  }

  async delete(id: number): Promise<boolean> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return false;

    this.products.splice(index, 1); // Remove 1 element at index
    return true;
  }

  async findAll(): Promise<Product[]> {
    return this.products;
  }

  async findOne(id: number): Promise<Product | null> {
    return this.products.find((p) => p.id === id) || null;
  }
}
