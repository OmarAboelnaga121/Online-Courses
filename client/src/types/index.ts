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
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
  enrolledCourses?: Course[];
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