import { Controller, Post, Body } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SendEmailDto } from './dto/sendEmail.dto';

@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post()
  @ApiOperation({ summary: 'Message has sent to the email' })
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async sendMessage(@Body() body: SendEmailDto) {
    await this.contactService.sendContactEmail(body);
    return { message: 'Email sent successfully' };
  }
}
