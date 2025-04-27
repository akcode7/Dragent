'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function CPRGuide() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const cprSteps = [
    {
      title: "Check Responsiveness",
      instruction: "Tap the person's shoulder and shout 'Are you OK?'. Check for breathing and signs of life.",
      image: "/assets/images/cpr1.png", // These image paths are placeholders
      tips: "Look for chest rise, listen for breath, feel for air from mouth and nose."
    },
    {
      title: "Call Emergency Services",
      instruction: "If the person is unresponsive, call emergency services (108 in India) or ask someone else to call while you begin CPR.",
      image: "/assets/images/cpr2.png",
      tips: "Put your phone on speaker mode so you can follow emergency dispatcher instructions."
    },
    {
      title: "Position the Person",
      instruction: "Place the person on their back on a firm, flat surface. Kneel beside them at chest level.",
      image: "/assets/images/cpr3.png",
      tips: "Remove bulky clothing that may interfere with chest compressions."
    },
    {
      title: "Hand Position",
      instruction: "Place the heel of one hand on the center of the chest (lower half of sternum), place your other hand on top and interlace your fingers.",
      image: "/assets/images/cpr4.png",
      tips: "Keep your shoulders directly over your hands with arms straight."
    },
    {
      title: "Perform Compressions",
      instruction: "Push hard and fast in the center of the chest. Aim for a depth of at least 2 inches (5 cm) at a rate of 100-120 compressions per minute.",
      image: "/assets/images/cpr5.jpg",
      tips: "Allow the chest to completely recoil between compressions."
    },
    {
      title: "Airway & Breathing",
      instruction: "After 30 compressions, tilt the head back, lift the chin, pinch the nose and give 2 rescue breaths.",
      image: "/assets/images/cpr6.jpg",
      tips: "Each breath should last about 1 second and make the chest rise visibly."
    },
    {
      title: "Continue CPR",
      instruction: "Repeat cycles of 30 chest compressions followed by 2 rescue breaths until help arrives or the person shows signs of life.",
      image: "/assets/images/cpr7.jpg",
      tips: "If you're unable or unwilling to give rescue breaths, continue with chest compressions only."
    },
    {
      title: "AED Use (If Available)",
      instruction: "If an Automated External Defibrillator (AED) becomes available, turn it on and follow the voice prompts.",
      image: "/assets/images/cpr8.jpg",
      tips: "Minimize interruptions to CPR when using the AED."
    }
  ];

  const nextStep = () => {
    if (currentStep < cprSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 text-red-600">CPR Step-by-Step Guide</h1>
      
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Progress indicator */}
        <div className="bg-red-600 h-1.5 w-full">
          <div 
            className="bg-green-500 h-full transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / cprSteps.length) * 100}%` }}
          ></div>
        </div>
        
        <div className="p-6">
          {/* Step counter */}
          <div className="text-sm text-gray-500 mb-1">
            Step {currentStep + 1} of {cprSteps.length}
          </div>
          
          {/* Current step */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <h2 className="text-xl font-bold mb-3 text-red-600">
                {cprSteps[currentStep].title}
              </h2>
              <p className="text-lg mb-6 text-black">
                {cprSteps[currentStep].instruction}
              </p>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <h3 className="font-bold text-yellow-800">Tips:</h3>
                <p className="text-yellow-800">{cprSteps[currentStep].tips}</p>
              </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center items-center">
              <div className=" p-4 rounded-lg w-full h-64 flex items-center justify-center">
               
                <div className="text-center text-gray-500">
                <Image 
                  src={cprSteps[currentStep].image} 
                  alt={cprSteps[currentStep].title} 
                  width={700} 
                  height={700} 
                  className="object-contain h-full w-full"
                />
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <button 
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-md cursor-pointer ${
                currentStep === 0 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-teal-400 text-white hover:bg-blue-500'
              }`}
            >
              Previous Step
            </button>
            
            <button 
              onClick={nextStep}
              disabled={currentStep === cprSteps.length - 1}
              className={`px-4 py-2 rounded-md cursor-pointer ${
                currentStep === cprSteps.length - 1 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-teal-400 text-white hover:bg-blue-500'
              }`}
            >
              Next Step
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="font-bold text-red-600 mb-2">IMPORTANT REMINDER</p>
        <p className="text-gray-500">This is a guide only. Always call emergency services (108 in India) in case of emergency.</p>
      </div>
    </div>
  );
}