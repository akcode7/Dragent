'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

export default function Dashboard() {

  const [greeting, setGreeting] = useState('');
  
  // Set appropriate greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

 

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-blue-500">{greeting}</h1>
        <p className="text-gray-600 ">
          Here's an overview of your health insights and recent activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white  p-6 rounded-lg shadow-sm border border-gray-200 ">
          <div className="flex items-center justify-between mb-4">
            <h3 className=" text-black font-bold text-xl">ECG Report</h3>
            <span className="text-sm text-blue-600 ">Last check: 2 days ago</span>
          </div>
         
          <div className="mt-2 text-xl text-bold text-green-600 ">
            Normal
          </div>
        </div>

        

        <div className="bg-white  p-6 rounded-lg shadow-sm border border-gray-200 ">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-black font-bold text-xl ">Recent Tests</h3>
            <span className="text-sm text-blue-600 ">Last month</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-black">2</span>
            <span className="ml-2 text-gray-600 ">reports</span>
          </div>
          <div className="mt-2 text-sm text-yellow-600 ">
            1 follow-up needed
          </div>
        </div>

        <div className="bg-white  p-6 rounded-lg shadow-sm border border-gray-200 ">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-black font-bold text-xl">Appointments</h3>
            <span className="text-sm text-blue-600">Coming up</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-black">1</span>
            <span className="ml-2 text-gray-600 ">scheduled</span>
          </div>
          <div className="mt-2 text-sm text-blue-600 ">
            April 23, 2025 - Dr. Smith
          </div>
        </div>
      </div>

      {/* Features and Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Medical Features */}
        <div className="col-span-2 bg-white  p-6 rounded-lg shadow-sm border border-gray-200 ">
          <h2 className="text-xl font-bold mb-4 text-black">Medical Services</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Link href="/dental" className="p-4 bg-blue-50  rounded-lg hover:bg-blue-100  transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-blue-100  rounded-full flex items-center justify-center text-blue-600  mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2" />
                  </svg>
                </div>
                <span className="font-medium text-blue-500">Dental</span>
              </div>
            </Link>
            
            <Link href="/dermotology-ai" className="p-4 bg-green-50  rounded-lg hover:bg-green-100  transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-green-100  rounded-full flex items-center justify-center text-green-600  mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="font-medium text-green-600">Skin Analysis</span>
              </div>
            </Link>
            
            <Link href="/diet-planner" className="p-4 bg-red-50  rounded-lg hover:bg-red-100  transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-red-100  rounded-full flex items-center justify-center text-red-600 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="font-medium text-red-600">Diet Planner</span>
              </div>
            </Link>
            
            <Link href="/ecg-analysis" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100  transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-purple-100  rounded-full flex items-center justify-center text-purple-600  mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="font-medium text-purple-600">ECG Analysis</span>
              </div>
            </Link>
            
            <Link href="/lab-reports" className="p-4 bg-yellow-50  rounded-lg hover:bg-yellow-100  transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-yellow-100  rounded-full flex items-center justify-center text-yellow-600  mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="font-medium text-yellow-600">Lab Reports</span>
              </div>
            </Link>
            
            <Link href="/mental-health" className="p-4 bg-pink-50  rounded-lg hover:bg-pink-100  transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-pink-100  rounded-full flex items-center justify-center text-pink-600  mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="font-medium text-pink-600">Mental Health</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white  p-6 rounded-lg shadow-sm border border-gray-200 ">
          <h2 className="text-xl font-bold mb-4 text-black">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center text-green-600 ">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-black">Lab report analyzed</h3>
                <p className="text-sm text-gray-600 ">Your blood test results were analyzed. All values are within normal range.</p>
                <span className="text-xs text-gray-500 ">Today, 10:23 AM</span>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100  rounded-full flex items-center justify-center text-blue-600 ">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-black">Appointment scheduled</h3>
                <p className="text-sm text-gray-600 ">Dental check-up with Dr. Smith on April 23, 2025 at 2:00 PM.</p>
                <span className="text-xs text-gray-500 ">Yesterday, 3:45 PM</span>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center text-purple-600 ">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                  <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                  <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-black">Medical records updated</h3>
                <p className="text-sm text-gray-600 ">Your medical history was updated with recent vaccination information.</p>
                <span className="text-xs text-gray-500 ">April 15, 2025</span>
              </div>
            </div>
            
            <div className="pt-2">
              <Link href="/profile" className="text-sm text-blue-600  hover:underline">
                View all activity →
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Emergency Section */}
      <div className="bg-red-50  border-red-200  rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-red-700 ">Emergency Assistance</h2>
            <p className="text-red-600 ">
              Get immediate help for medical emergencies with our AI-guided assistance.
            </p>
          </div>
          <Link href="/emergency">
            <div className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Access Emergency Help
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}