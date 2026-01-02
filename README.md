# Edu-Flex - Online Learning Platform

A comprehensive online learning platform similar to Udemy, built with modern web technologies. Students can browse and purchase courses, while instructors can create and manage their educational content.

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React version
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **FontAwesome** - Icon library
- **Next Cloudinary** - Cloudinary integration for Next.js
- **VdoCipher** - Secure video streaming

### Backend
- **NestJS** - Progressive Node.js framework
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **Redis** - Caching and session management
- **JWT** - Authentication via HTTP-only cookies
- **Nodemailer** - Email service integration
- **Argon2** - Password hashing
- **Helmet** - Security middleware
- **Compression** - Response compression
- **Throttler** - Rate limiting

### Cloud Services
- **Cloudinary** - Media storage and optimization
- **Stripe** - Payment processing

### DevOps
- **Docker** - Containerization
- **Jest** - Testing framework

## 📁 Project Structure

```
Edu-Flex/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   │   ├── about/     # About page
│   │   │   ├── contact/   # Contact form
│   │   │   ├── privacy/   # Privacy policy
│   │   │   ├── terms/     # Terms & conditions
│   │   │   ├── dashboard/ # User dashboards (student/instructor/admin)
│   │   │   └── course-player/ # Video player interface
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts (Auth)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service layer
│   │   └── types/         # TypeScript definitions
│   └── package.json
├── server/                # NestJS backend
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── courses/       # Course management
│   │   ├── users/         # User management
│   │   ├── stripe/        # Payment processing
│   │   ├── cloudinary/    # File upload service
│   │   ├── contact/       # Contact form & email service
│   │   ├── redis/         # Redis caching service
│   │   └── shared/        # Shared modules (mail)
│   ├── prisma/            # Database schema & migrations
│   └── package.json
└── docker-compose.yml     # Development environment
```

## 👥 User Roles

### Students
- Browse and search courses
- Purchase courses via Stripe
- Access enrolled course content
- Leave reviews and ratings
- Track learning progress

### Instructors
- Create and manage courses
- Upload course thumbnails and lesson videos
- Publish/unpublish courses
- View course analytics

### Administrators
- Manage all users and courses
- System-wide analytics
- Content moderation

## 🎯 Core Features

### Course Management
- **Course Creation**: Instructors can create courses with detailed descriptions, overview, and learning outcomes
- **Video Lessons**: Upload and stream video content via Cloudinary with secure delivery
- **Lesson Management**: Add, view, and delete individual lessons with video uploads
- **Course Publishing**: Toggle course visibility (published/unpublished)
- **Categories**: Organize courses by subject matter (Programming, Marketing, Designing, Business, Photography)
- **Multi-Language Support**: Courses available in English, Spanish, French, and German
- **Course Filtering**: Filter by category, language, and price range
- **Featured Courses**: Homepage showcase of top courses
- **Course Thumbnails**: Upload custom course images

### Payment System
- **Stripe Integration**: Secure payment processing
- **Course Enrollment**: Automatic enrollment after successful payment
- **Payment History**: Track all transactions

### User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS 4 and adaptive layouts
- **Authentication**: Secure JWT-based auth with HTTP-only cookies
- **Password Recovery**: Forgot password and reset password functionality via email
- **Course Player**: Dedicated interface for watching lessons with video streaming
- **Reviews & Ratings**: Student feedback system with average rating calculation
- **Contact Form**: Direct communication with support team via email integration
- **Legal Pages**: Comprehensive privacy policy and terms of service with smooth scrolling navigation
- **Context API**: Global state management for authentication (AuthContext)
- **Custom Hooks**: useAuth and useCourse hooks for reusable logic
- **Role-Based Dashboards**: Separate interfaces for students, instructors, and admins
- **Mobile Navigation**: Hamburger menu with smooth transitions
- **Loading States**: Loading spinners and error messages for better UX
- **Enrollment Status**: Visual indicators for enrolled courses
- **Testimonials**: Student testimonials on homepage
- **Social Media Links**: Footer integration with Facebook, Twitter, LinkedIn, Instagram

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd Edu-Flex
```

2. **Build Docker images first**
```bash
# Build the server Docker image
docker build -t eduflex-server ./server

