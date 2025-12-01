"use client"
import { useAuth } from "@/contexts/AuthContext";
import { useCourse } from "@/hooks/useCourse";
import { Course } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default function MyCourses() {

    const {userProfile, isLoggedIn, loading: authLoading} = useAuth()
    const instructorCourses = userProfile?.myCourses



    return (
        <div className="flex flex-col gap-5 w-full pt-5">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
                <Link href="/dashboard/instructor/courses/createCourse" className="primaryBtn">Add Course</Link>
            </div>
            <div className="grid grid-cols-3 gap-6">
                {instructorCourses?.map((course : Course) => (
                        <div key={course.id} className="p-4 bg-white rounded-lg shadow-md cursor-pointer transition-all duration-300 max-w-sm">
                            <Image src={course.thumbnail} alt={course.title} width={300} height={200} className="w-full h-48 object-cover rounded-md mb-3" />
                            <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                            <p className="text-gray-600 mb-3">{course.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-blue-600 font-bold">${course.price}</span>
                                <span className="text-sm text-gray-500">{course.category}</span>
                            </div>
                            <button className="primaryBtn w-full mt-3">See Course Content</button>
                        </div>
                ))}
            </div>
        </div>
    )
}
