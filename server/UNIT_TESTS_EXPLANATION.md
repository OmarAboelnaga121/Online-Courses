# Unit Tests Explanation

This document explains what each unit test expects and validates in the Edu-Flex server application.

## 1. AuthService Tests (`auth.service.spec.ts`)

### `register` method tests:
- **Should register a new user successfully**: Expects successful user registration with photo upload, password hashing, and returning user data without password
- **Should throw error if username is taken**: Expects BadRequestException when attempting to register with existing username
- **Should throw error if email is taken**: Expects BadRequestException when attempting to register with existing email
- **Should throw error if photo is not provided**: Expects BadRequestException when photo is missing (required field)

### `login` method tests:
- **Should login user successfully**: Expects successful authentication with valid credentials, password verification, and JWT token generation
- **Should throw error if user not found**: Expects BadRequestException when email doesn't exist
- **Should throw error if password is invalid**: Expects BadRequestException when password verification fails

### `resetPassword` method tests:
- **Should send reset password email successfully**: Expects password reset token generation, database update, and email sending
- **Should throw error if user not found**: Expects error when email doesn't exist in database

### `updatePassword` method tests:
- **Should update password successfully**: Expects password update with valid token, password hashing, and token cleanup
- **Should throw error if token is invalid**: Expects error when reset token doesn't exist
- **Should throw error if token is expired**: Expects error when reset token has expired

### `generateJwtToken` method tests:
- **Should generate JWT token successfully**: Expects JWT token creation with correct payload structure

## 2. CoursesService Tests (`courses.service.spec.ts`)

### `getCourses` method tests:
- **Should return cached courses if available**: Expects Redis cache retrieval without database query
- **Should fetch from database and cache if not in cache**: Expects database query and Redis caching when cache miss

### `createCourses` method tests:
- **Should create course successfully**: Expects photo upload, course creation, and cache invalidation
- **Should throw error if photo is not provided**: Expects BadRequestException when photo is missing
- **Should throw error if user is not instructor**: Expects BadRequestException when non-instructor tries to create course
- **Should throw error if photo upload fails**: Expects BadRequestException when Cloudinary upload fails

### `getSingleCourse` method tests:
- **Should return cached course if available**: Expects Redis cache retrieval for individual course
- **Should fetch from database and cache if not in cache**: Expects database query and caching for course details
- **Should throw error if course not found**: Expects BadRequestException when course doesn't exist

### `updateCourseStatus` method tests:
- **Should update course status successfully**: Expects admin-only course publish/unpublish functionality
- **Should throw error if course not found**: Expects BadRequestException for non-existent course
- **Should throw error if user is not admin**: Expects ForbiddenException when non-admin tries to update status

### `putLessons` method tests:
- **Should upload lessons successfully**: Expects video upload, lesson creation, and course update
- **Should throw error if course not found**: Expects BadRequestException for invalid course
- **Should throw error if user is not course instructor**: Expects authorization validation
- **Should throw error if lessons and videos count mismatch**: Expects validation of lesson-video pairing

### `createCourseReview` method tests:
- **Should create review successfully**: Expects review creation with validation checks
- **Should throw error if course not found**: Expects BadRequestException for invalid course
- **Should throw error if user already reviewed**: Expects duplicate review prevention
- **Should throw error if user is not student**: Expects role-based access control

## 3. UsersService Tests (`users.service.spec.ts`)

### `updateUserProfile` method tests:
- **Should update user profile successfully**: Expects profile update with photo upload and cache invalidation
- **Should update profile without photo**: Expects profile update without photo upload
- **Should throw error if username is already taken**: Expects username uniqueness validation
- **Should allow same user to keep their username**: Expects self-update permission
- **Should throw error if photo upload fails**: Expects error handling for upload failures
- **Should invalidate instructor cache for instructor users**: Expects cache management for instructor profiles

