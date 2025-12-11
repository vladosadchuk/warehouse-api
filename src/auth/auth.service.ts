import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

type SafeUser = Omit<User, 'passwordHash'>;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<SafeUser | null> {
    const user = await this.usersService.findOne(username);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash: _, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: SafeUser) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: payload,
    };
  }

  async register(
    username: string,
    pass: string,
    role: 'ADMIN' | 'MANAGER' | 'USER',
  ) {
    const user = await this.usersService.create({
      username,
      passwordHash: pass,
      role: role,
    });
    return this.login(user);
  }
}
