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

    return (
        <div className="p-4 space-y-4">
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
                    <div className="text-sm text-gray-500">Enrolled</div>
                    <div className="text-lg font-bold">{userProfile.statistics?.totalCoursesEnrolled ?? userProfile.enrolledCourses?.length ?? 0}</div>
                </div>
                <div className="flex-1 bg-white p-3 rounded text-center">
                    <div className="text-sm text-gray-500">Wishlist</div>
                    <div className="text-lg font-bold">{userProfile.statistics?.totalWishlistItems ?? userProfile.wishList?.length ?? 0}</div>
                </div>
                <div className="flex-1 bg-white p-3 rounded text-center">
                    <div className="text-sm text-gray-500">Spent</div>
                    <div className="text-lg font-bold text-green-600">${(userProfile.statistics?.totalSpent ?? 0).toFixed(2)}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded border">
                    <h3 className="font-semibold mb-2">Enrolled Courses</h3>
                    {userProfile.enrolledCourses && userProfile.enrolledCourses.length > 0 ? (
                        <ul className="list-none space-y-2">
                            {userProfile.enrolledCourses.map((enrolledCourse) => (
                                <li key={enrolledCourse.id}>
                                    <Link href={`/course-player/${enrolledCourse.id}`} className="text-blue-600 hover:underline">{enrolledCourse.title}</Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-gray-500">No enrolled courses.</div>
                    )}
                </div>

                <div className="bg-white p-4 rounded border">
                    <h3 className="font-semibold mb-2">Wishlist</h3>
                    {userProfile.wishList && userProfile.wishList.length > 0 ? (
                        <ul className="list-disc pl-5">
                            {userProfile.wishList.map((w, i) => (
                                <li key={i} className="text-gray-700">{w}</li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-gray-500">No items in wishlist.</div>
                    )}
                </div>
            </div>

            <div className="bg-white p-4 rounded border">
                <h3 className="font-semibold mb-2">Recent Payments</h3>
                {userProfile.payments && userProfile.payments.length > 0 ? (
                    <ul className="space-y-2">
                        {userProfile.payments.slice(0, 5).map((p) => (
                            <li key={p.id} className="flex justify-between text-sm text-gray-700">
                                <span>{p.course?.title ?? 'Course'}</span>
                                <span className="text-gray-500">${Number(p.amount ?? 0).toFixed(2)} • {p.date ? new Date(p.date).toLocaleDateString() : ''}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-gray-500">No payments found.</div>
                )}
            </div>
        </div>
    );
}