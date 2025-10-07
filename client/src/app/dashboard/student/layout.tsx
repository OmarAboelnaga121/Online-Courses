'use client'

import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react';

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const pathname = usePathname()
  const route = useRouter()

  const tabs = [
    { name: 'Overview', href: '/dashboard/student/overview' },
    { name: 'Enrolled Courses', href: '/dashboard/student/courses' },
    { name: 'Profile', href: '/dashboard/student/profile' }
  ]

  useEffect(() => {
    if (authLoading) return;

    if (isLoggedIn === false) {
      route.push('/login');
    }
  })




  return (
    <div className=" max-w-6xl flex gap-8">
      <nav className="w-64 flex-shrink-0 flex items-center justify-center">
        <div className="space-y-2">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`block px-4 py-3 rounded-lg text-md font-medium transition-colors ${
                pathname === tab.href
                  ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.name}
            </Link>
          ))}
        </div>
      </nav>
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}