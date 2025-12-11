export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
}

export class LoginDto {
  username!: string;
  password!: string;
}

export class RegisterDto {
  username!: string;
  password!: string;
  role?: UserRole;
}
