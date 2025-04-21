import { Groq } from 'groq-sdk';

// Initialize Groq client with API key
// In production, this should be stored in environment variables
export const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
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
  model: string = GROQ_MODELS.LLAMA_VISION, // Updated to use vision-capable model
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

    // Check if the API key is configured
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured in environment variables');
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

    // Check if the API key is configured
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured in environment variables');
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