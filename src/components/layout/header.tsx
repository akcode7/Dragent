'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/auth-service';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [userData, setUserData] = useState<{
    user?: any;
    profile?: any;
  } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    const checkUser = async () => {
      try {
        const result = await authService.getCurrentUser();
        if (result.success && result.data) {
          setUserData(result.data);
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserData(null);
      }
    };
    
    checkUser();
  }, []);

  const handleLogout = async () => {
    const result = await authService.logout();
    if (result.success) {
      setUserData(null);
      router.push('/login');
    }
  };

  const isAuthPage = pathname?.includes('login') || 
                     pathname?.includes('signup') || 
                     pathname?.includes('forgot-password');

  if (isAuthPage) return null;

  const displayName = userData?.profile?.name || userData?.user?.name || 'User';
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <div className="h-8 w-auto">
                  {/* If you have a logo, uncomment the Image component */}
                  {/* <Image
                    src="/logo.png"
                    alt="Dragent Logo"
                    width={32}
                    height={32}
                    priority
                  /> */}
                  <span className="text-xl font-bold">Dragent</span>
                </div>
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname === '/' ? 'border-b-2 border-blue-500' : ''
                }`}
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname === '/dashboard' ? 'border-b-2 border-blue-500' : ''
                }`}
              >
                Dashboard
              </Link>
            </nav>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {userData ? (
              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    className="flex items-center text-sm rounded-full focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      {userInitial}
                    </div>
                    <span className="ml-2">{displayName}</span>
                  </button>
                </div>
                {isOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="text-sm font-medium px-4 py-2 rounded-md bg-teal-500 hover:bg-blue-700 text-white"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`block pl-3 pr-4 py-2 text-base font-medium ${
                pathname === '/' ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className={`block pl-3 pr-4 py-2 text-base font-medium ${
                pathname === '/dashboard' ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
          </div>
          {userData ? (
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {userInitial}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium">{displayName}</div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {userData?.user?.email || userData?.profile?.email || ''}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  Your Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-2 px-4">
                <Link
                  href="/login"
                  className="text-center font-medium px-4 py-2 rounded-md bg-teal-500 hover:bg-blue-700 text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-center font-medium px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                  onClick={() => setIsOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}