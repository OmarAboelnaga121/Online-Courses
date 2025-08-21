import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br  flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <Link href="/" className="inline-block">
            <Image 
              src="/logo.png" 
              alt="EduFlex Logo" 
              width={120} 
              height={120} 
              className="mx-auto"
            />
          </Link>
        </div>

        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-9xl font-bold text-blue-600 opacity-20">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl">🔍</div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link 
            href="/" 
            className="primaryBtn inline-block w-full sm:w-auto px-8 py-3 text-center"
          >
            Go Back Home
          </Link>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              href="/courses" 
              className="secondryBtn inline-block px-6 py-2 text-center"
            >
              Browse Courses
            </Link>
            <Link 
              href="/contact" 
              className="secondryBtn inline-block px-6 py-2 text-center"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
