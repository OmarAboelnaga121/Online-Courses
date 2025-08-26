"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type Course = {
    id: string
    title: string
    description: string
    overView: string
    whatYouWillLearn: string
    language: string
    price: number
    thumbnail: string
    category: string
    published: boolean
    instructorId: string
    studentsEnrolled: string[]
}

type UserProfile = {
    id: string
    name: string
    email: string
    enrolledCourses: string[]
    role: string
}

type Review = {
    id: string
    userId: string
    rating: number
    comment: string
    date: string
    courseId: string
}



export default function SingleCourse() {
    const params = useParams();
    const courseId = params.id as string;

    const [course, setCourse] = useState<Course | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [activeTab, setActiveTab] = useState('overview');

    const getCourseDetails = async() => {
        try {
            const response = await fetch(`http://localhost:3000/courses/${courseId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch course details");
            }
            const data = await response.json();
            setCourse(data)
        } catch (error) {
            setCourse(null);
        }
    }

    const getReviews = async() => {
        try {
            const response = await fetch(`http://localhost:3000/courses/${courseId}/reviews`);
            if (response.ok) {
                const data = await response.json();
                setReviews(data);
            }
        } catch (error) {
            console.error('Failed to fetch reviews');
        }
    }

    const getAverageRating = () => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    }

    useEffect(() => {
        getCourseDetails();
        getReviews();
    }, [courseId]);

    return (
        <div className="min-h-screen w-full">
            {
                course !== null ? 
                <div className="flex h-screen w-full px-10">
                    <div className="w-1/2 flex flex-col p-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{course.title}</h2>
                            <p className="text-gray-600 mb-6">{course.description}</p>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-yellow-500 text-xl">★</span>
                            <span className="font-semibold">{getAverageRating()}</span>
                            <span className="text-gray-500">({reviews.length} reviews)</span>
                        </div>
                       
                        <ul className="flex gap-6 mb-6">
                            <li 
                                className={`cursor-pointer pb-2 ${activeTab === 'overview' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                Overview
                            </li>
                            <li 
                                className={`cursor-pointer pb-2 ${activeTab === 'learn' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                                onClick={() => setActiveTab('learn')}
                            >
                                What You Will Learn
                            </li>
                            <li 
                                className={`cursor-pointer pb-2 ${activeTab === 'review' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                                onClick={() => setActiveTab('review')}
                            >
                                Review
                            </li>
                        </ul>
                        <div className="flex flex-col gap-5">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Overview</h2>
                                <p>{course.overView}</p>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-5">What you'll learn</h2>
                                <ul className="flex flex-col gap-5">
                                    {course.whatYouWillLearn.split(',').map((item, index) => (
                                        <li key={index} className="flex items-center gap-3 mx-5">
                                            <input 
                                                type="checkbox" 
                                                disabled 
                                                aria-label={`Learning objective: ${item.trim()}`}
                                                className="w-5 h-5 text-green-600 bg-green-100 border-green-300 rounded focus:ring-green-500"
                                            />
                                            <span className="text-gray-700">{item.trim()}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                        </div>
                    </div>  
                    <div className="w-1/2 gap-10 flex flex-col items-end justify-start m-8">
                        <div className="w-[300px] gap-10 flex flex-col">
                            <Image 
                                src={course.thumbnail} 
                                alt={course.title} 
                                width={300} 
                                height={200} 
                                className="object-cover"
                            />
                            <Link 
                                href={`/checkout/${course.id}`} 
                                className="primaryBtn w-full block"
                            >
                                Enroll Now
                            </Link>
                        </div>
                    </div>
                </div>
                :
                <div className="min-h-screen flex items-center justify-center">
                    <div className=" text-center p-8 bg-white rounded-lg shadow-md max-w-md mx-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Unavailable</h2>
                        <p className="text-gray-600 mb-6">Sorry, this course is currently not available or may have been removed.</p>
                        <Link 
                            href="/courses" 
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Browse All Courses
                        </Link>
                    </div>
                </div>
            }
        </div>
    );
}
