import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailDto } from './dto/sendEmail.dto';

describe('ContactService', () => {
  let service: ContactService;
  let mailerService: MailerService;

  const mockMailerService = {
    sendMail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        { provide: MailerService, useValue: mockMailerService },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
    mailerService = module.get<MailerService>(MailerService);

    // Setup environment variables
    process.env.MAIL_USER = 'test@eduflex.com';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendContactEmail', () => {
    const mockEmailData: SendEmailDto = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message',
    };

    it('should send contact email successfully', async () => {
      const mockMailResponse = { messageId: 'test-message-id' };
      mockMailerService.sendMail.mockResolvedValue(mockMailResponse);

      const result = await service.sendContactEmail(mockEmailData);

      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        from: 'test@eduflex.com',
        to: 'test@eduflex.com',
        subject: 'New Contact Message - Edu-Flex',
        html: expect.stringContaining('New Contact Message From Edu-Flex'),
      });

      expect(result).toEqual(mockMailResponse);
    });

    it('should include all contact details in email HTML', async () => {
      mockMailerService.sendMail.mockResolvedValue({ messageId: 'test' });

      await service.sendContactEmail(mockEmailData);

      const emailCall = mockMailerService.sendMail.mock.calls[0][0];
      expect(emailCall.html).toContain(mockEmailData.name);
      expect(emailCall.html).toContain(mockEmailData.email);
      expect(emailCall.html).toContain(mockEmailData.message);
    });

    it('should handle mailer service errors', async () => {
      const error = new Error('Failed to send email');
      mockMailerService.sendMail.mockRejectedValue(error);

      await expect(service.sendContactEmail(mockEmailData)).rejects.toThrow(
        'Failed to send email',
      );

      expect(mockMailerService.sendMail).toHaveBeenCalled();
    });

    it('should use correct email configuration', async () => {
      mockMailerService.sendMail.mockResolvedValue({ messageId: 'test' });

      await service.sendContactEmail(mockEmailData);

      expect(mockMailerService.sendMail).toHaveBeenCalledWith({
        from: process.env.MAIL_USER,
        to: process.env.MAIL_USER,
        subject: 'New Contact Message - Edu-Flex',
        html: expect.any(String),
      });
    });

    it('should handle special characters in contact data', async () => {
      const specialCharData: SendEmailDto = {
        name: 'John <script>alert("test")</script> Doe',
        email: 'john+test@example.com',
        message: "Message with special chars: <>&\"''",
      };

      mockMailerService.sendMail.mockResolvedValue({ messageId: 'test' });

      await service.sendContactEmail(specialCharData);

      const emailCall = mockMailerService.sendMail.mock.calls[0][0];
      expect(emailCall.html).toContain(specialCharData.name);
      expect(emailCall.html).toContain(specialCharData.email);
      expect(emailCall.html).toContain(specialCharData.message);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
