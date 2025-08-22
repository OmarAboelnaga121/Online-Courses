"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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

export default function SingleCourse() {
    const params = useParams();
    const courseId = params.id as string;

    return (
        <div className="flex gap-6 p-6">
            <p>Course ID: {courseId}</p>
        </div>
    );
}
