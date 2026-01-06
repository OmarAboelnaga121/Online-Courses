"use client"
import { useAuth } from "@/contexts/AuthContext";
import { useCourse } from "@/hooks/useCourse";
import { apiService } from "@/services/api";
import { useEffect, useState } from "react";
import { Course, Payment, UserProfile } from "@/types";
import Link from "next/link";

export default function AdminOverviewPage() {
    const { userProfile } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [onRequestCourses, setOnRequestCourses] = useState<Course[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [users, setUsers] = useState<UserProfile[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const allCourses = await apiService.getCourses();
                const payments = await apiService.getPayments();
                const users = await apiService.getUser();
                // const users = await apiService.getUser();

                setCourses(allCourses.filter(course => course.published));
                setOnRequestCourses(allCourses.filter(course => !course.published));
                setPayments(payments);
                setUsers(users);

            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourses();
    }, []);

    const handleRequests = async (courseId: string, status : boolean) => {
        try {
            await apiService.updateCourseStatus(courseId, status);
            
            // Refresh the courses list after update
            const allCourses = await apiService.getCourses();
            setCourses(allCourses.filter(course => course.published));
            setOnRequestCourses(allCourses.filter(course => !course.published));

        } catch (error) {
            console.error('Error updating course:', error);
            alert('Failed to update course status');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Welcome Back, {userProfile?.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="cursor-pointer bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">Published Courses</h3>
                            <p className="text-3xl font-bold text-blue-600">{courses.length || 0}</p>
                            <p className="text-sm text-gray-500 mt-1">Courses available</p>
                        </div>
                        <div className="text-blue-500 text-3xl">📚</div>
                    </div>
                </div>
                <div className="cursor-pointer bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">Total Payments</h3>
                            <p className="text-3xl font-bold text-green-600">{payments.length || 0}</p>
                            <p className="text-sm text-gray-500 mt-1">Total Payments</p>
                        </div>
                        <div className="text-green-500 text-3xl">💰</div>
                    </div>
                </div>
                <div className="cursor-pointer bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">Total Users</h3>
                            <p className="text-3xl font-bold text-purple-600">{users.length || 0}</p>
                            <p className="text-sm text-gray-500 mt-1">Total Users</p>
                        </div>
                        <div className="text-purple-500 text-3xl">🧾</div>
                    </div>
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-bold my-4">Requested Courses</h2>
                <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
                    <table className="min-w-full w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Course Name</th>
                                <th className="py-3 px-6 text-left">Price</th>
                                <th className="py-3 px-6 text-left">Image</th>
                                <th className="py-3 px-6 text-left">Category</th>
                                <th className="py-3 px-6 text-left">Status</th>
                                <th className="py-3 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {onRequestCourses.map((course) => (
                                <tr key={course.id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6 text-left whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Link href={`/course-player/${course.id}`} className="font-medium hover:text-blue-600">{course.title}</Link >
                                        </div>
                                    </td>
                                    <td className="py-3 px-6 text-left">
                                        ${course.price}
                                    </td>
                                    <td className="py-3 px-6 text-left">
                                        {course.thumbnail ? (
                                            <img src={course.thumbnail} alt={course.title} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                                        ) : (
                                            <span className="text-gray-400">No Image</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-6 text-left">
                                        <span className="bg-blue-200 text-blue-600 py-1 px-3 rounded-full text-xs">
                                            {course.category}
                                        </span>
                                    </td>
                                    <td className="py-3 px-6 text-left">
                                        <span className={`py-1 px-3 rounded-full text-xs ${course.published ? 'bg-green-200 text-green-600' : 'bg-yellow-200 text-yellow-600'}`}>
                                            {course.published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        <div className="flex item-center justify-center gap-2">
                                            <button onClick={() => handleRequests(course.id, true)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-xs transition-colors">
                                                Approve
                                            </button>
                                            <button onClick={() => handleRequests(course.id, false)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-xs transition-colors">
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}