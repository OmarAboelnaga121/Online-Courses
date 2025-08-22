"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type Course = {
    id: string
    title: string
    description: string
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

export default function Courses() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category');

    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [filters, setFilters] = useState({
        category: categoryParam || "All",
        language: "All",
        price: "All",
    });
    const categories = ['All', 'Programming', 'Marketing', 'Designing', 'Business', 'Photography'];
    const languages = ['All', 'English', 'Spanish', 'French', 'German'];
    const priceRanges = ['All', 'Free', '$1-$50', '$51-$100', '$100+'];

    
    useEffect(() => {
        let filtered = courses;

        if (filters.category !== "All") {
            filtered = filtered.filter(course => course.category === filters.category);
        }

        if (filters.language !== "All") {
            filtered = filtered.filter(course => course.language === filters.language);
        }

        if (filters.price !== "All") {
            filtered = filtered.filter(course => {
                if (filters.price === "Free") return course.price === 0;
                if (filters.price === "$1-$50") return course.price > 0 && course.price <= 50;
                if (filters.price === "$51-$100") return course.price > 50 && course.price <= 100;
                if (filters.price === "$100+") return course.price > 100;
                return true;
            });
        }

        setFilteredCourses(filtered);
    }, [filters, courses]);

    const getUserProfile = async () => {
        try {
            const response = await fetch("http://localhost:3000/users/profile", {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                return null;
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return null;
        }
    };

    const getData = async() => {
        const response = await fetch("http://localhost:3000/courses/published",
            {
                method: "GET",
                credentials: "include",
            }
        );
        const data = await response.json();

        setCourses(data);
        setFilteredCourses(data);
    }



    const isEnrolled = (courseId: string) => {
        if (!userProfile) return false;
        return userProfile.enrolledCourses?.includes(courseId) || 
               courses.find(c => c.id === courseId)?.studentsEnrolled?.includes(userProfile.id);
    };

    useEffect(() => {
        const fetchData = async () => {
            await getData();
            const profile = await getUserProfile();
            if (profile) {
                setUserProfile(profile);
                setIsLoggedIn(true);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="flex gap-6 p-6">
            {/* Filter Sidebar */}
            <div className="w-64 bg-white rounded-lg shadow-md p-4 h-fit">
                <h2 className="font-bold text-xl mb-4">Filters</h2>
                
                {/* Category Filter */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-3">Category</h3>
                    <div className="space-y-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setFilters({...filters, category})}
                                className={`w-full text-left p-2 rounded-md transition-colors duration-200 ${
                                    filters.category === category
                                        ? 'bg-blue-600 text-white'
                                        : 'hover:bg-gray-100'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Language Filter */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-3">Language</h3>
                    <div className="space-y-2">
                        {languages.map((language) => (
                            <button
                                key={language}
                                onClick={() => setFilters({...filters, language})}
                                className={`w-full text-left p-2 rounded-md transition-colors duration-200 ${
                                    filters.language === language
                                        ? 'bg-blue-600 text-white'
                                        : 'hover:bg-gray-100'
                                }`}
                            >
                                {language}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-3">Price Range</h3>
                    <div className="space-y-2">
                        {priceRanges.map((priceRange) => (
                            <button
                                key={priceRange}
                                onClick={() => setFilters({...filters, price: priceRange})}
                                className={`w-full text-left p-2 rounded-md transition-colors duration-200 ${
                                    filters.price === priceRange
                                        ? 'bg-blue-600 text-white'
                                        : 'hover:bg-gray-100'
                                }`}
                            >
                                {priceRange}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Courses Section */}
            <div className="flex-1">
                <div className="mb-4">
                    <h2 className="text-2xl font-bold">Courses</h2>
                    <p className="text-gray-600">{filteredCourses.length} courses found</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCourses.map((course) => (
                    <div key={course.id} className="p-4 bg-white rounded-lg shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl">
                        <Link href={`/courses/${course.id}`}>
                            <Image src={course.thumbnail} alt={course.title} width={300} height={200} className="w-full h-48 object-cover rounded-md mb-3 cursor-pointer" />
                        </Link>
                        <Link href={`/courses/${course.id}`}>
                            <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 cursor-pointer">{course.title}</h3>
                        </Link>
                        <p className="text-gray-600 mb-3 line-clamp-2 h-12">{course.description}</p>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-blue-600 font-bold">${course.price}</span>
                            <span className="text-sm text-gray-500">{course.category}</span>
                        </div>
                        
                        <div className="h-10">
                            {isLoggedIn && isEnrolled(course.id) ? (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded text-center h-full flex items-center justify-center">
                                    ✅ Already Enrolled
                                </div>
                            ) : (
                                <Link href={`/courses/${course.id}`} className="primaryBtn w-full text-center block h-full flex items-center justify-center">
                                    View Details
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
    );
}
