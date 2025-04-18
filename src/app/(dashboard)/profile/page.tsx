'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { appwriteService } from '@/lib/api/appwrite';

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Form fields
  const [name, setName] = useState(user?.profile?.name || user?.user?.name || '');
  const [email, setEmail] = useState(user?.user?.email || user?.profile?.email || '');
  const [phone, setPhone] = useState(user?.profile?.phone || '');
  const [address, setAddress] = useState(user?.profile?.address || '');

  // Medical information
  const [birthDate, setBirthDate] = useState(user?.profile?.birthDate || '');
  const [gender, setGender] = useState(user?.profile?.gender || '');
  const [height, setHeight] = useState(user?.profile?.height || '');
  const [weight, setWeight] = useState(user?.profile?.weight || '');
  const [bloodType, setBloodType] = useState(user?.profile?.bloodType || '');
  const [allergies, setAllergies] = useState(user?.profile?.allergies || '');
  const [conditions, setConditions] = useState(user?.profile?.conditions || '');
  const [medications, setMedications] = useState(user?.profile?.medications || '');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    
    if (!user?.profile?.$id || !user?.user?.$id) {
      setError("User profile not found");
      setLoading(false);
      return;
    }

    try {
      const result = await appwriteService.updateUserProfile(
        user.profile.$id,
        { 
          name,
          phone,
          address,
          birthDate,
          gender,
          height,
          weight,
          bloodType,
          allergies,
          conditions,
          medications
        }
      );

      if (result) {
        setSuccess(true);
        // Update local state for any fields that were changed
      } else {
        setError("Failed to update profile");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md">
          Profile updated successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Email address cannot be changed
              </p>
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
              />
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1">
                Address
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
              />
            </div>
          </div>
        </div>
        
        {/* Medical Information Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4">Medical Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium mb-1">
                Birth Date
              </label>
              <input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
              />
            </div>
            
            <div>
              <label htmlFor="gender" className="block text-sm font-medium mb-1">
                Gender
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="height" className="block text-sm font-medium mb-1">
                Height (cm)
              </label>
              <input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
              />
            </div>
            
            <div>
              <label htmlFor="weight" className="block text-sm font-medium mb-1">
                Weight (kg)
              </label>
              <input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
              />
            </div>
            
            <div>
              <label htmlFor="bloodType" className="block text-sm font-medium mb-1">
                Blood Type
              </label>
              <select
                id="bloodType"
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
              >
                <option value="">Select blood type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="allergies" className="block text-sm font-medium mb-1">
                Allergies
              </label>
              <textarea
                id="allergies"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 min-h-[80px]"
                placeholder="List any allergies you have..."
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="conditions" className="block text-sm font-medium mb-1">
                Existing Medical Conditions
              </label>
              <textarea
                id="conditions"
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 min-h-[80px]"
                placeholder="List any existing medical conditions..."
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="medications" className="block text-sm font-medium mb-1">
                Current Medications
              </label>
              <textarea
                id="medications"
                value={medications}
                onChange={(e) => setMedications(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 min-h-[80px]"
                placeholder="List any medications you are currently taking..."
              />
            </div>
          </div>
        </div>
        
        {/* Account Settings Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4">Account Settings</h2>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Change Password</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              To change your password, we'll send a password reset link to your email address.
            </p>
            <Link href="/forgot-password" className="inline-block text-white bg-teal-500 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors">
              Reset Password
            </Link>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-medium mb-2 text-red-600 dark:text-red-400">Danger Zone</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Permanently delete your account and all of your data.
            </p>
            <button
              type="button"
              className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors"
              onClick={() => {
                if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                  // Implement delete account logic
                }
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-teal-500 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}