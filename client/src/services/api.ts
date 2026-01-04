import { Course, UserProfile, Review, Instructor, EmailContactBody, CreateCourse, confirmPasswordBody } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class ApiService {
  async getCourses(): Promise<Course[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses`, {
        credentials: 'include',
        cache: 'no-store'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      return response.json();
    } catch {
      throw new Error('Failed to fetch courses');
    }
  }

  async getPublishedCourses(): Promise<Course[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/published`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch published courses');
      }
      return response.json();
    } catch {
      throw new Error('Failed to fetch published courses');
    }
  }

  async getCourseById(id: string): Promise<Course> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        await response.text();
        throw new Error(`Failed to fetch course: ${response.status}`);
      }
      return response.json();
    } catch {
      throw new Error('Failed to fetch course details');
    }
  }

  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        credentials: 'include'
      });
      if (!response.ok) {
        return null;
      }
      return response.json();
    } catch {
      return null;
    }
  }

  async getCourseReviews(courseId: string): Promise<Review[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/reviews`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch course reviews');
      }
      return response.json();
    } catch {
      throw new Error('Failed to fetch course reviews');
    }
  }

  async getInstructor(instructorId: string): Promise<Instructor> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/instructor/${instructorId}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        await response.text();
        throw new Error(`Failed to fetch instructor: ${response.status}`);
      }
      return response.json();
    } catch {
      throw new Error('Failed to fetch instructor details');
    }
  }

  async initiateCheckout(courseId: string): Promise<{ url: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/stripe/create-checkout-session`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
      });
      if (!response.ok) {
        throw new Error('Failed to initiate checkout');
      }
      return response.json();
    } catch {
      throw new Error('Failed to initiate checkout');
    }
  }

  async contact(emailBody: EmailContactBody) {
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailBody)
      });

      if (!response.ok) {
        throw new Error('Failed to contact support');
      }

      return response.json();

    } catch {
      throw new Error('Failed to contact support');
    }
  }

  async getCourseLessons(courseId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/lessons`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch course lessons');
      }
      return response.json();
    } catch {
      throw new Error('Failed to fetch course lessons');
    }
  }

  async logOut() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to log out');
      }
      return response.json();
    } catch {
      throw new Error('Failed to log out');
    }
  }

  async getInstructorReviews(instructorId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/instructor/${instructorId}/reviews`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed To get Instructor Review');
      }

      return response.json();
    } catch {
      throw new Error('Failed To get Instructor Review');
    }
  }

  async createCourse(courseData: CreateCourse) {
    try {
      const formData = new FormData();
      formData.append('title', courseData.title);
      formData.append('description', courseData.description);
      formData.append('overView', courseData.overView);
      formData.append('whatYouWillLearn', courseData.whatYouWillLearn);
      formData.append('language', courseData.language);
      formData.append('price', courseData.price.toString());
      formData.append('category', courseData.category);
      formData.append('published', courseData.published.toString());

      if (courseData.photo) {
        formData.append('photo', courseData.photo);
      }

      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }

      return response.json();
    } catch {
      throw new Error('Failed to create course');
    }
  }

  async forgetPassword(data: { email: string }) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }

      return response.json();
    } catch {
      throw new Error('Failed to send mail');
    }
  }

  async confirmPassword(confirmPassword: confirmPasswordBody) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(confirmPassword)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }

      return response.json();
    } catch {
      throw new Error('Failed to change password');
    }
  }

  async createLessons(courseId: string, lessons: { title: string }[], videos: File[]) {
    try {
      const formData = new FormData();

      // Add lessons as JSON string
      formData.append('lessons', JSON.stringify(lessons.map(lesson => ({
        title: lesson.title,
        courseId: courseId
      }))));

      // Add video files - order must match lessons array
      videos.forEach((video) => {
        formData.append('videos', video);
      });
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/lessons/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }

      return response.json();
    } catch {
      throw new Error('Failed to create lessons');
    }
  }

  async deleteLesson(lessonId: string, courseId : string) {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/lessons/${lessonId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }

      return response.json();
    } catch {
      throw new Error('Failed to delete lesson');
    }
  }

  async getPayments() {
    try {
      const response = await fetch(`${API_BASE_URL}/Stripe/get-payments`, {
        method: 'GET',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }
      return response.json();
    } catch (error) {
      console.error('Get payments error:', error);
      throw new Error('Failed to get payments');
    }
  }

  async getUser() {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      return response.json();
    } catch (error) {
      console.error('Get user error:', error);
      throw new Error('Failed to get user');
    }
  }

  async updateCourseStatus(courseId: string, status: boolean) {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/publish`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "published": status })
      });
      if (!response.ok) {
        throw new Error('Failed to update course status');
      }
      return response.json();
    } catch (error) {
      console.error('Update course status error:', error);
      throw new Error('Failed to update course status');
    }
  }

  async verifySession(sessionId: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/Stripe/verify-session`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });
    if (!response.ok) {
      throw new Error('Failed to verify session');
    }
    return response.json();
  }
}

export const apiService = new ApiService();