import { Groq } from 'groq-sdk';

// IMPORTANT: For development purposes only
// In production, use environment variables instead
const DEFAULT_API_KEY = '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'; // Added your API key as a fallback

// Function to get API key with better debugging
function getGroqApiKey() {
  // Debug logging to see what's happening with environment variables
  console.log('Environment variables debug:', {
    nodeEnv: process.env.NODE_ENV,
    hasGroqKey: !!process.env.GROQ_API_KEY,
    keyLength: process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.length : 0,
  });
  
  const apiKey = process.env.GROQ_API_KEY || DEFAULT_API_KEY;
  
  if (!apiKey) {
    console.error('⚠️ WARNING: GROQ_API_KEY is not configured in environment variables and no fallback key is provided.');
    console.error('➡️ Please add GROQ_API_KEY to your .env.local file or set a fallback key in src/lib/api/groq.ts');
  } else {
    console.log('✅ GROQ_API_KEY found - length:', apiKey.length);
  }
  
  return apiKey;
}

// Initialize Groq client with API key
export const groqClient = new Groq({
  apiKey: getGroqApiKey(),
  dangerouslyAllowBrowser: false, // Never expose API key to the browser
});

// Groq API models
export const GROQ_MODELS = {
  LLAMA3_8K: 'llama3-8b-8192',
  LLAMA3_70B: 'llama3-70b-8192',
  MIXTRAL: 'mixtral-8x7b-32768',
  GEMMA: 'gemma-7b-it',
  LLAMA_VISION: 'meta-llama/llama-4-maverick-17b-128e-instruct', // Added Claude model with vision capabilities
};

