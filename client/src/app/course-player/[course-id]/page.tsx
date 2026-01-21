"use client"
import { useAuth } from "@/contexts/AuthContext";
import { useCourse } from "@/hooks/useCourse";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CoursePlayerPage() {
    const params = useParams();
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const courseId = params['course-id'] as string;
    const router = useRouter();
    const { userProfile } = useAuth();
    const { course, loading, error, lessons } = useCourse(courseId);

    useEffect(() => {
        if (!course || !userProfile) return;

        // check if admin can get access to it
        if (userProfile.role === 'admin') {
            return;
        }

        // Check instructor id
        if (userProfile.role === 'instructor' && course.instructorId !== userProfile.id) {
            alert('You are not authorized to access this course');
            router.push('/courses');
        }

        // check if the student purchased the course
        if (userProfile.role === 'student' && !course.studentsEnrolled.includes(userProfile.id)) {
            alert('You are not authorized to access this course');
            router.push('/courses');
        }

    }, [course, lessons, userProfile]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!lessons || lessons.length === 0) return <div>No lessons available</div>;

    return (
        <div className="flex">
            <div className="w-1/4 p-4">
                {lessons.map((lesson, index) => (
                    <div key={lesson.id}>
                        <button
                            onClick={() => setCurrentLessonIndex(index)}
                            className={`w-full p-2 text-left ${index === currentLessonIndex ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            {lesson.title}
                        </button>
                    </div>
                ))}
            </div>
            <div className="w-3/4 p-4">
                <h1>{lessons[currentLessonIndex]?.title}</h1>
                <video
                    key={currentLessonIndex}
                    width="800"
                    height="600"
                    controls
                    src={lessons[currentLessonIndex]?.videoUrl}
                >
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    )
}