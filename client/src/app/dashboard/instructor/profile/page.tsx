"use client"

import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";

export default function Profile() {
    const { userProfile, isLoggedIn, loading: authLoading } = useAuth();

    if (authLoading) return <LoadingSpinner />;

    if (!isLoggedIn || !userProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold">No profile data found</h2>
                    <p className="text-sm text-gray-500 mt-2">Please sign in to view your profile.</p>
                </div>
            </div>
        );
    }

    const totalStudents = Array.isArray(userProfile.myCourses) 
        ? userProfile.myCourses.reduce((sum, course) => sum + (course.studentsEnrolled?.length ?? 0), 0)
        : 0;

    const coursesCount = Array.isArray(userProfile.myCourses) ? userProfile.myCourses.length : 0;

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center gap-4 bg-white p-4 rounded shadow border">
                <Image src={userProfile.avatarUrl || '/profile-pic.png'} alt={userProfile.name} width={72} height={72} className="rounded-full object-cover" />
                <div>
                    <div className="text-lg font-semibold">{userProfile.name}</div>
                    <div className="text-sm text-gray-500">@{userProfile.username}</div>
                    <div className="text-sm text-gray-600">{userProfile.email}</div>
                </div>
            </div>

            <div className="flex gap-3">
                <div className="flex-1 bg-white p-3 rounded text-center">
                    <div className="text-sm text-gray-500">Created Courses</div>
                    <div className="text-lg font-bold">{coursesCount}</div>
                </div>
                <div className="flex-1 bg-white p-3 rounded text-center">
                    <div className="text-sm text-gray-500">Total Students</div>
                    <div className="text-lg font-bold">{totalStudents}</div>
                </div>
                <div className="flex-1 bg-white p-3 rounded text-center">
                    <div className="text-sm text-gray-500">Published</div>
                    <div className="text-lg font-bold text-green-600">
                        {Array.isArray(userProfile.myCourses) ? userProfile.myCourses.filter(c => c.published).length : 0}
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded border w-full">
                <h3 className="font-semibold mb-2">My Courses</h3>
                {Array.isArray(userProfile.myCourses) && userProfile.myCourses.length > 0 ? (
                    <ul className="space-y-2">
                        {userProfile.myCourses.map((course) => (
                            <li key={course.id} className="flex justify-between items-center text-sm">
                                <Link href={`/dashboard/instructor/courses/${course.id}`} className="text-blue-600 hover:underline">
                                    {course.title}
                                </Link>
                                <div className="flex gap-3 text-gray-500">
                                    <span>{course.studentsEnrolled?.length ?? 0} students</span>
                                    <span className={course.published ? "text-green-600" : "text-orange-600"}>
                                        {course.published ? "Published" : "Draft"}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-gray-500">No courses created yet.</div>
                     )}
            </div>
        </div>
    );
}