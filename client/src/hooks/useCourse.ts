import { useState, useEffect } from 'react';
import { Course, Review, Instructor } from '@/types';
import { apiService } from '@/services/api';

export const useCourse = (courseId: string) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const [courseData, reviewsData] = await Promise.all([
          apiService.getCourseById(courseId),
          apiService.getCourseReviews(courseId)
        ]);
        
        setCourse(courseData);
        setReviews(reviewsData);
        
        if (courseData.instructorId) {
          const instructorData = await apiService.getInstructor(courseData.instructorId);
          setInstructor(instructorData);
        }
      } catch (err) {
        console.error('Course data fetch error:', err);
        setError('Failed to load course data');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return { course, reviews, instructor, loading, error, getAverageRating };
};