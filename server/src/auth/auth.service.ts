import { Injectable } from '@nestjs/common';
import prisma from '../prismaClient';

@Injectable()
export class AuthService {
  async getUsers() {
    return prisma.user.findMany();
  }
}
