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
      console.log('Fetching course:', `${API_BASE_URL}/courses/${id}`);
      const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
        credentials: 'include'
      });
      console.log('Course response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Course fetch error:', errorText);
        throw new Error(`Failed to fetch course: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Course fetch exception:', error);
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
      console.log('Fetching instructor:', `${API_BASE_URL}/users/instructor/${instructorId}`);
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
    } catch (error) {
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
    } catch (error) {
      console.error('Create course error:', error);
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
    } catch (error) {
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
    } catch (error) {
      throw new Error('Failed to change password');
    }
  }
}

export const apiService = new ApiService();