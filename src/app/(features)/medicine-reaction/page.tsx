import MedicineReactionChecker from "@/components/medicine-reaction/medicine-reaction-checker";

export const metadata = {
  title: "Medicine Reaction Checker | Dragent",
  description: "Check for potential interactions between different medications",
};

export default function MedicineReactionPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Medicine Reaction Checker</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Our advanced AI system can help identify potential interactions between different medications
          you're taking, helping you avoid harmful side effects and ensure safe treatment.
        </p>
      </div>
      
      <MedicineReactionChecker />
      
      <div className="mt-12 bg-blue-50 p-6 rounded-lg max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">About Medicine Interactions</h2>
        <p className="text-gray-600 mb-4">
          Medicine interactions can occur when two or more medications affect each other's activity
          or interfere with how your body processes them. These interactions can sometimes make
          medications less effective, increase their side effects, or cause unexpected reactions.
        </p>
        
        <h3 className="text-lg font-medium text-gray-800 mb-2">Important Disclaimer</h3>
        <p className="text-gray-600">
          While our AI system is designed to provide accurate information about potential drug interactions,
          it should not replace professional medical advice. Always consult with your healthcare provider
          or pharmacist before making any changes to your medication regimen.
        </p>
      </div>
    </div>
  );
}