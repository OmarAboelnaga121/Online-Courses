import { Body, Controller, Get, HttpException, HttpStatus, Logger, Post, Headers, Req, RawBodyRequest, BadRequestException, UseGuards } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Stripe } from 'stripe';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/decorators/user.decorator';
import { UserDto } from 'src/auth/dto';
import { CreateCheckoutSessionDto } from './dto/order.dto';

@ApiTags('stripe')
@Controller('stripe')
export class StripeController {
    private readonly logger = new Logger(StripeController.name);
    constructor(private readonly stripeService: StripeService) {}

    @Post('create-checkout-session')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a Stripe checkout session' })
    @ApiResponse({ status: 201, description: 'Checkout session created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiBody({ type: CreateCheckoutSessionDto })
    async createCheckoutSession(@Body() body: CreateCheckoutSessionDto, @User() user: UserDto) {
        try {
            const session = await this.stripeService.createOrderByStripe(body.courseId, user);
            return {
                success: true,
                sessionId: session.id,
                url: session.url
            };
        } catch (error) {
            return new BadRequestException(`Failed to create checkout session: ${error.message}`);
        }
    }
}