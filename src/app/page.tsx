import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section with Medical Theme */}
      <section className="flex flex-col items-center justify-center py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-blue-50 opacity-70"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="opacity-20">
              <path fill="#0099ff" fillOpacity="0.5" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,224C672,213,768,171,864,165.3C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
            </svg>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2 text-left">
              <div className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium mb-4">
                AI-Powered Healthcare
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-gray-900">
                Your Personal <span className="text-teal-400">AI Doctor</span> Assistant
              </h1>
              <p className="text-lg mb-8 text-gray-700">
                Advanced medical diagnostics and health monitoring powered by artificial intelligence for better healthcare decisions.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/signup"
                  className="px-8 py-3 bg-teal-400 text-white font-medium rounded-lg hover:bg-teal-500 transition-all shadow-lg transform hover:-translate-y-1"
                >
                  Get Started
                </Link>
                <Link
                  href="/ecg-analysis"
                  className="px-8 py-3 bg-white border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-all shadow-lg transform hover:-translate-y-1"
                >
                  Try ECG Analysis
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center relative">
              <div className="w-72 h-72 md:w-96 md:h-96 relative">
                <div className="absolute inset-0  rounded-full shadow-2xl"></div>
                <Image
                  src="/assets/images/heroai.png"
                  alt="AI Doctor"
                  width={400}
                  height={400}
                  className="rounded-full shadow-xl border-4 border-white"
                />
              </div>
              <div className="absolute top-0 right-0 bg-blue-600 text-white p-3 rounded-full shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <p className="text-3xl font-bold text-blue-600">80%</p>
              <p className="text-gray-600">Diagnostic Accuracy</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-bold text-blue-600">24/7</p>
              <p className="text-gray-600">Availability</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-bold text-blue-600">6+</p>
              <p className="text-gray-600">Features</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-bold text-blue-600">8+</p>
              <p className="text-gray-600">Medical Specialties</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Carousel */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Medical AI Features</h2>
            <p className="text-gray-600 mt-2">Advanced diagnostic tools at your fingertips</p>
          </div>
          
          {/* Carousel - In a real implementation, you'd use a carousel library */}
          <div className="overflow-x-auto pb-6">
            <div className="flex gap-6 w-max px-4">
              {/* Feature Card 1 - Neomorphism Style */}
              <div className="flex-shrink-0 w-80 bg-white rounded-xl p-6 shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] hover:shadow-[inset_8px_8px_16px_#d9d9d9,inset_-8px_-8px_16px_#ffffff] transition-all duration-300">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-center text-blue-500">ECG Analysis</h3>
                <p className="text-center text-gray-600">
                  Upload your ECG report and get instant AI-powered analysis and interpretation.
                </p>
                <div className="mt-4 text-center">
                  <Link href="/ecg-analysis" className="inline-block text-teal-400 hover:text-teal-500 font-medium">
                    Learn More →
                  </Link>
                </div>
              </div>

              {/* Feature Card 2 - Neomorphism Style */}
              <div className="flex-shrink-0 w-80 bg-white rounded-xl p-6 shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] hover:shadow-[inset_8px_8px_16px_#d9d9d9,inset_-8px_-8px_16px_#ffffff] transition-all duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-center text-blue-500">Lab Reports</h3>
                <p className="text-center text-gray-600">
                  Get detailed explanations and insights from your laboratory test results.
                </p>
                <div className="mt-4 text-center">
                  <Link href="/lab-reports" className="inline-block text-blue-600 hover:text-blue-700 font-medium">
                    Learn More →
                  </Link>
                </div>
              </div>

              {/* Feature Card 3 - Neomorphism Style */}
              <div className="flex-shrink-0 w-80 bg-white rounded-xl p-6 shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] hover:shadow-[inset_8px_8px_16px_#d9d9d9,inset_-8px_-8px_16px_#ffffff] transition-all duration-300">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-center text-blue-500">Personal AI Doctor</h3>
                <p className="text-center text-gray-600">
                  Chat with your personal AI doctor for health advice and medical information.
                </p>
                <div className="mt-4 text-center">
                  <Link href="/personal-ai-doc" className="inline-block text-teal-400 hover:text-teal-500 font-medium">
                    Learn More →
                  </Link>
                </div>
              </div>

              {/* Feature Card 4 - Neomorphism Style */}
              <div className="flex-shrink-0 w-80 bg-white rounded-xl p-6 shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] hover:shadow-[inset_8px_8px_16px_#d9d9d9,inset_-8px_-8px_16px_#ffffff] transition-all duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-center text-blue-500">Dermatology AI</h3>
                <p className="text-center text-gray-600">
                  Upload photos of skin conditions for AI analysis and preliminary diagnosis.
                </p>
                <div className="mt-4 text-center">
                  <Link href="/dermotology-ai" className="inline-block text-blue-600 hover:text-blue-700 font-medium">
                    Learn More →
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Carousel Navigation Dots */}
          <div className="flex justify-center mt-8 gap-2">
            <button className="w-3 h-3 rounded-full bg-teal-400"></button>
            <button className="w-3 h-3 rounded-full bg-gray-300 hover:bg-teal-400"></button>
            <button className="w-3 h-3 rounded-full bg-gray-300 hover:bg-teal-400"></button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="text-gray-600 mt-2">Simple steps to get your AI doctor consultation</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-block relative">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
              
              </div>
              <h3 className="text-xl font-bold mb-2 text-blue-500">Upload Medical Data</h3>
              <p className="text-gray-600">
                Upload your ECG, lab reports, or describe your symptoms securely.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-block relative">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-teal-500">2</span>
                </div>
               
              </div>
              <h3 className="text-xl font-bold mb-2 text-blue-500">AI Analysis</h3>
              <p className="text-gray-600">
                Our advanced AI algorithms analyze your data for accurate insights.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-blue-500">Get Results</h3>
              <p className="text-gray-600">
                Receive detailed reports, recommendations, and follow-up guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="py-10 px-4 bg-red-50 border-y border-red-100">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-red-600">Emergency Help</h2>
            <p className="text-gray-700">
              Need immediate medical guidance? Access our emergency resources.
            </p>
          </div>
          <Link
            href="/emergency"
            className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            Emergency Resources
          </Link>
        </div>
      </section>

      {/* Testimonials with Neomorphism */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What Our Users Say</h2>
            <p className="text-gray-600 mt-2">Real testimonials from healthcare professionals and patients</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-xl p-6 shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] relative">
              <div className="absolute -top-5 left-6 text-5xl text-teal-200">"</div>
              <p className="text-gray-600 mb-4 relative z-10">
                The ECG analysis tool saved precious time in our emergency department. It provided instant insights that helped us make critical decisions faster.
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-teal-500">DR</span>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-teal-500">Dr. Robert Chen</p>
                  <p className="text-sm text-gray-500">Cardiologist</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white rounded-xl p-6 shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] relative">
              <div className="absolute -top-5 left-6 text-5xl text-blue-200">"</div>
              <p className="text-gray-600 mb-4 relative z-10">
                I use the lab reports analyzer regularly to help explain complex test results to my patients in simple terms they can understand.
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-600">JS</span>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-teal-500">Dr. Jennifer Smith</p>
                  <p className="text-sm text-gray-500">Family Physician</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white rounded-xl p-6 shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff] relative">
              <div className="absolute -top-5 left-6 text-5xl text-teal-200">"</div>
              <p className="text-gray-600 mb-4 relative z-10">
                As someone with chronic conditions, having 24/7 access to the AI doctor for quick questions gives me peace of mind between appointments.
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-teal-500">MJ</span>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-teal-500">Michael Johnson</p>
                  <p className="text-sm text-gray-500">Patient</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-teal-400 to-blue-600 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to experience advanced AI healthcare?</h2>
          <p className="mb-8 text-lg opacity-90">Sign up now and get instant access to all medical AI features.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-all shadow-lg transform hover:-translate-y-1"
            >
              Get Started for Free
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/20 transition-all shadow-lg transform hover:-translate-y-1"
            >
              View Dashboard Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}