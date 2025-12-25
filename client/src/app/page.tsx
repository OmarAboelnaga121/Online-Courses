import Image from "next/image";
import Link from "next/link";
import { Course } from '@/types';
import { apiService } from '@/services/api';

const categories = [
  {
    id: 1,
    title: "Programming",
    link: "/courses?category=Programming"
  },
  {
    id: 2,
    title: "Marketing",
    link: "/courses?category=Marketing"
  },
  {
    id: 3,
    title: "Designing",
    link: "/courses?category=Designing"
  },
  {
    id: 4,
    title: "Business",
    link: "/courses?category=Business"
  },
  {
    id: 5,
    title: "Photography",
    link: "/courses?category=Photography"
  },
]

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    image: "testimonial1.png",
    description: "EduFlex has transformed my learning experience. The courses are engaging and the instructors are top-notch."
  },
  {
    id: 2,
    name: "Mike Chen",
    image: "testimonial2.png",
    description: "I've gained valuable skills in web development thanks to EduFlex's comprehensive courses and hands-on projects."
  },
  {
    id: 3,
    name: "Emma Davis",
    image: "testimonial3.png",
    description: "The design courses on EduFlex are incredibly creative and inspiring. I've learned so much from the expert instructors."
  },
]

export default async function Home() {
  // const [courses, useCourses] = useState<coursesType[]>([])

  const getCourses = async () => {
    try {
      const data = await apiService.getPublishedCourses();
      return data.slice(0, 3);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      return [];
    }
  }

  const courses = await getCourses()

  return (
    <div className="flex flex-col gap-10 justify-center text-center">
      <div className="flex flex-col lg:flex-row items-center justify-center mt-10 px-4 lg:px-16 max-w-7xl mx-auto gap-y-8 lg:gap-y-0 lg:gap-x-16">
        <div className="w-full lg:w-1/2 flex justify-center text-center">
          <Image
            src="/heroPic.png"
            alt="logo"
            width={500}
            height={500}
            className="max-w-xs md:max-w-md lg:max-w-lg w-full h-auto"
          />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col gap-6 items-center lg:items-start text-center lg:text-left">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold">
            Learn Anything. Anytime. Anywhere.
          </h1>
          <p className="text-base md:text-lg lg:text-xl">
            Join thousands of learners today.
          </p>
          <Link href="/courses" className="primaryBtn w-full text-center">Browse Courses</Link>
        </div>
      </div>
      <div className="flex justify-center gap-5 flex-wrap">
        {categories.map((category) => (
          <Link href={category.link} key={category.id} className="bg-[#d3d6dc] p-3 rounded-md hover:bg-[#c1c5cc] transition-colors duration-200 cursor-pointer">
            {category.title}
          </Link>
        ))}
      </div>
      <div className="flex justify-center text-center flex-col gap-4 max-w-7xl w-full px-4 lg:px-16">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">Featured Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course: Course) => (
            <Link href={`/courses/${course.id}`} key={course.id} className="p-4 bg-white rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <Image src={course.thumbnail} alt={course.title} width={300} height={200} className="w-full h-48 object-cover rounded-md mb-3" />
              <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-3">{course.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-bold">${course.price}</span>
                <span className="text-sm text-gray-500">{course.category}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex justify-center text-center flex-col gap-4 max-w-7xl w-full px-4 lg:px-16 mx-auto">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">What Our Students Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="p-4 bg-white rounded-lg shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <Image src={`/${testimonial.image}`} alt="testimonial image" width={300} height={200} className="w-full h-auto rounded-md mb-2" />
              <h2>{testimonial.name}</h2>
              <p>&quot;{testimonial.description}&quot;</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
