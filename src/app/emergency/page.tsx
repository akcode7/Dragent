'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import CPRGuide from '@/components/emergency/cprguide';

export default function EmergencyPage() {
  const searchParams = useSearchParams();
  const guideType = searchParams.get('guide');
  const [selectedGuide, setSelectedGuide] = useState(guideType || 'cpr');
  
  // Guide content for different emergency types
  const renderGuideContent = () => {
    switch(selectedGuide) {
      case 'cpr':
        return <CPRGuide />;
      
      case 'first-aid':
        return (
          <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 text-red-600">Bleeding and Choking First Aid</h1>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="bg-red-600 p-4">
                <h2 className="text-xl font-bold text-white">Severe Bleeding</h2>
              </div>
              <div className="p-6 text-black">
                <ol className="list-decimal pl-5 space-y-4">
                  <li className="font-bold ">Apply direct pressure
                    <p className="font-normal mt-1">Use a clean cloth or bandage and press firmly on the wound. If blood soaks through, add another cloth on top without removing the first one.</p>
                  </li>
                  <li className="font-bold">Elevate the wound
                    <p className="font-normal mt-1">If possible, raise the injured area above the level of the heart to help reduce blood flow.</p>
                  </li>
                  <li className="font-bold">Apply a tourniquet only as a last resort
                    <p className="font-normal mt-1">For life-threatening limb bleeding that won't stop, apply a tourniquet 2-3 inches above the wound (not on a joint). Note the time of application.</p>
                  </li>
                  <li className="font-bold">Seek immediate medical attention
                    <p className="font-normal mt-1">Call emergency services (108 in India) or get to a hospital immediately.</p>
                  </li>
                </ol>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden text-black">
              <div className="bg-red-600 p-4">
                <h2 className="text-xl font-bold text-white">Choking</h2>
              </div>
              <div className="p-6">
                <h3 className="font-bold mb-2">For a Conscious Adult or Child:</h3>
                <ol className="list-decimal pl-5 space-y-4 mb-6">
                  <li className="font-bold">Ask "Are you choking?"
                    <p className="font-normal mt-1">If the person cannot speak, cough, or breathe, proceed with the Heimlich maneuver.</p>
                  </li>
                  <div>
                  <Image 
                        src="/assets/images/choking.jpg"
                        alt="Choking"
                        width={150} 
                        height={150} 
                        className="object-contain w-56"
                    />
                  </div>
                 
                  <li className="font-bold">Stand behind the person
                    <p className="font-normal mt-1">Wrap your arms around their waist. Lean the person slightly forward.</p>
                  </li>
                  <li className="font-bold">Make a fist
                    <p className="font-normal mt-1">Place your fist just above the person's navel (belly button), thumb side in.</p>
                  </li>
                  <li className="font-bold">Perform abdominal thrusts
                    <p className="font-normal mt-1">Grasp your fist with your other hand and press inward and upward with quick, forceful thrusts.</p>
                  </li>
                  <li className="font-bold">Repeat until object is expelled
                    <p className="font-normal mt-1">Continue thrusts until the object is dislodged or the person becomes unconscious.</p>
                  </li>
                </ol>
                
                <h3 className="font-bold mb-2">If the Person Becomes Unconscious:</h3>
                <ol className="list-decimal pl-5 space-y-4">
                  <li className="font-bold">Lower the person to the ground
                    <p className="font-normal mt-1">Carefully place them on their back.</p>
                  </li>
                  <li className="font-bold">Call emergency services (108 in India)</li>
                  <li className="font-bold">Begin CPR
                    <p className="font-normal mt-1">Start with chest compressions rather than rescue breaths.</p>
                  </li>
                  <li className="font-bold">Check the mouth
                    <p className="font-normal mt-1">Before giving breaths, look in the mouth. If you can see the object, remove it.</p>
                  </li>
                </ol>
              </div>
            </div>
            
            <div className="mt-8 text-center p-4 bg-red-50 border border-red-200 rounded-lg text-gray-500">
              <p className="font-bold text-red-600 mb-2">IMPORTANT REMINDER</p>
              <p>This is a guide only. Always call emergency services (108 in India) in case of emergency.</p>
            </div>
          </div>
        );
      
      case 'allergic-reaction':
        return (
          <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 text-red-600">Allergic Reaction Emergency Guide</h1>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="bg-red-600 p-4">
                <h2 className="text-xl font-bold text-white">Recognizing a Severe Allergic Reaction (Anaphylaxis)</h2>
              </div>
              <div className="p-6 text-black">
                <h3 className="font-bold mb-2">Common symptoms:</h3>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>Swelling of face, lips, tongue, or throat</li>
                  <li>Difficulty breathing or wheezing</li>
                  <li>Rapid, weak pulse</li>
                  <li>Skin rash, hives, or itching</li>
                  <li>Nausea, vomiting, or diarrhea</li>
                  <li>Dizziness, fainting, or loss of consciousness</li>
                </ul>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p className="font-bold text-yellow-800">Anaphylaxis is a medical emergency!</p>
                  <p className="text-yellow-800">Call emergency services (108 in India) immediately if you suspect someone is having a severe allergic reaction.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8 text-black">
              <div className="bg-red-600 p-4">
                <h2 className="text-xl font-bold text-white">Using an EpiPen (Epinephrine Auto-Injector)</h2>
              </div>
              <div className="p-6">
                <ol className="list-decimal pl-5 space-y-4">
                  <li className="font-bold">Remove the EpiPen from its carrier tube
                    <p className="font-normal mt-1">Hold it in your dominant hand with the orange tip pointing downward. Do not put your thumb, fingers, or hand over the orange tip.</p>
                  </li>
                  <li className="font-bold">Remove the blue safety cap
                    <p className="font-normal mt-1">Pull it straight off. Don't bend or twist it.</p>
                  </li>
                  <li className="font-bold">Administer the injection
                    <p className="font-normal mt-1">Place the orange tip against the middle of the outer thigh at a right angle. Swing and push firmly until it clicks. Hold in place for 3 seconds.</p>
                  </li>
                  <li className="font-bold">Remove the EpiPen and massage the injection site
                    <p className="font-normal mt-1">Rub the area for 10 seconds to help with absorption.</p>
                  </li>
                  <li className="font-bold">Seek immediate medical attention
                    <p className="font-normal mt-1">Call emergency services (108 in India) if not already done. The effects of the EpiPen may wear off, and a second dose may be needed.</p>
                  </li>
                </ol>
                <div className="mt-4 p-4 bg-gray-100 rounded-lg ">
                  <h4 className="font-bold">Important Notes:</h4>
                  <ul className="list-disc pl-5 mt-2">
                    <li>An EpiPen can inject through light clothing if necessary</li>
                    <li>The used EpiPen should be given to emergency responders</li>
                    <li>Always check the expiration date on your EpiPen</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="font-bold text-red-600 mb-2">IMPORTANT REMINDER</p>
              <p className="text-gray-500">This is a guide only. Always call emergency services (108 in India) in case of emergency.</p>
            </div>
          </div>
        );
      
      default:
        return <CPRGuide />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <div className="mb-8 flex justify-center">
          <div className="inline-flex bg-gray-200 rounded-lg p-1">
            <button 
              onClick={() => setSelectedGuide('cpr')} 
              className={`px-4 py-2 rounded-md ${selectedGuide === 'cpr' ? 'bg-white shadow-sm font-medium text-red-600' : 'text-gray-600'}`}
            >
              CPR Guide
            </button>
            <button 
              onClick={() => setSelectedGuide('first-aid')} 
              className={`px-4 py-2 rounded-md ${selectedGuide === 'first-aid' ? 'bg-white shadow-sm font-medium text-red-600' : 'text-gray-600'}`}
            >
              Bleeding & Choking
            </button>
            <button 
              onClick={() => setSelectedGuide('allergic-reaction')} 
              className={`px-4 py-2 rounded-md ${selectedGuide === 'allergic-reaction' ? 'bg-white shadow-sm font-medium text-red-600' : 'text-gray-600'}`}
            >
              Allergic Reaction
            </button>
          </div>
        </div>
        
        {renderGuideContent()}
        
        <div className="mt-10 flex justify-center">
          <button 
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = 'tel:108';
              }
            }}
            className="bg-red-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-red-700"
          >
            
            <span>Call Emergency Services (108)</span>
          </button>
        </div>
      </div>
    </div>
  );
}