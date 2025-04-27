import { NextResponse } from 'next/server';
import { groqClient } from '@/lib/api/groq';

// Define medical categories and their common symptoms
const MEDICAL_CATEGORIES = {
  GASTRO: {
    name: 'Gastroenterology',
    specialist: 'Gastroenterologist',
    symptoms: ['stomach', 'nausea', 'vomiting', 'diarrhea', 'constipation', 'abdominal pain', 'heartburn', 'indigestion', 'bloating', 'gas', 'bowel']
  },
  RESPIRATORY: {
    name: 'Respiratory',
    specialist: 'Pulmonologist',
    symptoms: ['chest pain', 'breathing', 'shortness of breath', 'cough', 'wheezing', 'lung', 'respiratory']
  },
  CARDIO: {
    name: 'Cardiology',
    specialist: 'Cardiologist',
    symptoms: ['heart', 'palpitation', 'chest pain', 'hypertension', 'blood pressure', 'cholesterol', 'arrhythmia']
  },
  NEURO: {
    name: 'Neurology',
    specialist: 'Neurologist',
    symptoms: ['headache', 'migraine', 'seizure', 'dizziness', 'tremor', 'memory', 'numbness', 'tingling', 'brain']
  },
  ORTHO: {
    name: 'Orthopedics',
    specialist: 'Orthopedic surgeon',
    symptoms: ['joint', 'bone', 'muscle', 'back pain', 'neck pain', 'fracture', 'sprain', 'arthritis']
  },
  DERM: {
    name: 'Dermatology',
    specialist: 'Dermatologist',
    symptoms: ['skin', 'rash', 'acne', 'eczema', 'psoriasis', 'mole', 'itching', 'hair loss']
  },
  ENT: {
    name: 'Ear, Nose & Throat',
    specialist: 'ENT specialist',
    symptoms: ['ear', 'nose', 'throat', 'sinus', 'hearing', 'voice', 'tonsil', 'snoring']
  },
  ENDOCRINE: {
    name: 'Endocrinology',
    specialist: 'Endocrinologist',
    symptoms: ['diabetes', 'thyroid', 'hormone', 'weight gain', 'weight loss', 'fatigue', 'thirst']
  },
  UROLOGY: {
    name: 'Urology',
    specialist: 'Urologist',
    symptoms: ['urination', 'kidney', 'bladder', 'prostate', 'urine', 'erectile', 'testicular']
  },
  GYNECOLOGY: {
    name: 'Gynecology',
    specialist: 'Gynecologist',
    symptoms: ['menstrual', 'period', 'pelvic pain', 'vaginal', 'ovarian', 'uterus', 'pregnancy']
  },
  OPHTHALMO: {
    name: 'Ophthalmology',
    specialist: 'Ophthalmologist',
    symptoms: ['eye', 'vision', 'blurry', 'glaucoma', 'cataract']
  },
  DENTAL: {
    name: 'Dentistry',
    specialist: 'Dentist',
    symptoms: ['tooth', 'teeth', 'gum', 'jaw', 'cavity', 'toothache', 'dental pain', 'mouth', 'tongue', 'bad breath', 'bleeding gums', 'sensitive teeth', 'wisdom tooth']
  },
  GENERAL: {
    name: 'General Medicine',
    specialist: 'Primary care physician',
    symptoms: ['fever', 'flu', 'cold', 'fatigue', 'pain', 'infection', 'general']
  }
};