### `getInstructorProfile` method tests:
- **Should return cached instructor profile if available**: Expects Redis cache retrieval
- **Should fetch from database and cache if not in cache**: Expects database query and caching
- **Should throw error if instructor not found**: Expects BadRequestException for invalid instructor
- **Should throw error if user is not instructor**: Expects role validation

### `getComprehensiveUserProfile` method tests:
- **Should return cached comprehensive profile if available**: Expects complete user data from cache
- **Should fetch comprehensive data from database if not cached**: Expects complex data aggregation with relationships
- **Should throw error if user not found**: Expects BadRequestException for invalid user
- **Should cache the comprehensive profile after fetching**: Expects caching of aggregated data

## 4. StripeService Tests (`stripe.service.spec.ts`)

### Constructor tests:
- **Should throw error if STRIPE_SECRET_KEY is not defined**: Expects environment variable validation

### `createOrderByStripe` method tests:
- **Should create Stripe checkout session successfully**: Expects payment session creation with course details
- **Should throw error if course not found**: Expects ForbiddenException for invalid course
- **Should throw error if user is not a student**: Expects role-based access control
- **Should throw error if course already purchased**: Expects duplicate purchase prevention
- **Should handle Stripe API errors**: Expects error handling for external API failures

### `handlePaymentSuccess` method tests:
- **Should handle payment success successfully**: Expects payment recording and enrollment processing
- **Should throw error if metadata is missing**: Expects session metadata validation
- **Should handle database errors**: Expects error handling for database operations
- **Should handle session with zero amount**: Expects edge case handling for free courses
- **Should handle session with null amount_total**: Expects null value handling

## 5. RedisService Tests (`redis.service.spec.ts`)

### Constructor tests:
- **Should create Redis client with default URL if not provided**: Expects fallback configuration
- **Should create Redis client with provided URL**: Expects custom configuration
- **Should set up error handler**: Expects error event handling

### Connection lifecycle tests:
- **Should connect to Redis client**: Expects successful connection establishment
- **Should quit Redis client**: Expects graceful connection termination
- **Should handle connection/quit errors**: Expects error handling for connection issues

### Data operation tests:
- **Should set value without TTL**: Expects basic key-value storage
- **Should set value with TTL**: Expects expiring key-value storage
- **Should get value successfully**: Expects key retrieval
- **Should delete key successfully**: Expects key deletion
- **Should flush all keys successfully**: Expects database clearing
- **Should delete keys by pattern successfully**: Expects pattern-based deletion

## 6. CloudinaryService Tests (`cloudinary.service.spec.ts`)

### `uploadFile` method tests:
- **Should upload file successfully**: Expects image upload with stream processing
- **Should handle upload errors**: Expects error handling for upload failures
- **Should handle no result from Cloudinary**: Expects validation of upload response
- **Should create read stream from file buffer**: Expects proper stream handling

### `uploadVideoFile` method tests:
- **Should upload video file successfully**: Expects video upload with correct resource type
- **Should handle video upload errors**: Expects error handling for video uploads
- **Should set correct resource type for video uploads**: Expects video-specific configuration
- **Should create read stream from video file buffer**: Expects proper video stream handling

## 7. ContactService Tests (`contact.service.spec.ts`)

### `sendContactEmail` method tests:
- **Should send contact email successfully**: Expects email sending with contact form data
- **Should include all contact details in email HTML**: Expects proper email template rendering
- **Should handle mailer service errors**: Expects error handling for email failures
- **Should use correct email configuration**: Expects proper email routing and formatting
- **Should handle special characters in contact data**: Expects XSS prevention and data sanitization

## Test Coverage Summary

Each service test suite covers:
- **Happy path scenarios**: Normal operation with valid inputs
- **Error handling**: Invalid inputs, missing data, and external service failures
- **Authorization**: Role-based access control and user permissions
- **Data validation**: Input validation and business rule enforcement
- **Caching**: Redis cache operations and invalidation
- **External integrations**: Cloudinary uploads, Stripe payments, email sending
- **Edge cases**: Null values, empty data, and boundary conditions

All tests use mocking to isolate units under test and avoid external dependencies during testing.