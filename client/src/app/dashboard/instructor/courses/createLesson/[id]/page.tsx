"use client"
import { apiService } from "@/services/api";
import { LessonBody } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateLesson() {

    const [lessons, setLessons] = useState<LessonBody[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lessonTitle, setLessonTitle] = useState("");
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const params = useParams();

    async function getLessons(courseId: string) {
        const data = await apiService.getCourseLessons(courseId);
        setLessons(data);
    }

    useEffect(() => {
        if (params.id) {
            console.log(params.id);
            getLessons(params.id as string);
        }
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!lessonTitle || !videoFile) {
            alert("Please provide both title and video file");
            return;
        }

        setIsSubmitting(true);

        try {
            // Create lessons array with single lesson
            const lessonsData = [{ title: lessonTitle }];
            const videosData = [videoFile];

            await apiService.createLessons(params.id as string, lessonsData, videosData);

            // Refresh lessons list
            await getLessons(params.id as string);

            // Close modal and reset form
            setIsModalOpen(false);
            setLessonTitle("");
            setVideoFile(null);

            alert("Lesson created successfully!");
        } catch (error) {
            console.error("Error creating lesson:", error);
            alert("Failed to create lesson. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteLesson = async (lessonId: string) => {
        try {
            await apiService.deleteLesson(lessonId, params.id as string);
            await getLessons(params.id as string);
            alert("Lesson deleted successfully!");
        } catch (error) {
            console.error("Error deleting lesson:", error);
            alert("Failed to delete lesson. Please try again.");
        }
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setVideoFile(e.target.files[0]);
        }
    };

    const closeModal = () => {
        if (!isSubmitting) {
            setIsModalOpen(false);
            setLessonTitle("");
            setVideoFile(null);
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full pt-5">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Course Content</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="primaryBtn"
                >
                    Add New Lesson
                </button>
            </div>

            <div className="flex flex-col gap-4">
                {lessons.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-lg">No lessons yet. Click "Add New Lesson" to get started!</p>
                    </div>
                ) : (
                    lessons.map((lesson: LessonBody, index: number) => (
                        <div key={lesson.id} className="p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 font-bold rounded-full">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">{lesson.title}</h2>
                                        {lesson.videoUrl && (
                                            <p className="text-sm text-gray-500 mt-1">Video available</p>
                                        )}
                                    </div>
                                </div>
                                <div className="">
                                    <button onClick={() => deleteLesson(lesson.id)} className="cursor-pointer px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Add New Lesson</h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                                disabled={isSubmitting}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div>
                                <label htmlFor="lessonTitle" className="block text-sm font-medium text-gray-700 mb-2">
                                    Lesson Title *
                                </label>
                                <input
                                    id="lessonTitle"
                                    type="text"
                                    value={lessonTitle}
                                    onChange={(e) => setLessonTitle(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="Enter lesson title"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label htmlFor="videoFile" className="block text-sm font-medium text-gray-700 mb-2">
                                    Video File *
                                </label>
                                <input
                                    id="videoFile"
                                    type="file"
                                    accept="video/*"
                                    onChange={handleVideoChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    required
                                    disabled={isSubmitting}
                                />
                                {videoFile && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        Selected: {videoFile.name}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 primaryBtn disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Creating..." : "Add Lesson"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}