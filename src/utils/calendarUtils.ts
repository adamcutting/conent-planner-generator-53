
import { addDays, format, isSameDay, parseISO, startOfWeek, addWeeks, getDaysInMonth, startOfMonth } from 'date-fns';

// Defining the Content Plan Item interface
export interface ContentPlanItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  contentType: 'blog' | 'social' | 'email' | 'infographic';
  keywords: string[];
}

// The function to get the start date (March 3, 2025)
export const getStartDate = (): Date => {
  return new Date(2025, 2, 3); // Month is 0-indexed, so 2 = March
};

// Function to generate dates for calendar view
export const generateCalendarDays = (currentDate: Date, view: 'month' | 'week'): Date[] => {
  if (view === 'week') {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  } else {
    const firstDayOfMonth = startOfMonth(currentDate);
    const startDay = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });
    const daysInCalendar = 42; // 6 weeks
    return Array.from({ length: daysInCalendar }, (_, i) => addDays(startDay, i));
  }
};

// Function to check if a content item is due on a specific date
export const isItemDueOnDate = (item: ContentPlanItem, date: Date): boolean => {
  return isSameDay(parseISO(item.dueDate), date);
};

// Helper function to check if a date is a working day (Monday-Friday)
export const isWorkingDay = (date: Date): boolean => {
  const day = date.getDay();
  // 0 is Sunday, 6 is Saturday
  return day !== 0 && day !== 6;
};

// Function to find the next working day
export const getNextWorkingDay = (date: Date): Date => {
  let nextDay = new Date(date);
  do {
    nextDay = addDays(nextDay, 1);
  } while (!isWorkingDay(nextDay));
  return nextDay;
};

// Function to generate dummy content plan based on days from start
export const generateInitialContentPlan = (): ContentPlanItem[] => {
  const startDate = getStartDate();
  const contentPlan: ContentPlanItem[] = [];
  
  // Example content types and their distribution - exclude video
  const contentTypes: Array<{ type: 'blog' | 'social' | 'email' | 'infographic', keywords: string[] }> = [
    { type: 'blog', keywords: ['data analytics', 'business intelligence'] },
    { type: 'social', keywords: ['data visualization', 'data trends'] },
    { type: 'email', keywords: ['data solutions', 'data management'] },
    { type: 'infographic', keywords: ['statistics', 'data insights'] },
  ];
  
  let currentDate = new Date(startDate);
  let contentIndex = 0;
  
  // Generate content items for 90 days, but only on working days
  while (contentIndex < 30) { // Reduced number of items to 30 for better spacing
    if (isWorkingDay(currentDate)) {
      // Only add content on working days
      const contentTypeIndex = Math.floor(Math.random() * contentTypes.length);
      const contentType = contentTypes[contentTypeIndex];
      
      contentPlan.push({
        id: `item-${contentIndex}`,
        title: `Content ${contentType.type} #${contentIndex + 1}`,
        description: `Create a ${contentType.type} post about ${contentType.keywords[Math.floor(Math.random() * contentType.keywords.length)]}`,
        dueDate: currentDate.toISOString(),
        completed: false,
        contentType: contentType.type,
        keywords: [...contentType.keywords]
      });
      
      contentIndex++;
    }
    
    // Move to the next day
    currentDate = addDays(currentDate, 1);
  }
  
  return contentPlan;
};

// Function to generate a new content plan based on keywords
export const generateContentPlanFromKeywords = (keywords: string[], startDate: Date): ContentPlanItem[] => {
  const contentPlan: ContentPlanItem[] = [];
  const contentTypes: Array<'blog' | 'social' | 'email' | 'infographic'> = [
    'blog', 'social', 'email', 'infographic'
  ];
  
  // Distribution of content types (how many of each type per month)
  const distribution = {
    blog: 8,
    social: 12,
    email: 4,
    infographic: 2
  };
  
  let contentId = 1;
  let currentDate = new Date(startDate);
  
  // Generate content items for each type according to the distribution
  for (let type of contentTypes) {
    const count = distribution[type];
    
    for (let i = 0; i < count; i++) {
      // Make sure we only schedule on working days
      while (!isWorkingDay(currentDate)) {
        currentDate = addDays(currentDate, 1);
      }
      
      const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
      
      contentPlan.push({
        id: `item-${contentId++}`,
        title: `${type.charAt(0).toUpperCase() + type.slice(1)}: ${randomKeyword}`,
        description: `Create a ${type} post about ${randomKeyword}`,
        dueDate: currentDate.toISOString(),
        completed: false,
        contentType: type,
        keywords: [randomKeyword]
      });
      
      // Add a few working days between content items to space them out
      for (let j = 0; j < 2; j++) {
        currentDate = getNextWorkingDay(currentDate);
      }
    }
  }
  
  // Sort by due date
  contentPlan.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  return contentPlan;
};

// Format date for display
export const formatDate = (date: Date, formatStr: string = 'MMM d, yyyy'): string => {
  return format(date, formatStr);
};
