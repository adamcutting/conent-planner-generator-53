
import { GeneratedContent } from './contentUtils';

// Default API key that will be used for all users
const DEFAULT_OPENAI_API_KEY = 'your-api-key-here'; // Replace this with your actual API key

// OpenAI API key handling
let openaiApiKey = '';

export const setOpenAIApiKey = (key: string) => {
  openaiApiKey = key;
  localStorage.setItem('openai_api_key', key);
};

export const getOpenAIApiKey = (): string => {
  if (!openaiApiKey) {
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      openaiApiKey = storedKey;
    }
  }
  // Return the user's API key if set, otherwise return the default key
  return openaiApiKey || DEFAULT_OPENAI_API_KEY;
};

export const clearOpenAIApiKey = () => {
  openaiApiKey = '';
  localStorage.removeItem('openai_api_key');
};

export const isApiKeySet = (): boolean => {
  // Always return true if we have a default key
  return !!DEFAULT_OPENAI_API_KEY || !!getOpenAIApiKey();
};

export const isUsingDefaultKey = (): boolean => {
  return !openaiApiKey && !!DEFAULT_OPENAI_API_KEY;
};

// Content generation with OpenAI
export const generateContentWithOpenAI = async (
  prompt: string, 
  keyword: string
): Promise<GeneratedContent> => {
  const apiKey = getOpenAIApiKey();
  
  if (!apiKey) {
    throw new Error('OpenAI API key is not set');
  }
  
  try {
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
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    const generatedText = data.choices[0].message.content;
    
    // Extract a title from the generated content
    const titleMatch = generatedText.match(/^#\s+(.*?)(?:\n|$)/);
    const title = titleMatch ? titleMatch[1] : `Content about ${keyword}`;
    
    // Generate some relevant keywords
    const keywords = [keyword];
    keyword.split(' ').forEach(word => {
      if (word.length > 3 && !keywords.includes(word)) {
        keywords.push(word);
      }
    });
    
    // Generate improvement suggestions
    const suggestions = [
      `Add more specific examples about ${keyword}`,
      `Include more statistical data about ${keyword}`,
      `Add more engaging hooks related to ${keyword}`,
      `Consider adding a FAQ section about ${keyword}`
    ];
    
    return {
      title,
      content: generatedText,
      keywords,
      suggestions
    };
  } catch (error) {
    console.error('Error generating content with OpenAI:', error);
    throw error;
  }
};
