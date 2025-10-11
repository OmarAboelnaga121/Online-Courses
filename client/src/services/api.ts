import { Course, UserProfile, Review, Instructor, EmailContactBody } from '@/types';

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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
        const errorText = await response.text();
        throw new Error(`Failed to fetch instructor: ${response.status}`);
      }
      return response.json();
    } catch (error) {
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
    } catch (error) {
      throw new Error('Failed to initiate checkout');
    }
  }

  async contact(emailBody : EmailContactBody)  {
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailBody)
      });

      if(!response.ok) {
        throw new Error('Failed to contact support');
      }

      return response.json();

    } catch (error) {
      throw new Error('Failed to contact support');
    }
  }
}

export const apiService = new ApiService();