import { addDays, format, isSameDay, parseISO, startOfWeek, addWeeks, getDaysInMonth, startOfMonth } from 'date-fns';

// Defining the Content Plan Item interface
export interface ContentPlanItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  contentType: 'blog' | 'social' | 'video' | 'email' | 'infographic';
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

// Function to generate dummy content plan based on days from start
export const generateInitialContentPlan = (): ContentPlanItem[] => {
  const startDate = getStartDate();
  const contentPlan: ContentPlanItem[] = [];
  
  // Example content types and their distribution
  const contentTypes: Array<{ type: 'blog' | 'social' | 'video' | 'email' | 'infographic', keywords: string[] }> = [
    { type: 'blog', keywords: ['data analytics', 'business intelligence'] },
    { type: 'social', keywords: ['data visualization', 'data trends'] },
    { type: 'email', keywords: ['data solutions', 'data management'] },
    { type: 'video', keywords: ['data tutorials', 'case studies'] },
    { type: 'infographic', keywords: ['statistics', 'data insights'] },
  ];
  
  // Generate content items for 90 days
  for (let i = 0; i < 90; i++) {
    // Only add content on certain days to keep calendar realistic
    if (i % 3 === 0) { // Every 3rd day
      const contentTypeIndex = Math.floor(Math.random() * contentTypes.length);
      const contentType = contentTypes[contentTypeIndex];
      const dueDate = addDays(startDate, i);
      
      contentPlan.push({
        id: `item-${i}`,
        title: `Content ${contentType.type} #${Math.floor(i/3) + 1}`,
        description: `Create a ${contentType.type} post about ${contentType.keywords[Math.floor(Math.random() * contentType.keywords.length)]}`,
        dueDate: dueDate.toISOString(),
        completed: false,
        contentType: contentType.type,
        keywords: [...contentType.keywords]
      });
    }
  }
  
  return contentPlan;
};

// Function to generate a new content plan based on keywords
export const generateContentPlanFromKeywords = (keywords: string[], startDate: Date): ContentPlanItem[] => {
  const contentPlan: ContentPlanItem[] = [];
  const contentTypes: Array<'blog' | 'social' | 'video' | 'email' | 'infographic'> = [
    'blog', 'social', 'video', 'email', 'infographic'
  ];
  
  // Distribution of content types (how many of each type per month)
  const distribution = {
    blog: 8,
    social: 12,
    video: 4,
    email: 4,
    infographic: 2
  };
  
  let contentId = 1;
  
  // Generate content items for the next 90 days
  for (let type of contentTypes) {
    const count = distribution[type];
    
    for (let i = 0; i < count; i++) {
      // Distribute evenly across 90 days
      const dayOffset = Math.floor((i * 90) / count) + Math.floor(Math.random() * 3);
      const dueDate = addDays(startDate, dayOffset);
      const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
      
      contentPlan.push({
        id: `item-${contentId++}`,
        title: `${type.charAt(0).toUpperCase() + type.slice(1)}: ${randomKeyword}`,
        description: `Create a ${type} post about ${randomKeyword}`,
        dueDate: dueDate.toISOString(),
        completed: false,
        contentType: type,
        keywords: [randomKeyword]
      });
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
