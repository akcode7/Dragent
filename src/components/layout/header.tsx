'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';


export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
 
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleSaveAsApp = () => {
    setIsSaving(true);
    // Implementation for save as app functionality
    setTimeout(() => {
      setIsSaving(false);
    }, 2000);
  };

  // List of all features/routes for the navigation
  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'ECG Analysis', href: '/ecg-analysis' },
    { name: 'Lab Reports', href: '/lab-reports' },
    { name: 'AI Doctor', href: '/personal-ai-doc' },
    { name: 'Dermatology AI', href: '/dermotology-ai' },
    { name: 'Medicine Checker', href: '/medicine-reaction' },
    { name: 'Talk & Heal', href: '/talk-heal' },
    { name: 'Diet Planner', href: '/diet-planner' },
    { name: 'Emergency', href: '/emergency' },
  ];

  return (
    <header className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <div className="h-12 w-auto flex items-center">
                  <Image
                    src="/logo.png"
                    alt="MedAI Doctor"
                    width={100}
                    height={100}
                    priority
                    className="mr-2"
                  />
                 
                </div>
              </Link>
            </div>
            <nav className="hidden md:ml-6 md:flex md:space-x-4 items-center">
              {/* Desktop Navigation */}
              {navigationItems.slice(0, 6).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-3 pt-1 text-sm font-medium ${
                    pathname === item.href || pathname?.includes(item.href.substring(1)) 
                      ? 'text-teal-500 border-b-2 border-teal-500' 
                      : 'text-gray-700 hover:text-teal-500'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* More dropdown for desktop */}
              <div className="relative group hidden lg:block">
                <button className="inline-flex items-center px-3 pt-1 text-sm font-medium text-gray-700 hover:text-teal-500">
                  More
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    {navigationItems.slice(6).map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`block px-4 py-2 text-sm ${
                          pathname === item.href || pathname?.includes(item.href.substring(1)) 
                            ? 'text-teal-500 bg-gray-50' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-teal-500'
                        }`}
                        role="menuitem"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </nav>
          </div>
          
          {/* Right side buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              href="/emergency"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Emergency
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </Link>
            
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Sign in
            </Link>
            
            <Link
              href="/signup"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Try Now
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
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

      {/* Mobile menu - Flyout from left */}
      <div 
        className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-50 md:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          ref={mobileMenuRef}
          className={`fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl transform transition-transform ease-in-out duration-300 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col overflow-y-auto">
            {/* Mobile menu header */}
            <div className="px-4 py-6 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="MedAI Doctor"
                  width={40}
                  height={40}
                  className="h-10 w-10"
                />
                <span className="ml-2 font-semibold text-xl text-gray-800">Dragent</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile menu navigation */}
            <div className="flex-1">
              <nav className="px-2 py-4 space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block rounded-md px-3 py-2 text-base font-medium ${
                      pathname === item.href || pathname?.includes(item.href.substring(1))
                        ? 'bg-teal-50 text-teal-500 border-l-4 border-teal-500' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-teal-500'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Mobile menu footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  className="text-center font-medium px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="text-center font-medium px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => setIsOpen(false)}
                >
                  Try Now
                </Link>
              </div>
              <button
                onClick={() => {
                  handleSaveAsApp();
                  setIsOpen(false);
                }}
                disabled={isSaving}
                className="flex w-full items-center justify-center mt-4 px-4 py-2 text-base font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-60 rounded-md"
              >
                {isSaving ? 'Processing...' : 'Save as App'}
                {!isSaving && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}