"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from '@/hooks/useAuth';
import { useCourse } from '@/hooks/useCourse';
import { apiService } from '@/services/api';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import ErrorMessage from '@/app/components/ui/ErrorMessage';

export default function SingleCourse() {
    const params = useParams();
    const courseId = params.id as string;
    const [activeTab, setActiveTab] = useState('overview');
    const { userProfile, refreshAuth } = useAuth();
    const { course, reviews, instructor, loading, error, getAverageRating } = useCourse(courseId);

    // Refresh user profile when component mounts (to catch post-payment enrollments)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');
        
        if (sessionId) {
            // Verify payment and enroll user
            apiService.verifySession(sessionId).then(() => {
                refreshAuth();
            }).catch(err => {
                console.error('Failed to verify payment:', err);
            });
        }
    }, [refreshAuth]);

    const checkOutCourse = async () => {
        try {
            if (userProfile?.role !== 'student') {
                alert("You are not authorized to purchase this course.")
                return;
            }
            const data = await apiService.initiateCheckout(courseId);
            window.location.href = data.url;
        } catch (err) {
            console.error('Failed to initiate checkout:', err);
        }
    }

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        document.getElementById(tab)?.scrollIntoView({ behavior: 'smooth' });
    }

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="min-h-screen w-full">
            {course ?
                <div className="flex flex-col-reverse lg:flex-row w-full px-10 ">
                    <div className="w-full lg:w-1/2 flex flex-col p-8 mb-5">
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
                                onClick={() => handleTabClick('overview')}
                            >
                                Overview
                            </li>
                            <li
                                className={`cursor-pointer pb-2 ${activeTab === 'learn' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                                onClick={() => handleTabClick('learn')}
                            >
                                What You Will Learn
                            </li>
                            <li
                                className={`cursor-pointer pb-2 ${activeTab === 'review' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                                onClick={() => handleTabClick('review')}
                            >
                                Review
                            </li>
                        </ul>
                        <div className="flex flex-col gap-5">
                            <div id="overview" className="scroll-mt-40">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Overview</h2>
                                <p>{course.overView}</p>
                            </div>
                            <div id="learn" className="scroll-mt-40">
                                <h2 className="text-2xl font-bold text-gray-900 mb-5">What you&apos;ll learn</h2>
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
                            <div id="instructor">
                                <h2 className="text-2xl font-bold text-gray-900 mb-5">Instructor</h2>
                                {instructor && (
                                    <div className="flex items-center gap-5">
                                        <div>
                                            <Image
                                                src={instructor.avatarUrl || "/default-avatar.png"}
                                                alt={instructor.name}
                                                width={100}
                                                height={100}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{instructor.name}</h3>
                                            <p className="text-gray-600">{instructor.username}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div id="review">
                                <h2 className="text-2xl font-bold text-gray-900 mb-5">Reviews</h2>
                                {reviews.length > 0 ? (
                                    <div className="space-y-4">
                                        {reviews.map((review) => (
                                            <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="flex text-yellow-500">
                                                        {Array(review.rating).fill('★').join('')}{Array(5 - review.rating).fill('☆').join('')}
                                                    </div>
                                                </div>
                                                <p className="text-gray-700">{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No reviews yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 gap-10 flex flex-col items-center lg:items-end justify-start m-8">
                        <div className="w-full max-w-[300px] gap-10 flex flex-col">
                            <Image
                                src={course.thumbnail}
                                alt={course.title}
                                width={300}
                                height={200}
                                className="object-cover"
                            />
                            {userProfile?.enrolledCourses?.some(enrolledCourse => enrolledCourse.id === course.id) ?
                                <Link
                                    href={`/course-player/${course.id}`}
                                    className="primaryBtn w-full block text-center"
                                >
                                    Continue Learning
                                </Link>
                                :
                                <button
                                    type="button"
                                    onClick={checkOutCourse}
                                    className="primaryBtn w-full block"
                                >
                                    Enroll Now
                                </button>
                            }

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