export async function POST(request: Request) {
    try {
        const { message, currentState } = await request.json();
        let newState = { ...currentState };
        let botResponse = '';

        // Initial symptoms description to determine category
        if (newState.step === 1) {
            newState.patient.symptoms = message.split(',').map((s: string) => s.trim());
            
            // Determine medical category based on symptoms
            const category = determineCategory(message);
            newState.category = category.key;
            
            botResponse = `Based on your description, you might want to consult with a ${category.specialist}. Let's gather more information to better understand your situation. Please enter your age:`;
            newState.step = 2;
            
            return NextResponse.json({ response: botResponse, newState });
        }

        // Handle the conversation flow based on current step
        switch(newState.step) {
            case 2: // Collecting age
                newState.patient.age = message;
                botResponse = `Thank you. Please enter your biological sex (Male/Female/Other):`;
                newState.step = 3;
                break;

            case 3: // Collecting sex
                newState.patient.sex = message;
                botResponse = `How long have you been experiencing these symptoms? (e.g., 2 days, 1 week, several months)`;
                newState.step = 4;
                break;

            case 4: // Collecting duration
                newState.patient.duration = message;
                botResponse = `Are these symptoms constant or do they come and go? (Yes/No for constant):`;
                newState.step = 5;
                break;

            case 5: // Collecting constancy info
                newState.patient.isConstant = message.toLowerCase().includes('yes');
                botResponse = `On a scale of 1 to 10, how severe would you rate your symptoms?`;
                newState.step = 6;
                break;

            case 6: // Collecting severity
                newState.patient.severity = parseInt(message, 10);
                botResponse = `Do you have any known medical conditions or diagnoses? (List them separated by commas, or type "none")`;
                newState.step = 7;
                break;

            case 7: // Previous medical conditions
                if (message.toLowerCase() !== 'none') {
                    newState.patient.previousConditions = message.split(',').map((c: string) => c.trim());
                }
                botResponse = `Are you currently taking any medications? (List them separated by commas, or type "none")`;
                newState.step = 8;
                break;

            case 8: // Current medications
                if (message.toLowerCase() !== 'none') {
                    newState.patient.medications = message.split(',').map((m: string) => m.trim());
                }
                
                // Check for category-specific follow-up questions
                switch(newState.category) {
                    case 'GASTRO':
                        botResponse = `Do your symptoms improve or worsen after eating? (Improve/Worsen/Neither)`;
                        newState.step = 9;
                        break;
                    case 'RESPIRATORY':
                    case 'CARDIO':
                        botResponse = `Do your symptoms worsen with physical activity? (Yes/No)`;
                        newState.step = 9;
                        break;
                    case 'NEURO':
                        botResponse = `Do your symptoms include any changes in vision, hearing, or sense of touch? (Yes/No)`;
                        newState.step = 9;
                        break;
                    case 'DERM':
                        botResponse = `Is there any itching, pain, or discomfort associated with your skin condition? (Yes/No)`;
                        newState.step = 9;
                        break;
                    default:
                        // Go directly to diagnosis for other categories
                        const diagnosis = await getDiagnosis(newState.patient, newState.category);
                        botResponse = formatDiagnosis(diagnosis);
                        newState.step = 10; // Final step
                }
                break;

            case 9: // Category-specific follow up
                // Store the answer for category-specific question
                newState.patient.categorySpecificAnswer = message;
                
                // Get diagnosis
                const diagnosis = await getDiagnosis(newState.patient, newState.category);
                botResponse = formatDiagnosis(diagnosis);
                newState.step = 10; // Final step
                break;

            case 10: // Post-diagnosis follow-up
                // Handle any follow-up questions after diagnosis
                if (message.toLowerCase().includes('medicine') || message.toLowerCase().includes('treatment')) {
                    botResponse = `I understand you're looking for relief, ${newState.patient.name}. While I can provide general information about management options, it's important to consult a healthcare professional for specific medical advice and prescriptions tailored to your situation.`;
                } else if (message.toLowerCase().includes('more information') || message.toLowerCase().includes('tell me more')) {
                    botResponse = await getMoreDetailedInformation(newState.patient, newState.category);
                } else if (message.toLowerCase().includes('yes')) {
                    botResponse = await getGeneralAdvice(newState.patient, newState.category);
                } else {
                    // If it's a new question, analyze it with Groq
                    botResponse = await getFollowUpResponse(message, newState.patient, newState.category);
                }
                break;

            default:
                botResponse = "Let's start over. Please describe what medical concerns you'd like to discuss today:";
                newState.step = 1;
        }

        return NextResponse.json({ response: botResponse, newState });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

function determineCategory(symptomsText: string): { key: string, name: string, specialist: string } {
    // Convert to lowercase for case-insensitive matching
    const lowerCaseText = symptomsText.toLowerCase();
    
    // Count matches for each category
    const categoryMatches = Object.entries(MEDICAL_CATEGORIES).map(([key, category]) => {
        const matchCount = category.symptoms.filter(symptom => 
            lowerCaseText.includes(symptom.toLowerCase())
        ).length;
        
        return { key, category, matchCount };
    });
    
    // Sort by match count (descending)
    categoryMatches.sort((a, b) => b.matchCount - a.matchCount);
    
    // Select the category with most matches, or General if no good matches
    const bestMatch = categoryMatches[0].matchCount > 0 
        ? categoryMatches[0] 
        : { key: 'GENERAL', category: MEDICAL_CATEGORIES.GENERAL };
    
    return { 
        key: bestMatch.key, 
        name: bestMatch.category.name,
        specialist: bestMatch.category.specialist
    };
}

async function getDiagnosis(patient: any, category: string) {
    try {
        const symptoms = patient.symptoms.join(', ');
        const age = patient.age;
        const sex = patient.sex;
        const duration = patient.duration || 'unknown duration';
        const previousConditions = patient.previousConditions?.length > 0 
            ? patient.previousConditions.join(', ') 
            : 'none';
        const medications = patient.medications?.length > 0 
            ? patient.medications.join(', ') 
            : 'none';
        
        const additionalInfo = [];
        if (patient.isConstant) additionalInfo.push('Symptoms are constant');
        else additionalInfo.push('Symptoms come and go');
        
        if (patient.severity) additionalInfo.push(`Severity: ${patient.severity}/10`);
        
        if (patient.categorySpecificAnswer) {
            additionalInfo.push(`Category-specific information: ${patient.categorySpecificAnswer}`);
        }

        const categoryInfo = category ? `Medical category: ${MEDICAL_CATEGORIES[category]?.name || 'General Medicine'}` : '';

        const prompt = `Patient: ${patient.name || ''}, ${age} years old, ${sex}
Symptoms: ${symptoms}
Duration: ${duration}
Previous medical conditions: ${previousConditions}
Current medications: ${medications}
${categoryInfo}
${additionalInfo.length > 0 ? 'Additional Information: ' + additionalInfo.join(', ') : ''}

You MUST respond with ONLY a valid JSON object and nothing else - no explanation text.
Generate a structured response with the top 3 most likely conditions based on the symptoms and information above.
Format your response exactly as follows:
{
    "conditions": [
        {"condition": "Condition Name 1", "likelihood": 50},
        {"condition": "Condition Name 2", "likelihood": 30},
        {"condition": "Condition Name 3", "likelihood": 20}
    ]
}
Remember that the percentages must add up to 100%.`;

        const completion = await groqClient.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: "You are a medical diagnostic AI assistant. You ONLY respond with valid JSON in exactly the requested format, with no additional text, explanations, or markdown formatting. Your response should be a single JSON object that can be directly parsed." 
                },
                { role: "user", content: prompt }
            ],
            model: "llama3-70b-8192",
            temperature: 0.3,
            max_tokens: 500,
            top_p: 0.9,
            response_format: { type: "json_object" } // Force JSON response format
        });

        const responseText = completion.choices[0].message.content || '';
        console.log('Raw API Response:', responseText);
        
        try {
            // First attempt: directly parse the response
            try {
                const result = JSON.parse(responseText);
                
                // Validate structure
                if (result.conditions && Array.isArray(result.conditions)) {
                    return result;
                }
            } catch (directParseError) {
                console.log('Direct parsing failed, trying cleanup methods');
            }
            
            // Second attempt: Try to extract JSON from potential markdown or additional text
            let jsonText = responseText;
            
            // Remove markdown code blocks if present
            if (jsonText.includes('```')) {
                const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
                if (jsonMatch && jsonMatch[1]) {
                    jsonText = jsonMatch[1];
                }
            }
            
            // Try to find and extract just the JSON object if there's surrounding text
            const objectMatch = jsonText.match(/{[\s\S]*?}/);
            if (objectMatch) {
                jsonText = objectMatch[0];
            }
            
            // Clean the string for parsing
            jsonText = jsonText.trim();
            
            // Parse the cleaned text
            const result = JSON.parse(jsonText);
            
            // Validate structure
            if (!result.conditions || !Array.isArray(result.conditions)) {
                throw new Error('Invalid response structure');
            }
            
            return result;
            
        } catch (parseError) {
            console.error('Parsing failed. Raw response:', responseText);
            
            // As a fallback, create a valid structure with a generic message
            return {
                conditions: [
                    { condition: "Unidentified Condition", likelihood: 100 }
                ]
            };
        }
    } catch (error: any) {
        console.error('Diagnosis Error:', error);
        return { 
            conditions: [
                { condition: "Could not determine - please try again", likelihood: 100 }
            ]
        };
    }
}

