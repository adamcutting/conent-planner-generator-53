import { GeneratedContent } from './contentUtils';

// Default API key that will be used for all users
const DEFAULT_OPENAI_API_KEY = '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'; // Replace with your actual API key

// OpenAI API key handling
export const getOpenAIApiKey = (): string => {
  return DEFAULT_OPENAI_API_KEY;
};

export const isApiKeySet = (): boolean => {
  return !!DEFAULT_OPENAI_API_KEY;
};

// Content generation with OpenAI
export const generateContentWithOpenAI = async ({
  prompt, 
  keyword
}: {
  prompt: string;
  keyword: string;
}): Promise<{ generatedText: string; suggestions?: string[] }> => {
  const apiKey = getOpenAIApiKey();
  
  if (!apiKey) {
    throw new Error('OpenAI API key is not set');
  }
  
  try {
    console.log('Generating content with OpenAI, prompt:', prompt);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional content creator and marketing expert. Create high-quality, engaging content based on the prompt.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });
    
    console.log('OpenAI response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    console.log('OpenAI response received');
    
    return {
      generatedText: data.choices[0].message.content,
      suggestions: ['Add more specific examples', 'Include statistical data', 'Add engaging hooks']
    };
  } catch (error) {
    console.error('Error generating content with OpenAI:', error);
    throw error;
  }
};
