'use client';
import { useAuth } from "@/hooks/useAuth";
import { apiService } from "@/services/api";
import { Review } from "@/types";
import { useEffect, useState } from "react";

export default function Overview() {

    const { userProfile } = useAuth();
    const [reviews, setReviews] = useState([]);

    // Calculate instructor revenue from course sales
    const totalRevenue = userProfile?.myCourses
        ?.reduce((sum, course) => sum + (course.price * course.studentsEnrolled.length), 0) || 0;

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                if (userProfile?.id) {
                    const recent = await apiService.getInstructorReviews(userProfile.id);
                    setReviews(recent);
                }
            } catch {
                throw new Error("Failed to fetch reviews");
            }
        };
        if (userProfile?.id) fetchReviews();
    }, [userProfile?.id])

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div className="cursor-pointer bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">Courses</h3>
                        <p className="text-3xl font-bold text-blue-600">{userProfile?.myCourses.length || 0}</p>
                        <p className="text-sm text-gray-500 mt-1">Active learning</p>
                    </div>
                    <div className="text-blue-500 text-3xl">📚</div>
                </div>
            </div>
            <div className="cursor-pointer bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">Total Revenue</h3>
                        <p className="text-3xl font-bold text-green-600">${totalRevenue}</p>
                        <p className="text-sm text-gray-500 mt-1">From course sales</p>
                    </div>
                    <div className="text-green-500 text-3xl">💰</div>
                </div>
            </div>
            <div className="cursor-pointer bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">Total Students</h3>
                        <p className="text-3xl font-bold text-purple-600">{userProfile?.myCourses.reduce((acc, course) => acc + course.studentsEnrolled.length, 0) || 0}</p>
                        <p className="text-sm text-gray-500 mt-1">Enrolled in courses</p>
                    </div>
                    <div className="text-purple-500 text-3xl">🤩</div>
                </div>
            </div>
            <div className="col-span-1 md:col-span-3 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Reviews</h2>
                <div className="space-y-4">
                    {reviews?.length === 0 ? <p className="text-gray-500">No reviews yet.</p> :
                        <div className="space-y-3">
                            {reviews?.slice(0, 5).map((review: Review) => (
                                <div key={review.id} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                                    </div>
                                    <p className="text-gray-700">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}