import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(data.passwordHash, salt);

    return this.prisma.user.create({
      data: {
        ...data,
        passwordHash,
      },
    });
  }
}
