import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import prisma from '../prismaClient';
import { UserDto } from '../auth/dto';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { CourseDto } from '../courses/dto';

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(private configService: ConfigService) {
        const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
        if (!stripeSecretKey) {
            throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
        }
        this.stripe = new Stripe(stripeSecretKey, {
            apiVersion: '2025-06-30.basil',
        });
    }

    async createOrderByStripe(courseId : string, user: UserDto) {
        try {      
            const course = await prisma.course.findUnique({where:{id: courseId}});
            
            if(!course){
                throw new ForbiddenException('Course not found');
            }
            
            if(user.role !== 'student'){    
                throw new ForbiddenException('User is not a student');
            }
            
            const session = await this.stripe.checkout.sessions.create({
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: `${course.title}`,
                                description: `${course.description}`,
                                images: [course.thumbnail]
                            },
                            unit_amount: Math.round(course.price * 100) // Ensure integer amount
                        },
                        quantity: 1
                    }
                ],
                mode: 'payment',
                success_url: this.configService.get<string>('FRONTEND_URL'),
                cancel_url: this.configService.get<string>('FRONTEND_URL'),
                client_reference_id: user.id,
                customer_email: user.email,
                metadata: {
                    courseId: courseId,
                    userId: user.id
                }
            });
            
            this.handlePaymentSuccess(session);

            return session;
        } catch (error) {
            console.error('Error creating Stripe session:', error);
            throw new Error(`Failed to create payment session: ${error.message}`);
        }
    }

    async handlePaymentSuccess(session: Stripe.Checkout.Session) {
        try {
            if (!session.metadata?.courseId || !session.metadata?.userId) {
                throw new Error('Missing required metadata in session');
            }

            const { courseId, userId } = session.metadata;
            const amount = session.amount_total ? session.amount_total / 100 : 0; // Convert from cents to dollars

            // Store payment in database
            const payment = await prisma.payment.create({
                data: {
                    amount: amount,
                    courseId: courseId,
                    status: 'Pay',
                    method: 'stripe',
                    user: {
                        connect: { id: userId }
                    }
                }
            });

            // Add course to user's enrolled courses
            await prisma.user.update({
                where: { id: userId },
                data: {
                    enrolledCourses: {
                        push: courseId
                    }
                }
            });

            // Add user to course's enrolled students
            await prisma.course.update({
                where: { id: courseId },
                data: {
                    studentsEnrolled: {
                        push: userId
                    }
                }
            });

            return payment;
        } catch (error) {
            console.error('Error handling payment success:', error);
            throw new Error(`Failed to process payment success: ${error.message}`);
        }
    }

    
}
