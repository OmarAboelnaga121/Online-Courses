import { BadRequestException, Injectable } from '@nestjs/common';
import prisma from '../prismaClient';
import { RegisterUserDto } from './dto';
import * as argon2 from 'argon2';
import { Role } from '../../generated/prisma';
import { LoginUserDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

  constructor(private readonly jwtService: JwtService) {}

  async register(registerData : RegisterUserDto) {
    // Check username
    const checkUsername = await prisma.user.findFirst({ where: { username: registerData.username } });

    if(checkUsername){
        return new BadRequestException("Username is already taken please enter new username");
    }

    // Check Email
    const checkEmail = await prisma.user.findFirst({ where: { email: registerData.email } });

    if(checkEmail){
        return new BadRequestException("Email is already taken please enter new Email Or login");
    }

    // Hash Password
    const hashPassword = await argon2.hash(registerData.password);

    // Save User
    const newUser = await prisma.user.create({
      data: {
        name: registerData.name,
        username: registerData.username,
        avatarUrl: registerData.avatarUrl,
        email: registerData.email,
        password: hashPassword,
        role: registerData.role as Role,
      },
    });

    // Remove password before returning
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  

  async login(loginData: LoginUserDto) {
    // Find user by email
    const user = await prisma.user.findFirst({ where: { email: loginData.email } });
    if (!user) {
      return new BadRequestException('Invalid email or password');
    }
    // Check password
    const valid = await argon2.verify(user.password, loginData.password);
    if (!valid) {
      return new BadRequestException('Invalid email or password');
    }
    // Remove password before returning
    const { password, ...userWithoutPassword } = user;
    // Generate JWT token
    const token = await this.generateJwtToken(user);
    return { user: userWithoutPassword, access_token: token.access_token };
  }

  async generateJwtToken(user: any): Promise<{ access_token: string; expiresIn: string }> {
    const payload = { sub: user.id, username: user.username, role: user.role };

    const access_token = await this.jwtService.signAsync(payload);

    const expiresIn = '1d';
    return { access_token, expiresIn };
  }
}