// Helper function for chat completions
export async function getGroqCompletion(
  prompt: string,
  systemPrompt: string = '',
  model: string = GROQ_MODELS.LLAMA3_70B,
  temperature: number = 0.3,
  maxTokens: number = 500
) {
  try {
    const completion = await groqClient.chat.completions.create({
      messages: [
        ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
        { role: 'user' as const, content: prompt },
      ],
      model,
      temperature,
      max_tokens: maxTokens,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error calling Groq API:', error);
    throw new Error('Failed to get response from AI model');
  }
}

// Helper for extracting JSON from LLM responses
export function extractJsonFromResponse(text: string): any {
  try {
    // Try to extract JSON from within code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || 
                      text.match(/{[\s\S]*?}/);
            
    const jsonText = jsonMatch ? jsonMatch[0].replace(/```json|```/g, '') : text;
    const cleanedJson = jsonText.trim();
    
    return JSON.parse(cleanedJson);
  } catch (error) {
    console.error('Failed to extract JSON from response:', error);
    throw new Error('Failed to parse response as JSON');
  }
}

// Function for analyzing ECG images with vision capabilities
export async function analyzeECGImage(
  imageBase64: string,
  model: string = GROQ_MODELS.LLAMA_VISION,
  temperature: number = 0.2,
  maxTokens: number = 1000
) {
  try {
    const systemPrompt = `You are a highly skilled cardiologist specialized in ECG analysis. 
    Analyze the provided ECG image and provide a detailed, professional assessment.

    ECG Conditions to Check:
    • Normal ECG (NORM)
    • Left bundle branch block (LBBB)
    • Right bundle branch block (RBBB)
    • Atrial fibrillation (AFIB)
    • Atrial flutter (AFLT)
    • First degree AV block (fAVB)
    • Myocardial infarction (MI)
    • Wolff-Parkinson White (WPW)
    • Supraventricular tachycardia
    • Ventricular tachycardia (VT)
    • Ventricular fibrillation (VF)
    • ST elevation
    • ST depression
    • T wave inversion
    • QT prolongation

    Analysis Requirements:
    1. Heart rate and rhythm analysis
    2. Identification of any abnormalities or patterns
    3. Potential diagnostic considerations
    4. Severity assessment (normal, mild concern, moderate concern, severe concern)
    
    Response Format (JSON):
    {
      "heartRate": string,
      "rhythm": string,
      "abnormalities": string[] | null,
      "interpretation": string,
      "severityLevel": "normal" | "mild" | "moderate" | "severe",
      "recommendations": string[]
    }`;

    // Use the API key from our getter function instead of checking env directly
    const apiKey = getGroqApiKey();
    if (!apiKey) {
      throw new Error('No Groq API key available. Please configure your API key.');
    }

    let completion;
    try {
      completion = await groqClient.chat.completions.create({
        messages: [
          { 
            role: 'system', 
            content: systemPrompt 
          },
          {
            role: 'user',
            content: [
              { 
                type: 'text', 
                text: 'Please analyze this ECG image and provide a detailed assessment.' 
              },
              { 
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        model,
        temperature,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' }
      });
    } catch (apiError: any) {
      // More detailed error logging
      console.error('Groq API error details:', {
        message: apiError.message,
        code: apiError.code,
        status: apiError.status,
        details: apiError.details || 'No additional details'
      });
      
      // Specific error handling based on error type
      if (apiError.message?.includes('does not support multimodal inputs')) {
        throw new Error('The selected model does not support image analysis. Please use a vision-capable model.');
      } else if (apiError.message?.includes('insufficient_quota')) {
        throw new Error('API quota exceeded. Please try again later.');
      } else {
        throw apiError; // Re-throw if it's another type of error
      }
    }

    if (!completion || !completion.choices || !completion.choices[0]?.message?.content) {
      throw new Error('Received empty response from the AI model');
    }

    const response = completion.choices[0].message.content;
    try {
      return JSON.parse(response);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', response);
      throw new Error('AI response was not in valid JSON format');
    }
  } catch (error) {
    console.error('Error analyzing ECG image with Groq:', error);
    // Pass the actual error message for better debugging
    throw new Error(error instanceof Error ? error.message : 'Failed to analyze ECG image');
  }
}

// Function for analyzing lab report images with vision capabilities
export async function analyzeLabReport(
  imageBase64: string,
  model: string = GROQ_MODELS.LLAMA_VISION, // Using vision-capable model
  temperature: number = 0.2,
  maxTokens: number = 1000
) {
  try {
    const systemPrompt = `You are a highly skilled laboratory medicine specialist and pathologist. 
    Analyze the provided lab report image and provide a detailed, professional assessment.

    Lab Report Analysis Requirements:
    1. Identify the test names and their values from the image
    2. Determine which values are outside normal reference ranges
    3. Explain the significance of abnormal values
    4. Provide a holistic interpretation of the lab results
    5. Assess urgency level (normal, attention, urgent, critical)
    
    Response Format (JSON):
    {
      "summary": "Brief overall summary of the lab report results",
      "analysis": "Detailed interpretation of the lab report findings",
      "abnormalValues": {
        "testName1": "value1",
        "testName2": "value2"
      },
      "normalRanges": {
        "testName1": "reference range1",
        "testName2": "reference range2"
      },
      "recommendations": "Suggested follow-up actions or lifestyle modifications",
      "urgencyLevel": "normal | attention | urgent | critical"
    }`;

    // Use the API key from our getter function instead of checking env directly
    const apiKey = getGroqApiKey();
    if (!apiKey) {
      throw new Error('No Groq API key available. Please configure your API key.');
    }

    let completion;
    try {
      completion = await groqClient.chat.completions.create({
        messages: [
          { 
            role: 'system', 
            content: systemPrompt 
          },
          {
            role: 'user',
            content: [
              { 
                type: 'text', 
                text: 'Please analyze this lab report image and provide a detailed assessment.' 
              },
              { 
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        model,
        temperature,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' }
      });
    } catch (apiError: any) {
      // More detailed error logging
      console.error('Groq API error details:', {
        message: apiError.message,
        code: apiError.code,
        status: apiError.status,
        details: apiError.details || 'No additional details'
      });
      
      // Specific error handling based on error type
      if (apiError.message?.includes('does not support multimodal inputs')) {
        throw new Error('The selected model does not support image analysis. Please use a vision-capable model.');
      } else if (apiError.message?.includes('insufficient_quota')) {
        throw new Error('API quota exceeded. Please try again later.');
      } else {
        throw apiError; // Re-throw if it's another type of error
      }
    }

    if (!completion || !completion.choices || !completion.choices[0]?.message?.content) {
      throw new Error('Received empty response from the AI model');
    }

    const response = completion.choices[0].message.content;
    try {
      return JSON.parse(response);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', response);
      throw new Error('AI response was not in valid JSON format');
    }
  } catch (error) {
    console.error('Error analyzing lab report image with Groq:', error);
    // Pass the actual error message for better debugging
    throw new Error(error instanceof Error ? error.message : 'Failed to analyze lab report image');
  }
}

// Function for analyzing skin images with vision capabilities
export async function analyzeSkinImage(
  imageBase64: string,
  model: string = GROQ_MODELS.LLAMA_VISION,
  temperature: number = 0.2,
  maxTokens: number = 1000
) {
  try {
    const systemPrompt = `You are a highly skilled dermatologist with expertise in identifying skin conditions from images. 
    Analyze the provided skin image and provide a detailed, professional assessment.

    Analysis Requirements:
    1. Identify potential skin conditions visible in the image
    2. Provide a summary of your observations
    3. List possible skin conditions with estimated probabilities
    4. Include differential diagnosis considerations
    5. Suggest general recommendations
    6. Assess severity level (low, moderate, high)
    7. Determine if a follow-up with a dermatologist is recommended
    
    Response Format (JSON):
    {
      "summary": "Detailed summary of the skin condition visible in the image",
      "possibleConditions": [
        {
          "name": "Condition name",
          "probability": float (0-1),
          "description": "Short description of the condition"
        }
      ],
      "recommendations": ["List of recommendations"],
      "severity": "low" | "moderate" | "high" | "unknown",
      "followUpNeeded": boolean,
      "differentialDiagnosis": "Potential alternative diagnoses to consider",
      "skinType": "Description of skin type if relevant",
      "additionalObservations": "Any additional relevant observations"
    }`;

    // Use the API key from our getter function instead of checking env directly
    const apiKey = getGroqApiKey();
    if (!apiKey) {
      throw new Error('No Groq API key available. Please configure your API key.');
    }

    let completion;
    try {
      completion = await groqClient.chat.completions.create({
        messages: [
          { 
            role: 'system', 
            content: systemPrompt 
          },
          {
            role: 'user',
            content: [
              { 
                type: 'text', 
                text: 'Please analyze this skin image and provide a detailed assessment based on what you can see.' 
              },
              { 
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        model,
        temperature,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' }
      });
    } catch (apiError: any) {
      // More detailed error logging
      console.error('Groq API error details:', {
        message: apiError.message,
        code: apiError.code,
        status: apiError.status,
        details: apiError.details || 'No additional details'
      });
      
      // Specific error handling based on error type
      if (apiError.message?.includes('does not support multimodal inputs')) {
        throw new Error('The selected model does not support image analysis. Please use a vision-capable model.');
      } else if (apiError.message?.includes('insufficient_quota')) {
        throw new Error('API quota exceeded. Please try again later.');
      } else {
        throw apiError; // Re-throw if it's another type of error
      }
    }

    if (!completion || !completion.choices || !completion.choices[0]?.message?.content) {
      throw new Error('Received empty response from the AI model');
    }

    const response = completion.choices[0].message.content;
    try {
      return JSON.parse(response);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', response);
      throw new Error('AI response was not in valid JSON format');
    }
  } catch (error) {
    console.error('Error analyzing skin image with Groq:', error);
    // Pass the actual error message for better debugging
    throw new Error(error instanceof Error ? error.message : 'Failed to analyze skin image');
  }
}

// Function for checking medicine interactions
export async function checkMedicineInteractions(
  medicineNames: string[]
): Promise<{
  summary: string;
  interactionFound: boolean;
  interactions: {
    medicines: string[];
    severity: 'mild' | 'moderate' | 'severe';
    mechanism: string;
    effects: string;
    recommendations: string;
  }[];
  precautions: string[];
  alternatives?: { medicine: string; alternative: string }[];
}> {
  try {
    const systemPrompt = `You are a pharmacologist and medical expert specialized in drug interactions.
    Analyze the list of medicines provided and identify any potential interactions between them.

    Drug Interaction Analysis Requirements:
    1. Identify any known interactions between the provided medicines
    2. Explain the mechanism of each interaction
    3. Describe the potential effects of each interaction
    4. Rate the severity of each interaction (mild, moderate, severe)
    5. Provide recommendations for managing each interaction
    6. Suggest general precautions for taking these medications
    7. When appropriate, suggest alternatives with fewer interactions

    Response Format (JSON):
    {
      "summary": "Brief overall summary of interaction analysis",
      "interactionFound": boolean,
      "interactions": [
        {
          "medicines": ["Medicine 1", "Medicine 2"],
          "severity": "mild | moderate | severe",
          "mechanism": "Description of how these medicines interact",
          "effects": "Description of potential effects",
          "recommendations": "Recommendations for managing this interaction"
        }
      ],
      "precautions": ["List of general precautions"],
      "alternatives": [
        {
          "medicine": "Original medicine",
          "alternative": "Suggested alternative with fewer interactions"
        }
      ]
    }`;

    // Use the API key from our getter function instead of checking env directly
    const apiKey = getGroqApiKey();
    if (!apiKey) {
      throw new Error('No Groq API key available. Please configure your API key.');
    }

    const userPrompt = `Please analyze potential interactions between the following medicines: ${medicineNames.join(', ')}`;

    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      model: GROQ_MODELS.LLAMA3_70B,
      temperature: 0.2,
      max_tokens: 1000,
      response_format: { type: 'json_object' }
    });

    if (!completion || !completion.choices || !completion.choices[0]?.message?.content) {
      throw new Error('Received empty response from the AI model');
    }

    const response = completion.choices[0].message.content;
    try {
      return JSON.parse(response);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', response);
      throw new Error('AI response was not in valid JSON format');
    }
  } catch (error) {
    console.error('Error checking medicine interactions with Groq:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to check medicine interactions');
  }
}

// Function for analyzing patient symptoms and providing possible diagnoses
export async function analyzeMedicalSymptoms(
  patientData: {
    symptoms: string[];
    age?: string;
    sex?: string;
    duration?: string;
    isConstant?: boolean;
    severity?: number;
    previousConditions?: string[];
    medications?: string[];
    categorySpecificAnswer?: string;
  },
  category: string
): Promise<{
  conditions: { condition: string; likelihood: number }[];
  error?: string;
}> {
  try {
    // Use the API key from our getter function instead of checking env directly
    const apiKey = getGroqApiKey();
    if (!apiKey) {
      throw new Error('No Groq API key available. Please configure your API key.');
    }

    // Prepare the patient data for the prompt
    const symptoms = patientData.symptoms.join(', ');
    const age = patientData.age || 'unknown';
    const sex = patientData.sex || 'unknown';
    const duration = patientData.duration || 'unknown duration';
    const previousConditions = patientData.previousConditions?.length 
      ? patientData.previousConditions.join(', ') 
      : 'none';
    const medications = patientData.medications?.length 
      ? patientData.medications.join(', ') 
      : 'none';
    
    // Build additional info
    const additionalInfo = [];
    if (patientData.isConstant) additionalInfo.push('Symptoms are constant');
    else additionalInfo.push('Symptoms come and go');
    
    if (patientData.severity) additionalInfo.push(`Severity: ${patientData.severity}/10`);
    
    if (patientData.categorySpecificAnswer) {
      additionalInfo.push(`Additional information: ${patientData.categorySpecificAnswer}`);
    }

    // Construct the prompt
    const prompt = `Patient: ${age} years old, ${sex}
Symptoms: ${symptoms}
Duration: ${duration}
Previous medical conditions: ${previousConditions}
Current medications: ${medications}
Medical category: ${category}
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

    // Call the API with enhanced error handling
    try {
      console.log('Sending request to Groq API for medical symptoms analysis');
      
      const completion = await groqClient.chat.completions.create({
        messages: [
          { 
            role: 'system', 
            content: "You are a medical diagnostic AI assistant. You ONLY respond with valid JSON in exactly the requested format, with no additional text, explanations, or markdown formatting. Your response should be a single JSON object that can be directly parsed."
          },
          { role: 'user', content: prompt }
        ],
        model: GROQ_MODELS.LLAMA3_70B,
        temperature: 0.3,
        max_tokens: 500,
        top_p: 0.9,
        response_format: { type: "json_object" }
      });

      const responseText = completion.choices[0].message.content || '';
      console.log('Received response from Groq API');
      
      // Parse the response
      try {
        // First, try direct parsing
        const result = JSON.parse(responseText);
        
        // Validate the structure
        if (result.conditions && Array.isArray(result.conditions)) {
          return result;
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (parseError) {
        // If direct parsing fails, try to clean up the response
        console.log('Direct JSON parsing failed, attempting to clean the response');
        
        let jsonText = responseText;
        
        // Clean markdown code blocks
        if (jsonText.includes('```')) {
          const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          if (jsonMatch && jsonMatch[1]) {
            jsonText = jsonMatch[1];
          }
        }
        
        // Try to extract the JSON object
        const objectMatch = jsonText.match(/{[\s\S]*?}/);
        if (objectMatch) {
          jsonText = objectMatch[0];
        }
        
        // Parse the cleaned text
        const result = JSON.parse(jsonText.trim());
        
        if (!result.conditions || !Array.isArray(result.conditions)) {
          throw new Error('Invalid response structure after cleaning');
        }
        
        return result;
      }
    } catch (apiError: any) {
      // Enhanced API error logging
      console.error('Groq API error details:', {
        message: apiError.message,
        code: apiError.code,
        status: apiError.status,
        details: apiError.details || 'No additional details'
      });
      
      // Handle specific API errors
      if (apiError.status === 401) {
        throw new Error('Authentication failed. Please check your Groq API key.');
      } else if (apiError.message?.includes('insufficient_quota')) {
        throw new Error('API quota exceeded. Please try again later.');
      } else {
        throw apiError; // Re-throw any other API errors
      }
    }
  } catch (error) {
    console.error('Error analyzing medical symptoms:', error);
    
    // Return a structured error response
    return { 
      conditions: [{ condition: "Could not determine - please try again", likelihood: 100 }],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Function for providing general medical advice
export async function getMedicalAdvice(
  symptoms: string[],
  category: string
): Promise<string> {
  try {
    const symptomsText = symptoms.join(', ');
    
    const prompt = `A patient is experiencing the following symptoms: ${symptomsText}. 
    The symptoms are related to ${category}.
    Provide brief, helpful general advice for managing these symptoms at home. 
    Include when they should seek professional medical help.
    Keep your response under 250 words and focus on practical, safe advice.`;

    const completion = await groqClient.chat.completions.create({
      messages: [
        { 
          role: 'system', 
          content: "You are a medical information assistant providing general health advice. You always recommend seeing a doctor for proper diagnosis and treatment."
        },
        { role: 'user', content: prompt }
      ],
      model: GROQ_MODELS.LLAMA3_70B,
      temperature: 0.3,
      max_tokens: 500
    });

    return completion.choices[0].message.content || 'I recommend consulting a healthcare professional for personalized advice.';
  } catch (error) {
    console.error('Error getting medical advice:', error);
    return 'I recommend consulting a healthcare professional for advice tailored to your situation.';
  }
}

