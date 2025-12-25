'use client'

import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faUser, faSignOutAlt, faUsers, faBook, faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoggedIn, loading: authLoading, refreshAuth } = useAuth();
  const pathname = usePathname()
  const route = useRouter()

  const tabs = [
    { name: 'Overview', href: '/dashboard/admin/overview', icon: faChartPie },
    { name: 'Users', href: '/dashboard/admin/users', icon: faUsers },
    { name: 'Courses', href: '/dashboard/admin/courses', icon: faBook },
    { name: 'Payments', href: '/dashboard/admin/payments', icon: faHandHoldingDollar }
  ]

  useEffect(() => {
    if (authLoading) return;

    if (isLoggedIn === false) {
      route.push('/login');
    }
  })

  const handleLogout = () => {
    apiService.logOut()
      .then(async () => {
        await refreshAuth();
        route.replace('/');
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  }


  return (
    <div className="w-full flex min-h-screen bg-gray-50">
      <nav className="w-72 mr-5 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6">
          <div className="mb-8 px-4">
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Admin Portal</h2>
          </div>
          <ul className="space-y-2">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <li key={tab.href}>
                  <Link
                    href={tab.href}
                    className={`group flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out ${isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 translate-x-1'
                        : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:translate-x-1'
                      }`}
                  >
                    <FontAwesomeIcon
                      icon={tab.icon}
                      className={`w-5 h-5 mr-3 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'
                        }`}
                    />
                    <span>{tab.name}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-auto p-6 border-t border-gray-50">
          <button
            onClick={handleLogout}
            className="cursor-pointer group w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 ease-in-out"
          >
            <FontAwesomeIcon
              icon={faSignOutAlt}
              className="w-5 h-5 mr-3 transition-transform duration-200 group-hover:-translate-x-1"
            />
            <span>Log out</span>
          </button>
        </div>
      </nav>
      <main className="flex-1 pr-4 py-5">
        {children}
      </main>
    </div>
  )
}