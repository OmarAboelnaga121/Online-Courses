import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from './dto/sendEmail.dto';

@Injectable()
export class ContactService {
  constructor(private readonly mailerService: MailerService) {}


  async sendContactEmail(body : SendEmailDto) {
    

    return await this.mailerService.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER,
      subject: 'New Contact Message - Edu-Flex',
      html: `
        <h3>New Contact Message From Edu-Flex</h3>
        <p><strong>Name:</strong> ${body.name}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Message:</strong> ${body.message}</p>
      `,
    });
  }
}
