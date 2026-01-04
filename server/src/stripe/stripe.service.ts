import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import prisma from '../prismaClient';
import { UserDto } from '../auth/dto';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { CourseDto } from '../courses/dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private redisService: RedisService,
  ) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error(
        'STRIPE_SECRET_KEY is not defined in environment variables',
      );
    }
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-06-30.basil',
    });
  }

  async createOrderByStripe(courseId: string, user: UserDto) {
    try {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        throw new ForbiddenException('Course not found');
      }

      if (user.role !== 'student') {
        throw new ForbiddenException('User is not a student');
      }

      // Check if user already purchased this course
      const userWithCourses = await prisma.user.findUnique({
        where: { id: user.id },
        select: { enrolledCourses: true },
      });

      if (userWithCourses?.enrolledCourses?.includes(courseId)) {
        throw new ForbiddenException('Course already purchased');
      }

      const session = await this.stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${course.title}`,
                description: `${course.description}`,
                images: [course.thumbnail],
              },
              unit_amount: Math.round(course.price * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${this.configService.get<string>('FRONTEND_URL')}/courses/${courseId}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${this.configService.get<string>('FRONTEND_URL')}/courses/${courseId}`,
        client_reference_id: user.id,
        customer_email: user.email,
        metadata: {
          courseId: courseId,
          userId: user.id,
        },
      });

      return session;
    } catch (error) {
      console.error('Error creating Stripe session:', error);
      throw new Error(`Failed to create payment session: ${error.message}`);
    }
  }

  constructEvent(payload: any, signature: string) {
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
    }
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  }

  async handlePaymentSuccess(session: Stripe.Checkout.Session) {
    try {
      if (!session.metadata?.courseId || !session.metadata?.userId) {
        throw new Error('Missing required metadata in session');
      }

      const { courseId, userId } = session.metadata;
      const amount = session.amount_total ? session.amount_total / 100 : 0;

      // Check if payment already exists to avoid duplicates
      const existingPayment = await prisma.payment.findFirst({
        where: {
          userId: userId,
          courseId: courseId,
        },
      });

      if (existingPayment) {
        console.log('Payment already processed');
        return existingPayment;
      }

      // Store payment in database
      const payment = await prisma.payment.create({
        data: {
          amount: amount,
          courseId: courseId,
          status: 'Pay',
          method: 'stripe',
          user: {
            connect: { id: userId },
          },
        },
      });

      // Add course to user's enrolled courses
      await prisma.user.update({
        where: { id: userId },
        data: {
          enrolledCourses: {
            push: courseId,
          },
        },
      });

      // Add user to course's enrolled students
      await prisma.course.update({
        where: { id: courseId },
        data: {
          studentsEnrolled: {
            push: userId,
          },
        },
      });

      // Invalidate user's comprehensive profile cache
      await this.redisService.del(`user:${userId}:comprehensive`);

      return payment;
    } catch (error) {
      console.error('Error handling payment success:', error);
      throw new Error(`Failed to process payment success: ${error.message}`);
    }
  }

  async verifySession(sessionId: string) {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      
      if (session.payment_status === 'paid') {
        await this.handlePaymentSuccess(session);
        return { success: true, session };
      }
      
      return { success: false, session };
    } catch (error) {
      console.error('Error verifying session:', error);
      throw new Error(`Failed to verify session: ${error.message}`);
    }
  }

  async getPayments(user: UserDto) {
    try {
      if (user.role !== 'admin') {
        throw new ForbiddenException('User is not an admin');
      }
      const payments = await prisma.payment.findMany();
      return payments;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw new Error(`Failed to fetch payments: ${error.message}`);
    }
  }
}