function formatDiagnosis(diagnosis: any) {
    if (diagnosis.error) return diagnosis.error;
    
    let response = "Based on your symptoms, possible conditions are:\n";
    diagnosis.conditions.forEach((cond: any) => {
        response += `• ${cond.condition}: ${cond.likelihood}%\n`;
    });
    response += "\nPlease consult a medical professional for accurate diagnosis. Would you like some general information about managing your symptoms?";
    
    return response;
}

async function getGeneralAdvice(patient: any, category: string) {
    try {
        const symptoms = patient.symptoms.join(', ');
        const categoryName = category ? MEDICAL_CATEGORIES[category]?.name || 'General Medicine' : 'General Medicine';
        
        const prompt = `A patient is experiencing the following symptoms: ${symptoms}. 
        The symptoms are related to ${categoryName}.
        Provide brief, helpful general advice for managing these symptoms at home. 
        Include when they should seek professional medical help.
        Keep your response under 250 words and focus on practical, safe advice.`;

        const completion = await groqClient.chat.completions.create({
            messages: [
                { role: "system", content: "You are a medical information assistant providing general health advice. You always recommend seeing a doctor for proper diagnosis and treatment." },
                { role: "user", content: prompt }
            ],
            model: "llama3-70b-8192",
            temperature: 0.3,
            max_tokens: 500
        });

        return completion.choices[0].message.content || 'I recommend consulting a healthcare professional for personalized advice.';
    } catch (error: any) {
        console.error('General advice error:', error);
        return 'I recommend consulting a healthcare professional for advice tailored to your situation.';
    }
}

