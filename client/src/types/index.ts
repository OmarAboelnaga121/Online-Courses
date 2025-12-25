export interface Lesson {
  id: string;
  title: string;
  content?: string;
  videoId?: string;
  otp?: string;
  playbackInfo?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  overView: string;
  whatYouWillLearn: string;
  language: string;
  price: number;
  thumbnail: string;
  category: string;
  published: boolean;
  instructorId: string;
  studentsEnrolled: string[];
  instructor?: Instructor;
  lessons?: Lesson[];
}

export interface CreateCourse {
    title: string;
    description: string;
    overView: string;
    whatYouWillLearn: string;
    language: string;
    price: number;
    category: string;
    published: boolean;
    photo?: File;
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  courseId: string;
  status: string;
  method: string;
  userId: string;
  course?: Course;
}

export interface Statistics {
  totalSpent: number;
  totalCoursesEnrolled: number;
  totalWishlistItems: number;
  totalCoursesCreated: number;
  totalPayments: number;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  role: string;
  enrolledCourses: Course[];
  wishList: string[];
  payments: Payment[];
  myCourses: Course[];
  statistics: Statistics;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  courseId: string;
  user?: {
    name: string;
  };
  
}

export interface Instructor {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
}

export interface EmailContactBody{
  name: string;
  email: string;
  message: string;
}

export interface LessonBody {
  id: string;
  title: string;
  videoUrl: string;
  courseId: string;
}

export interface confirmPasswordBody {
  token: string;
  newPassword: string;
}