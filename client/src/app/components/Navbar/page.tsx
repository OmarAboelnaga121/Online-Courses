"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { userProfile, isLoggedIn } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };


  return (
    <div className="relative">
      <div className="flex items-center justify-between px-10">
        <Link href={"/"} className="flex items-center gap-2">
          <Image src="/logo.png" alt="logo" width={150} height={150} />
        </Link>

        {/* Desktop Navigation - Original styling preserved */}
        <div className="hidden md:flex items-center gap-8 ml-[35px]">
          <Link href={"/"} className="text-gray-700 text-sm font-medium hover:text-blue-600 transition-colors duration-300 relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href={"/courses"} className="text-gray-700 text-sm font-medium hover:text-blue-600 transition-colors duration-300 relative group">
            Courses
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href={"/contact"} className="text-gray-700 text-sm font-medium hover:text-blue-600 transition-colors duration-300 relative group">
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link href={"/profile"} className="flex items-center gap-2 px-3 py-2 transition-all duration-300 relative group">
                <Image src={userProfile?.avatarUrl || "/default-avatar.png"} alt="User Avatar" width={40} height={40} className="rounded-full" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-300 relative">
                  Welcome, {userProfile?.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>
            ) : (
              <>
                <Link href={"/register"} className="primaryBtn">Register</Link>
                <Link href={"/login"} className="secondryBtn">Login</Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {/* Hamburger icon */}
            <svg
              className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            {/* Close icon */}
            <svg
              className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50`}>
        <div className="px-4 py-3 space-y-2">
          <Link 
            href={"/"} 
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href={"/"} 
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Courses
          </Link>
          <Link 
            href={"/"} 
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>
          <div className="flex flex-col gap-2 pt-4 pb-3">
            {isLoggedIn ? (
              <Link href={"/profile"} className="flex items-center gap-3 px-3 py-2 text-gray-700">
                <Image src={userProfile?.avatarUrl || "/default-avatar.png"} alt="User Avatar" width={40} height={40} className="rounded-full" />
                <span>Welcome, {userProfile?.name}</span>
              </Link>
            ) : (
              <>
                <Link href={"/register"} className="primaryBtn w-full text-center" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
                <Link href={"/login"} className="secondryBtn w-full text-center" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}