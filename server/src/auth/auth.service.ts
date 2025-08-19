import { BadRequestException, Injectable } from '@nestjs/common';
import prisma from '../prismaClient';
import { RegisterUserDto, UserDto } from './dto';
import * as argon2 from 'argon2';
import { Role } from '../../generated/prisma';
import { LoginUserDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async register(registerData: RegisterUserDto, photo: Express.Multer.File) {
    // Check username
    const checkUsername = await prisma.user.findFirst({ where: { username: registerData.username } });
    
    if (checkUsername) {
      throw new BadRequestException("Username is already taken please enter new username");
    }
    // Check Email
    const checkEmail = await prisma.user.findFirst({ where: { email: registerData.email } });

    if(checkEmail){
        throw new BadRequestException("Email is already taken please enter new Email Or login");
    }

    // Enforce photo required (to match controller's required field)
    if (!photo) {
      throw new BadRequestException("Photo is required for registration");
    }

    // Hash Password
    const hashPassword = await argon2.hash(registerData.password);
    // Handle photo upload
    let avatarUrl = '';
    if (photo) {
      const uploadResult = await this.cloudinaryService.uploadFile(photo);
      avatarUrl = uploadResult.secure_url;
    } else {
      avatarUrl = '';
    }
    // Save User
    const newUser = await prisma.user.create({
      data: {
        name: registerData.name,
        username: registerData.username,
        avatarUrl,
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
    const user = await prisma.user.findUnique({ where: { email: loginData.email } });
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }
    // Check password
    const valid = await argon2.verify(user.password, loginData.password);
    if (!valid) {
      throw new BadRequestException('Invalid email or password');
    }
    // Remove password before returning
    const { password, ...userWithoutPassword } = user;
    
    // Generate JWT token
    const token = await this.generateJwtToken(user);
    return { user: userWithoutPassword, access_token: token.access_token };
  }

  async resetPassword(email: string){
    const user = await prisma.user.findUnique({where:{email: email}});
    if (!user) throw new Error('User not found');

    // Generate a professional 6-digit numeric reset code
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    });
    // the styling of the sent gmail
    await this.mailerService.sendMail({
      to: email,
      subject: 'EduFlex Password Reset Request',
      text: `Dear ${user.name || 'User'},\n\nWe received a request to reset your EduFlex account password.\n\nYour password reset code is: ${token}\n\nThis code will expire in 1 hour. If you did not request a password reset, please ignore this email.\n\nBest regards,\nThe EduFlex Team`,
      html: `
        <div style="background:#f4f6fb;padding:40px 0;font-family:'Segoe UI',Arial,sans-serif;">
          <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.07);padding:32px 28px 28px 28px;">
            <div style="text-align:center;margin-bottom:24px;">
              <span style="display:inline-block;background:#4f8cff;color:#fff;font-weight:600;font-size:1.3em;padding:8px 24px;border-radius:8px;letter-spacing:1px;">EduFlex</span>
            </div>
            <h2 style="color:#222;font-size:1.4em;margin-bottom:12px;text-align:center;">Password Reset Request</h2>
            <p style="color:#444;font-size:1em;margin-bottom:24px;text-align:center;">Hi ${user.name || 'there'},<br>We received a request to reset your <b>EduFlex</b> account password.</p>
            <div style="background:#f0f4ff;border-radius:8px;padding:24px 0;margin:0 auto 24px auto;text-align:center;">
              <span style="display:inline-block;font-size:2.2em;font-weight:700;letter-spacing:6px;color:#2d5be3;">${token}</span>
              <div style="font-size:0.95em;color:#888;margin-top:8px;">This code expires in 1 hour</div>
            </div>
            <p style="color:#444;font-size:1em;text-align:center;">If you did not request a password reset, you can safely ignore this email.<br><br>For your security, do not share this code with anyone.</p>
            <div style="margin-top:32px;text-align:center;color:#aaa;font-size:0.95em;">Best regards,<br><b>The EduFlex Team</b></div>
          </div>
          <div style="text-align:center;margin-top:24px;color:#b0b0b0;font-size:0.9em;">&copy; ${new Date().getFullYear()} EduFlex. All rights reserved.</div>
        </div>
      `,
    });
  }

  async updatePassword(token: string, newPassword: string): Promise<void> {
    // Find user by reset token and check expiry
    const user = await prisma.user.findFirst({ where: { resetPasswordToken: token } });
    if (!user || !user.resetPasswordExpires || new Date() > user.resetPasswordExpires) {
      throw new Error('Invalid or expired token');
    }

    const hashedPassword = await argon2.hash(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
  }

  async generateJwtToken(user: UserDto){
    const payload = { sub: user.id, username: user.username};

    const access_token = await this.jwtService.signAsync(payload);

    return { access_token };
  }
}