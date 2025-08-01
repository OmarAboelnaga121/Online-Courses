import { Test, TestingModule } from '@nestjs/testing';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { CreateCheckoutSessionDto } from './dto/order.dto';
import { UserDto } from '../auth/dto';
import { BadRequestException } from '@nestjs/common';

describe('StripeController', () => {
  let controller: StripeController;
  let stripeService: StripeService;

  const mockStripeService = {
    createOrderByStripe: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StripeController],
      providers: [
        {
          provide: StripeService,
          useValue: mockStripeService,
        },
      ],
    }).compile();

    controller = module.get<StripeController>(StripeController);
    stripeService = module.get<StripeService>(StripeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCheckoutSession', () => {
    const mockUser: UserDto = {
      id: 'user-123',
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      avatarUrl: 'https://example.com/avatar.jpg',
      role: 'student',
    };

    const mockBody: CreateCheckoutSessionDto = {
      courseId: 'course-123',
    };

    const mockStripeSession = {
      id: 'cs_test_123456789',
      url: 'https://checkout.stripe.com/pay/cs_test_123456789',
      amount_total: 4999,
      currency: 'usd',
      status: 'open',
    };

    it('should create a checkout session successfully', async () => {
      mockStripeService.createOrderByStripe.mockResolvedValue(mockStripeSession);

      const result = await controller.createCheckoutSession(mockBody, mockUser);

      expect(stripeService.createOrderByStripe).toHaveBeenCalledWith(
        mockBody.courseId,
        mockUser
      );
      expect(result).toEqual({
        success: true,
        sessionId: mockStripeSession.id,
        url: mockStripeSession.url,
      });
    });

    it('should handle service errors and return BadRequestException', async () => {
      const errorMessage = 'Course not found';
      mockStripeService.createOrderByStripe.mockRejectedValue(new Error(errorMessage));

      const result = await controller.createCheckoutSession(mockBody, mockUser);

      expect(stripeService.createOrderByStripe).toHaveBeenCalledWith(
        mockBody.courseId,
        mockUser
      );
      expect(result).toBeInstanceOf(BadRequestException);
      expect((result as BadRequestException).message).toBe(`Failed to create checkout session: ${errorMessage}`);
    });

    it('should log request details for debugging', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      mockStripeService.createOrderByStripe.mockResolvedValue(mockStripeSession);

      await controller.createCheckoutSession(mockBody, mockUser);

      expect(consoleSpy).toHaveBeenCalledWith('Received body:', mockBody);
      expect(consoleSpy).toHaveBeenCalledWith('CourseId type:', 'string');
      expect(consoleSpy).toHaveBeenCalledWith('CourseId value:', mockBody.courseId);

      consoleSpy.mockRestore();
    });
  });

  describe('controller initialization', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should have logger instance', () => {
      expect(controller['logger']).toBeDefined();
    });

    it('should have stripe service injected', () => {
      expect(stripeService).toBeDefined();
    });
  });
});
