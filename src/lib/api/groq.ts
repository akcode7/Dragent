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