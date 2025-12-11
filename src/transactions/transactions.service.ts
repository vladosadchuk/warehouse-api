import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async log(data: Prisma.TransactionCreateInput) {
    return this.prisma.transaction.create({ data });
  }

  async findAll() {
    return this.prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