async function getMoreDetailedInformation(patient: any, category: string) {
    try {
        const conditions = patient.lastDiagnosis?.conditions || [];
        const topCondition = conditions[0]?.condition || '';
        const categoryName = category ? MEDICAL_CATEGORIES[category]?.name || 'General Medicine' : 'General Medicine';
        
        const prompt = `Provide more detailed information about ${topCondition || 'the possible conditions'} 
        in the field of ${categoryName}, related to these symptoms: ${patient.symptoms.join(', ')}. 
        Include common causes, typical progression, and when to seek immediate medical attention.
        Keep your response under 300 words and ensure it's factually accurate.`;

        const completion = await groqClient.chat.completions.create({
            messages: [
                { role: "system", content: "You are a medical information assistant providing educational content. You do not provide medical advice, only factual information." },
                { role: "user", content: prompt }
            ],
            model: "llama3-70b-8192",
            temperature: 0.3,
            max_tokens: 600
        });

        return completion.choices[0].message.content || 'I recommend consulting a healthcare professional for more detailed information.';
    } catch (error: any) {
        console.error('Detailed info error:', error);
        return 'For more detailed information about your condition, I recommend consulting with a healthcare professional who can provide personalized guidance.';
    }
}

async function getFollowUpResponse(question: string, patient: any, category: string) {
    try {
        const symptoms = patient.symptoms.join(', ');
        const categoryName = category ? MEDICAL_CATEGORIES[category]?.name || 'General Medicine' : 'General Medicine';
        
        const prompt = `A patient with the following symptoms: ${symptoms} related to ${categoryName} is asking: "${question}". 
        Provide a helpful, informative response while being clear that you're not providing medical advice.
        Keep your response under 250 words and focus on factual information.`;

        const completion = await groqClient.chat.completions.create({
            messages: [
                { role: "system", content: "You are a medical information assistant. You provide general health information but always clarify that you're not providing medical advice." },
                { role: "user", content: prompt }
            ],
            model: "llama3-70b-8192",
            temperature: 0.3,
            max_tokens: 500
        });

        return completion.choices[0].message.content || 'I recommend discussing this question with a healthcare professional who can provide personalized guidance.';
    } catch (error: any) {
        console.error('Follow-up response error:', error);
        return 'I apologize, but I encountered an issue processing your question. For accurate information, please consult a healthcare professional.';
    }
}