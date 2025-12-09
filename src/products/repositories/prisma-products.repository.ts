import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../products.repository';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({ data }) as Promise<Product>;
  }

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany() as Promise<Product[]>;
  }

  async findOne(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
    }) as Promise<Product | null>;
  }

  async update(id: number, data: UpdateProductDto): Promise<Product | null> {
    try {
      return (await this.prisma.product.update({
        where: { id },
        data,
      })) as Product;
    } catch {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.product.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
