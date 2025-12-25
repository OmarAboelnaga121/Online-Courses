import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Headers,
  Req,
  RawBodyRequest,
  BadRequestException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { StripeService } from './stripe.service';
import { Stripe } from 'stripe';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/decorators/user.decorator';
import { UserDto } from '../auth/dto';
import { CreateCheckoutSessionDto } from './dto/order.dto';

@ApiTags('stripe')
@Controller('Stripe')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class StripeController {
  private readonly logger = new Logger(StripeController.name);
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout-session')
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Create a Stripe checkout session' })
  @ApiResponse({
    status: 201,
    description: 'Checkout session created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateCheckoutSessionDto })
  async createCheckoutSession(
    @Body() body: CreateCheckoutSessionDto,
    @User() user: UserDto,
  ) {
    try {
      const session = await this.stripeService.createOrderByStripe(
        body.courseId,
        user,
      );
      return {
        success: true,
        sessionId: session.id,
        url: session.url,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to create checkout session: ${error.message}`,
      );
    }
  }

  @Get('get-payments')
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getPayments(@User() user: UserDto) {
    try {
      const payments = await this.stripeService.getPayments(user);
      return payments;
    } catch (error) {
      throw new BadRequestException(`Failed to get payments: ${error.message}`);
    }
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Handle Stripe webhook events' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: RawBodyRequest<Request>,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    try {
      const event = this.stripeService.constructEvent(
        request.rawBody,
        signature,
      );

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        await this.stripeService.handlePaymentSuccess(session);
      }

      return { received: true };
    } catch (error) {
      this.logger.error(`Webhook error: ${error.message}`);
      throw new BadRequestException(`Webhook Error: ${error.message}`);
    }
  }
}
