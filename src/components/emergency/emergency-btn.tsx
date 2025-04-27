'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

import { useRouter } from 'next/navigation';

export default function EmergencyButton() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleCallAmbulance = () => {
    // For mobile devices, attempt to initiate a phone call
    if (typeof window !== 'undefined') {
      window.location.href = 'tel:102';
    }
  };

  const handleFindNearbyHospitals = () => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      // Show loading or pending state
      const confirmSearch = window.confirm("This will open Google Maps to show hospitals near your current location. Allow location access when prompted.");
      
      if (confirmSearch) {
        navigator.geolocation.getCurrentPosition(
          // Success callback
          (position) => {
            const { latitude, longitude } = position.coords;
            const mapsUrl = `https://www.google.com/maps/search/hospitals+near+me/@${latitude},${longitude},13z`;
            window.open(mapsUrl, '_blank');
            setIsOpen(false);
          },
          // Error callback
          (error) => {
            console.error("Geolocation error:", error);
            
            // Fall back to general search without coordinates
            if (window.confirm("Could not access your location. Open a general search for hospitals instead?")) {
              window.open("https://www.google.com/maps/search/hospitals+near+me", "_blank");
              setIsOpen(false);
            }
          },
          // Options
          { 
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      }
    } else {
      // Browser doesn't support geolocation
      window.open("https://www.google.com/maps/search/hospitals", "_blank");
      setIsOpen(false);
    }
  };

  const handleNotifyContacts = () => {
    if (!user) {
      // If user is not logged in, redirect to profile page to set up contacts
      router.push('/profile?setup=emergency-contacts');
    } else {
      // If user is logged in, notify their emergency contacts
      // This would be implemented in a real application
      alert('Notifying your emergency contacts...');
    }
  };

  return (
    <div 
      className="fixed bottom-6 right-6 z-50" 
      ref={menuRef}
    >
      {/* Main emergency button */}
      <button
        onClick={toggleMenu}
        className="flex items-center justify-center w-16 h-16 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-400 transition-all duration-300 animate-pulse hover:animate-none"
        aria-label="Emergency Button"
      >
        <span className="sr-only">Emergency</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="absolute -top-1 -right-1 bg-white text-red-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border border-red-600">!</span>
      </button>

      {/* Emergency submenu */}
      <div 
        className={`absolute bottom-20 right-0 bg-white rounded-lg shadow-xl w-72 overflow-hidden transform transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-red-600 text-white py-3 px-4 font-bold text-xl text-center">
          EMERGENCY SERVICES
        </div>
        
        <div className="divide-y divide-gray-200">
          {/* Call Ambulance */}
          <button
            onClick={handleCallAmbulance}
            className="flex items-center w-full px-4 py-3 hover:bg-red-50 transition-colors"
          >
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-red-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-bold text-red-800">Call Ambulance</div>
              <div className="text-sm text-gray-600">Call 108 (India)</div>
            </div>
          </button>

          {/* CPR Instructions */}
          <Link
            href="/emergency"
            className="flex items-center w-full px-4 py-3 hover:bg-red-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-red-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-bold text-red-800">CPR Instructions</div>
              <div className="text-sm text-gray-600">Step-by-step guide</div>
            </div>
          </Link>

          {/* Bleeding/Choking */}
          <Link
            href="/emergency?guide=first-aid"
            className="flex items-center w-full px-4 py-3 hover:bg-red-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-red-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-bold text-red-800">First Aid</div>
              <div className="text-sm text-gray-600">Bleeding and choking help</div>
            </div>
          </Link>

          {/* Allergic Reaction */}
          <Link
            href="/emergency?guide=allergic-reaction"
            className="flex items-center w-full px-4 py-3 hover:bg-red-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-red-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-bold text-red-800">Allergic Reaction</div>
              <div className="text-sm text-gray-600">EpiPen guide</div>
            </div>
          </Link>

          {/* Nearby Hospitals */}
          <button
            onClick={handleFindNearbyHospitals}
            className="flex items-center w-full px-4 py-3 hover:bg-red-50 transition-colors"
          >
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-red-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-bold text-red-800">Nearby Hospitals</div>
              <div className="text-sm text-gray-600">Find hospitals near you</div>
            </div>
          </button>

          {/* Notify Contacts */}
          <button
            onClick={handleNotifyContacts}
            className="flex items-center w-full px-4 py-3 hover:bg-red-50 transition-colors"
          >
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-red-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-bold text-red-800">Notify Contacts</div>
              <div className="text-sm text-gray-600">Alert emergency contacts</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}