'use client';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react';

export default function InstructorDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userProfile, isLoggedIn, loading: authLoading, refreshAuth } = useAuth();
  const pathname = usePathname()
  const route = useRouter()

  const tabs = [
    { name: 'Overview', href: '/dashboard/instructor/overview' },
    { name: 'My Courses', href: '/dashboard/instructor/courses' },
    { name: 'Profile', href: '/dashboard/instructor/profile' }
  ]

  useEffect(() => {
    if (authLoading) return;

    if (isLoggedIn === false) {
      route.replace('/login');
      return;
    }

    const role = userProfile?.role;
    if (role && role !== 'instructor') {
      route.replace(`/dashboard/${role}/overview`);
      return;
    }

  }, [authLoading, isLoggedIn, userProfile, route]);



  const handleLogout = () => {
    apiService.logOut()
      .then(async () => {
        // refresh auth context (like login does) so UI updates before redirect
        try {
          await refreshAuth();
        } catch (err) {
          // ignore refresh errors, still redirect
          console.error('refreshAuth error:', err);
        }
        route.replace('/');
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  }


  return (
    <div className=" max-w-6xl flex gap-8">
      <nav className="w-64 flex-shrink-0">
        <div className="p-4">
          <ul className="space-y-1">
            {tabs.map((tab) => (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  className={`block px-4 py-3 rounded-md text-md font-medium transition-colors ${
                    pathname === tab.href
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="ml-0">{tab.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="cursor-pointer block w-full text-left px-4 py-3 rounded-md text-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Log out
            </button>
        </div>
      </nav>
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}