# Or build all services
docker-compose build
```

3. **Start services with Docker**
```bash
docker-compose up -d
```
This starts:
- PostgreSQL (port 5432)
- Redis (port 6379)
- Backend API (port 3000)
- Prisma Studio (port 5555)

4. **Frontend Setup (Local Development)**
```bash
cd client
npm install
cp .env.local.example .env.local  # Configure environment variables
npm run dev
```

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/eduflex"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-jwt-secret"
MAIL_HOST="smtp.gmail.com"
MAIL_USER="your-email@gmail.com"
MAIL_PASS="your-app-password"
CLOUDINARY_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
STRIPE_API_KEY="your-stripe-publishable-key"
STRIPE_SECRET_KEY="your-stripe-secret"
STRIPE_WEBHOOK_SECRET="your-webhook-secret"
FRONTEND_URL="https://your-frontend-url.com"
FRONTEND_URL_DEV="http://localhost:3001"
BACKEND_URL="https://your-backend-url.com"
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL_DEV="http://localhost:3000"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - User registration with avatar upload
- `POST /auth/login` - User login (sets HTTP-only cookie)
- `POST /auth/logout` - User logout
- `POST /auth/forgot-password` - Password reset request (sends email with token)
- `POST /auth/reset-password` - Password reset confirmation with token

### Courses
- `GET /courses` - Get all courses
- `GET /courses/published` - Get published courses only
- `GET /courses/:id` - Get single course details
- `POST /courses` - Create new course with thumbnail (instructor only)
- `PUT /courses/:id/publish` - Toggle course publish status
- `POST /courses/:id/lessons/upload` - Upload multiple lesson videos with titles
- `GET /courses/:id/lessons` - Get course lessons (enrolled users only)
- `DELETE /courses/:id/lessons/:lessonId` - Delete a lesson (instructor only)
- `GET /courses/:id/reviews` - Get course reviews
- `POST /courses/:id/reviews` - Create course review (enrolled users)
- `GET /courses/instructor/:instructorId/reviews` - Get all reviews for instructor's courses

### Users
- `GET /users/profile` - Get comprehensive user profile with enrolled courses, wishlist, payments, and statistics
- `PUT /users/profile` - Update user profile (name, username, avatar)
- `GET /users/instructor/:id` - Get instructor profile with courses
- `GET /users` - Get all users (admin only)

### Payments
- `POST /stripe/create-checkout-session` - Create Stripe checkout session for course purchase
- `GET /stripe/get-payments` - Get all payments for current user
- `POST /stripe/webhook` - Handle Stripe webhooks for payment confirmation

### Contact
- `POST /contact` - Send contact form email

## 🗄️ Database Schema

### Core Models
- **User**: Authentication and profile data
- **Course**: Course information and metadata
- **Lesson**: Individual video lessons
- **Payment**: Transaction records
- **Review**: Course ratings and comments

### Key Relationships
- Users can enroll in multiple courses
- Instructors can create multiple courses
- Courses contain multiple lessons
- Users can leave reviews for enrolled courses

## 🧪 Testing

### Backend Testing
```bash
cd server
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:cov      # Coverage report
```

## 🚀 Deployment

### Production Build
```bash
# Build Docker images
docker-compose build

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Production Build
```bash
# Backend
cd server
npm run build
npm run start:prod

# Frontend
cd client
npm run build
npm start
```

## 📊 Key Features Implementation

### File Upload System
- **Cloudinary Integration**: Automatic image/video optimization and storage
- **Multer Middleware**: Handle multipart form data for file uploads
- **Type Safety**: Proper TypeScript definitions for uploads
- **Multiple File Upload**: Support for uploading multiple lesson videos simultaneously
- **Avatar Upload**: User profile picture upload and management
- **Course Thumbnails**: Custom thumbnail images for courses

### Payment Processing
- **Stripe Checkout**: Secure payment flow
- **Webhook Handling**: Automatic enrollment after payment
- **Transaction Tracking**: Complete payment history

