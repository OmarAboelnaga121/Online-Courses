# Edu-Flex - Online Learning Platform

A comprehensive online learning platform similar to Udemy, built with modern web technologies. Students can browse and purchase courses, while instructors can create and manage their educational content.

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **FontAwesome** - Icon library

### Backend
- **NestJS** - Progressive Node.js framework
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **Redis** - Caching and session management
- **JWT** - Authentication via HTTP-only cookies

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
│   │   ├── components/    # Reusable components
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
│   │   └── cloudinary/    # File upload service
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
- **Course Creation**: Instructors can create courses with detailed descriptions
- **Video Lessons**: Upload and stream video content via Cloudinary
- **Course Publishing**: Control course visibility
- **Categories**: Organize courses by subject matter

### Payment System
- **Stripe Integration**: Secure payment processing
- **Course Enrollment**: Automatic enrollment after successful payment
- **Payment History**: Track all transactions

### User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Authentication**: Secure JWT-based auth with HTTP-only cookies
- **Course Player**: Dedicated interface for watching lessons
- **Reviews & Ratings**: Student feedback system

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
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
STRIPE_SECRET_KEY="your-stripe-secret"
STRIPE_WEBHOOK_SECRET="your-webhook-secret"
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - User registration with file upload
- `POST /auth/login` - User login (sets HTTP-only cookie)
- `POST /auth/logout` - User logout
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset confirmation

### Courses
- `GET /courses` - Get all courses
- `GET /courses/published` - Get published courses only
- `GET /courses/:id` - Get single course details
- `POST /courses` - Create new course (instructor only)
- `PUT /courses/:id/publish` - Toggle course publish status
- `POST /courses/:id/lessons/upload` - Upload lesson videos
- `GET /courses/:id/lessons` - Get course lessons (enrolled users)
- `GET /courses/:id/reviews` - Get course reviews
- `POST /courses/:id/reviews` - Create course review

### Users
- `GET /users/profile` - Get current user profile
- `GET /users/instructor/:id` - Get instructor details

### Payments
- `POST /stripe/create-checkout-session` - Create Stripe checkout
- `POST /stripe/webhook` - Handle Stripe webhooks

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
- **Cloudinary Integration**: Automatic image/video optimization
- **Multer Middleware**: Handle multipart form data
- **Type Safety**: Proper TypeScript definitions for uploads

### Payment Processing
- **Stripe Checkout**: Secure payment flow
- **Webhook Handling**: Automatic enrollment after payment
- **Transaction Tracking**: Complete payment history

### Authentication & Security
- **JWT Tokens**: Stored in HTTP-only cookies
- **Password Hashing**: Argon2 for secure password storage
- **Rate Limiting**: Throttling for API endpoints
- **CORS Configuration**: Secure cross-origin requests

### Performance Optimizations
- **Redis Caching**: Session and data caching
- **Image Optimization**: Cloudinary transformations
- **Database Indexing**: Optimized Prisma queries
- **Code Splitting**: Next.js automatic optimization

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