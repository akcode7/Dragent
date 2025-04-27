'use client';

import { useState } from 'react';

interface Medicine {
  id: string;
  name: string;
}

interface MedicineInteraction {
  medicines: string[];
  severity: 'mild' | 'moderate' | 'severe';
  mechanism: string;
  effects: string;
  recommendations: string;
}

interface InteractionResult {
  summary: string;
  interactionFound: boolean;
  interactions: MedicineInteraction[];
  precautions: string[]; // Changed from generalRecommendations
  alternatives?: { medicine: string; alternative: string }[]; // Added as it's in the API response
  disclaimer?: string; // Made optional as it may not be in the response
}

export default function MedicineReactionChecker() {
  const [medicines, setMedicines] = useState<Medicine[]>([
    { id: '1', name: '' }
  ]);
  const [newMedicine, setNewMedicine] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<InteractionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addMedicineField = () => {
    if (newMedicine.trim()) {
      setMedicines([
        ...medicines,
        { id: Date.now().toString(), name: newMedicine.trim() }
      ]);
      setNewMedicine('');
    }
  };

  const updateMedicine = (id: string, value: string) => {
    setMedicines(
      medicines.map(medicine => 
        medicine.id === id ? { ...medicine, name: value } : medicine
      )
    );
  };

  const removeMedicine = (id: string) => {
    setMedicines(medicines.filter(medicine => medicine.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addMedicineField();
    }
  };

  const analyzeMedicines = async () => {
    const medicineNames = medicines
      .map(m => m.name.trim())
      .filter(name => name !== '');
    
    if (medicineNames.length < 2) {
      setError('Please enter at least two medicines to check for interactions.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    try {
      const response = await fetch('/api/medicine-interactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ medicineNames }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check medicine interactions');
      }
      
      const interactionResult = await response.json();
      setResult(interactionResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check medicine interactions');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Medicine Interaction Checker</h1>
        <p className="text-blue-600">
          Enter multiple medicines to check for potential harmful interactions between them.
        </p>
      </div>

      <div className="mb-6">
        <div className="space-y-3">
          {medicines.map((medicine) => (
            <div key={medicine.id} className="flex items-center gap-2">
              <input
                type="text"
                value={medicine.name}
                onChange={(e) => updateMedicine(medicine.id, e.target.value)}
                placeholder="Enter medicine name"
                className="flex-grow p-2 border border-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => removeMedicine(medicine.id)}
                className="p-2 text-red-500 cursor-pointer hover:text-red-700"
                aria-label="Remove medicine"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="flex mt-3">
          <input
            type="text"
            value={newMedicine}
            onChange={(e) => setNewMedicine(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Add another medicine"
            className="flex-grow p-2 border border-gray-300 rounded-l  text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addMedicineField}
            className="px-4 py-2 bg-blue-500 text-white rounded-r cursor-pointer hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>

      <div className="mb-8">
        <button
          onClick={analyzeMedicines}
          disabled={isAnalyzing}
          className="w-full py-2 bg-teal-500 text-white rounded hover:bg-teal-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? 'Analyzing...' : 'Check Interactions'}
        </button>
      </div>

      {error && (
        <div className="p-3 mb-6 text-red-800 bg-red-100 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="border border-gray-200 rounded-lg p-5">
          <h2 className="text-xl font-semibold mb-3 text-black">Analysis Results</h2>
          
          <div className="mb-4">
            <h3 className="font-medium text-gray-800">Summary</h3>
            <p className="text-gray-600">{result.summary}</p>
          </div>

          {result.interactionFound ? (
            <div className="mb-4">
              <h3 className="font-medium text-gray-800 mb-2">Identified Interactions</h3>
              {result.interactions.map((interaction, index) => (
                <div key={index} className="mb-3 p-3 bg-gray-50 rounded">
                  <div className="flex justify-between items-center">
                    <div className="font-medium text-black">{interaction.medicines.join(' + ')}</div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      interaction.severity === 'mild' ? 'bg-yellow-100 text-yellow-800' : 
                      interaction.severity === 'moderate' ? 'bg-orange-100 text-orange-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {interaction.severity} severity
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-1 gap-2">
                    <div>
                      <span className="text-sm font-medium text-black">Mechanism:</span> 
                      <p className="text-sm text-gray-600">{interaction.mechanism}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-black">Potential Effects:</span> 
                      <p className="text-sm text-gray-600">{interaction.effects}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-black">Recommendations:</span> 
                      <p className="text-sm text-gray-600">{interaction.recommendations}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-4 p-3 bg-green-50 text-green-800 rounded">
              No significant interactions were found between these medications.
            </div>
          )}

          {result.precautions && result.precautions.length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium text-gray-800 mb-1">Precautions</h3>
              <ul className="list-disc pl-5 space-y-1">
                {result.precautions.map((precaution, index) => (
                  <li key={index} className="text-gray-600">{precaution}</li>
                ))}
              </ul>
            </div>
          )}

          {result.alternatives && result.alternatives.length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium text-gray-800 mb-1">Alternative Medications</h3>
              <ul className="list-disc pl-5 space-y-1">
                {result.alternatives.map((alt, index) => (
                  <li key={index} className="text-gray-600">
                    <span className="font-medium">{alt.medicine}</span>: Consider {alt.alternative} as an alternative
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.disclaimer && (
            <div className="mt-4 text-xs text-gray-500 italic">
              {result.disclaimer}
            </div>
          )}
        </div>
      )}
    </div>
  );
}