### Authentication & Security
- **JWT Tokens**: Stored in HTTP-only cookies
- **Password Hashing**: Argon2 for secure password storage
- **Rate Limiting**: Throttling for API endpoints via @nestjs/throttler
- **CORS Configuration**: Secure cross-origin requests
- **Helmet Integration**: Security headers middleware
- **Password Reset**: Email-based password recovery system
- **Context-Based Auth**: React Context API for global authentication state

### Performance Optimizations
- **Redis Caching**: Session and data caching with IORedis
- **Image Optimization**: Cloudinary transformations and Next Cloudinary integration
- **Database Indexing**: Optimized Prisma queries with proper relationships
- **Code Splitting**: Next.js automatic optimization
- **Response Compression**: Gzip compression middleware
- **Docker Optimization**: Multi-stage builds and resource limits (10GB memory limit)
- **Server-Side Rendering**: Next.js 15 App Router with async components
- **API Response Caching**: No-store cache policy for real-time data

## 📧 Contact & Support

### Contact Form
Users can reach out through the built-in contact form at `/contact`, which sends emails directly to the support team via Nodemailer integration.

### Legal Information
- **Privacy Policy**: Available at `/privacy` - Interactive page with table of contents, details on data collection, usage, cookies, security, and user rights
- **Terms & Conditions**: Available at `/terms` - Comprehensive 17-section legal document covering eligibility, account registration, payments, refunds, intellectual property, and more

### Support Channels
- Email: omaraboelnaga121@gmail.com
- Contact Form: Available on the website


## 🎨 Additional Features

### About Page
Comprehensive information about EduFlex including:
- Platform mission and vision
- Team member profiles with photos and bios
- Feature highlights (4 key features)
- Why choose EduFlex section (4 reasons)
- Call-to-action sections
- Responsive grid layouts

### Dashboard System
Role-based dashboards for different user types:
- **Student Dashboard**: 
  - Overview with enrolled courses
  - Profile management with avatar upload
  - Course progress tracking
  - Payment history
- **Instructor Dashboard**: 
  - Course creation wizard with thumbnail upload
  - Lesson management (add/delete lessons with videos)
  - Course publishing controls
  - Profile settings
  - Analytics and reviews
- **Admin Dashboard**: 
  - User management (view all users)
  - Course moderation (all courses)
  - Payment tracking (all transactions)
  - System-wide analytics

### Email Service
Integrated Nodemailer with Gmail SMTP for:
- Contact form submissions with custom templates
- Password reset emails with secure tokens
- Account notifications
- Course enrollment confirmations

### UI Components
- **Navbar**: Responsive navigation with mobile hamburger menu, user avatar display, and role-based links
- **Footer**: Social media links (Facebook, Twitter, LinkedIn, Instagram), legal page links, copyright notice
- **Loading Spinner**: Reusable loading component for async operations
- **Error Message**: Consistent error display component
- **Modal Dialogs**: Interactive modals for lesson creation
- **Form Validation**: Client-side validation with error messages

### Homepage Features
- **Hero Section**: Large banner with call-to-action
- **Category Filters**: Quick navigation to course categories
- **Featured Courses**: Top 3 courses showcase with images and pricing
- **Testimonials Section**: Student reviews with photos (3 testimonials)
- **Responsive Grid Layouts**: Mobile, tablet, and desktop optimized

### Course Features
- **Course Details Page**: Full course information with instructor profile, reviews, and enrollment button
- **Course Filtering**: Filter by category, language, and price range with real-time updates
- **Enrollment Indicators**: Visual badges showing enrollment status
- **Average Rating Display**: Calculated from all course reviews
- **Instructor Profile**: Dedicated instructor page with all their courses
- **Wishlist System**: Save courses for later (database schema ready)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

Copyright © 2025 Omar Aboelnaga. All rights reserved.

### Usage Permissions & Restrictions
- This project is for educational and portfolio purposes only
- Commercial use is strictly prohibited without explicit written permission
- Code may be viewed and studied for learning purposes
- Redistribution or modification is not permitted
- Any reference to this work must include proper attribution to Omar Aboelnaga

### Terms of Use
- This software is provided "as is" without warranty of any kind
- The author is not liable for any damages arising from the use of this software
- For licensing inquiries or permission requests, please contact the author

---

**Note**: This is a learning platform project. Ensure all environment variables are properly configured and Docker images are built before running in production.