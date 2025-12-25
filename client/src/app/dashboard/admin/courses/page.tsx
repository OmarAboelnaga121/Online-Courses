"use client"
import { apiService } from "@/services/api";
import { useEffect, useState } from "react";
import { Course } from "@/types";

export default function AdminCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const allCourses = await apiService.getCourses();
                setCourses(allCourses);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourses();
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold my-4">All Courses</h2>
            <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
                <table className="min-w-full w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Course Name</th>
                            <th className="py-3 px-6 text-left">Price</th>
                            <th className="py-3 px-6 text-left">Image</th>
                            <th className="py-3 px-6 text-left">Category</th>
                            <th className="py-3 px-6 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {courses.map((course) => (
                            <tr key={course.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                    <div className="flex items-center">
                                        <span className="font-medium">{course.title}</span>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
