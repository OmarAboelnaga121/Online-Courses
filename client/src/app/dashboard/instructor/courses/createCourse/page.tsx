"use client"
import { apiService } from "@/services/api"
import { useRouter } from "next/navigation";
import { useEffect, useState, FormEvent } from "react"


export default function CreateCourse() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [overView, setOverView] = useState("");
    const [whatYouWillLearn, setWhatYouWillLearn] = useState("");
    const [language, setLanguage] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [published, setPublished] = useState(false);
    const [photo, setPhoto] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const route = useRouter()

    const courseData = {
        title,
        description,
        overView,
        whatYouWillLearn,
        language,
        price: parseFloat(price) || 0,
        category,
        published,
        photo: photo || undefined
    }

    const submitCourse = async (e: FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const response = await apiService.createCourse(courseData);
            if(response){
                alert("Course Has Crated Successfully")
                route.push("/")
            }
        } catch (error) {
            console.error("Failed to create course:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
            <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-12">Create Course</h1>
            <form onSubmit={submitCourse} className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-10 space-y-6">
                <input onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Course Title" className="input" />
                <input onChange={(e) => setDescription(e.target.value)} type="text" placeholder="Course Description" className="input" />
                <select aria-label="Category" onChange={(e) => setCategory(e.target.value.toLowerCase())} id="category" name="category" className="input">
                    <option>Category</option>
                    <option>Programming</option>
                    <option>Marketing</option>
                    <option>Design</option>
                    <option>Business</option>
                    <option>Photography</option>
                </select>
                <input onChange={(e) => setPrice(e.target.value)} type="number" placeholder="Course Price" className="input" />
                <input onChange={(e) => setOverView(e.target.value)} type="text" placeholder="Course Overview" className="input" />
                <input onChange={(e) => setWhatYouWillLearn(e.target.value)} type="text" placeholder="What You Will Learn" className="input" />
                <p className="text-sm text-gray-500">To make one point please put &quot;,&quot; after each</p>
                <select aria-label="Language" onChange={(e) => setLanguage(e.target.value.toLowerCase())} id="language" name="language" className="input">
                    <option>Language</option>
                    <option>English</option>
                    <option>Spanish</option>
                    <option>German</option>
                    <option>French</option>
                </select>
                <div>
                    <label className="block w-full px-6 py-12 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer text-center bg-gray-50 group">
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
                        <span className="text-gray-600 text-lg font-medium group-hover:text-blue-600 transition-colors flex flex-col items-center gap-3">

                            <span>{photo ? `✅ ${photo.name}` : "Click to upload course thumbnail"}</span>
                            <span className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</span>
                        </span>
                    </label>
                </div>
                <button type="submit" className="primaryBtn w-full">{isSubmitting ? "Creating..." : "Create Course"}</button>
            </form>
        </div>
    )
}
