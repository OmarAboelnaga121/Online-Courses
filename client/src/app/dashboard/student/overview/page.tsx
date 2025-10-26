"use client"
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { apiService } from "@/services/api";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";


export default function Overview() {

    // Variables
    const [loading, setLoading] = useState(false);
    const { userProfile, isLoggedIn, loading: authLoading } = useAuth();

    
    if(authLoading || loading) {
        return <LoadingSpinner />;
    }

    return(
        <div>
            <h2 className="text-2xl font-bold mb-4">Welcome Back, {userProfile?.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="cursor-pointer bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">Enrolled Courses</h3>
                            <p className="text-3xl font-bold text-blue-600">{userProfile?.statistics.totalCoursesEnrolled || 0}</p>
                            <p className="text-sm text-gray-500 mt-1">Active learning</p>
                        </div>
                        <div className="text-blue-500 text-3xl">📚</div>
                    </div>
                </div>
                <div className="cursor-pointer bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">Total Spent</h3>
                            <p className="text-3xl font-bold text-green-600">${userProfile?.statistics.totalSpent || 0}</p>
                            <p className="text-sm text-gray-500 mt-1">Investment in learning</p>
                        </div>
                        <div className="text-green-500 text-3xl">💰</div>
                    </div>
                </div>
                <div className="cursor-pointer bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">Transactions</h3>
                            <p className="text-3xl font-bold text-purple-600">{userProfile?.statistics.totalPayments || 0}</p>
                            <p className="text-sm text-gray-500 mt-1">Course purchases</p>
                        </div>
                        <div className="text-purple-500 text-3xl">🧾</div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Recently Accessed Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    {userProfile?.enrolledCourses?.length === 0 ? (
                        <p className="text-gray-500">You have not enrolled in any courses yet.</p>
                    ) : (
                        userProfile?.enrolledCourses?.slice(0, 3).map((course) => (
                            <Link href={`/course-player/${course.id}`} key={course.id} className="p-4 bg-white rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
                                <Image src={course.thumbnail} alt={course.title} width={300} height={200} className="w-full h-48 object-cover rounded-md mb-3" />
                                <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                                <p className="text-gray-600 mb-3">{course.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-600 font-bold">${course.price}</span>
                                    <span className="text-sm text-gray-500">{course.category}</span>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}