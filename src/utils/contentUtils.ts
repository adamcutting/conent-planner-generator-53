// This file contains utility functions for content generation

export interface GeneratedContent {
  title: string;
  content: string;
  keywords: string[];
  suggestions: string[];
}

// Example prompts for different content types
export const contentPrompts = {
  blog: [
    "Write a comprehensive blog post about {KEYWORD} that explains the concept, benefits, and practical applications.",
    "Create a list-style blog post titled 'Top 10 ways to leverage {KEYWORD} in your business'",
    "Write a problem-solution blog post addressing common challenges with {KEYWORD}"
  ],
  social: [
    "Create a short social media post about {KEYWORD} with an engaging hook",
    "Write a question-based social media post that encourages engagement about {KEYWORD}",
    "Create a data-driven social media post highlighting a surprising statistic about {KEYWORD}"
  ],
  video: [
    "Write a video script introduction about {KEYWORD} that hooks the viewer in the first 30 seconds",
    "Create a detailed video script explaining {KEYWORD} for beginners",
    "Write a video script for a case study showcasing {KEYWORD} in action"
  ],
  email: [
    "Write an email newsletter introduction about the latest trends in {KEYWORD}",
    "Create an email series outline for educating subscribers about {KEYWORD}",
    "Write a promotional email highlighting a service related to {KEYWORD}"
  ],
  infographic: [
    "Create an outline for an infographic about {KEYWORD} with 5-7 key points",
    "Write content for a statistical infographic showcasing important numbers related to {KEYWORD}",
    "Create a step-by-step process infographic content about implementing {KEYWORD}"
  ]
};

// Sample generated content - in a real application, this would come from an AI API
export const generateContentFromPrompt = (prompt: string, keyword: string): GeneratedContent => {
  // This is a placeholder for AI-generated content
  // In a real app, you would call an AI API here
  
  const title = `Generated Content about ${keyword}`;
  const content = `This is a placeholder for AI-generated content about ${keyword} based on the prompt: "${prompt}".
  
In a real application, this would be high-quality content generated by an AI model like GPT-4 or similar.

The content would be tailored to the specific content type and keyword, providing:
- Relevant information about ${keyword}
- Industry insights and trends
- Actionable advice for implementation
- Engaging hooks and calls to action

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`;

  // Sample suggestions for content improvement
  const suggestions = [
    `Add more statistics about ${keyword}`,
    `Include a case study about a company successfully using ${keyword}`,
    `Add a section addressing common misconceptions about ${keyword}`,
    `Include more actionable tips for implementing ${keyword}`
  ];

  return {
    title,
    content,
    keywords: [keyword, ...keyword.split(' ')],
    suggestions
  };
};

// Function to store and retrieve email settings in localStorage
export const emailSettings = {
  save: (email: string, daysBeforeDue: number, weeklySummary: boolean = false) => {
    localStorage.setItem('contentCalendarEmail', email);
    localStorage.setItem('contentCalendarNotifyDays', daysBeforeDue.toString());
    localStorage.setItem('contentCalendarWeeklySummary', weeklySummary ? 'true' : 'false');
  },
  get: () => {
    return {
      email: localStorage.getItem('contentCalendarEmail') || '',
      daysBeforeDue: parseInt(localStorage.getItem('contentCalendarNotifyDays') || '1'),
      weeklySummary: localStorage.getItem('contentCalendarWeeklySummary') === 'true'
    };
  }
};

// These localStorage functions are kept for backward compatibility 
// and fallback when user is not authenticated
export const saveContentPlan = (contentPlan: any[]) => {
  localStorage.setItem('contentCalendarPlan', JSON.stringify(contentPlan));
};

export const loadContentPlan = () => {
  const saved = localStorage.getItem('contentCalendarPlan');
  return saved ? JSON.parse(saved) : null;
};
