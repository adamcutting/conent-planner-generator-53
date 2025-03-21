import { addDays, format, isSameDay, parseISO, startOfWeek, addWeeks, getDaysInMonth, startOfMonth, endOfMonth, endOfWeek } from 'date-fns';

// Defining the Content Plan Item interface
export interface ContentPlanItem {
  id: string;
  title: string;
  description: string;
  objective: string;  // Renamed from 'purpose' to 'objective'
  dueDate: string;
  completed: boolean;
  contentType: 'blog' | 'social' | 'email' | 'infographic' | 'landing-page';
  contentStyle: 'knowledge' | 'guide' | 'infographic' | 'story' | 'stats' | 'testimonial';
  keywords: string[];
}

// The function to get the start date (March 3, 2025)
export const getStartDate = (): Date => {
  return new Date(2025, 2, 3); // Month is 0-indexed, so 2 = March
};

// Function to generate dates for calendar view - updating to show full month correctly
export const generateCalendarDays = (currentDate: Date, view: 'month' | 'week'): Date[] => {
  if (view === 'week') {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  } else {
    // Get the first day of month
    const firstDayOfMonth = startOfMonth(currentDate);
    // Get the last day of month
    const lastDayOfMonth = endOfMonth(currentDate);
    
    // Start from Monday of the week that contains the first day of month
    const startDay = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });
    // End on Sunday of the week that contains the last day of month
    const endDay = endOfWeek(lastDayOfMonth, { weekStartsOn: 1 });
    
    // Calculate the number of days to display
    const daysInCalendar = Math.floor((endDay.getTime() - startDay.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
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

// Function to find the next day based on weekend inclusion preference
export const getNextDay = (date: Date, includeWeekends: boolean): Date => {
  let nextDay = new Date(date);
  nextDay = addDays(nextDay, 1);
  
  if (!includeWeekends) {
    // Skip to next working day if weekends are excluded
    while (!isWorkingDay(nextDay)) {
      nextDay = addDays(nextDay, 1);
    }
  }
  
  return nextDay;
};

// Function to generate dummy content plan based on days from start
export const generateInitialContentPlan = (): ContentPlanItem[] => {
  const startDate = getStartDate();
  const contentPlan: ContentPlanItem[] = [];
  
  // Example content types and their distribution - exclude video
  const contentTypes: Array<{ 
    type: 'blog' | 'social' | 'email' | 'infographic' | 'landing-page', 
    style: 'knowledge' | 'guide' | 'infographic' | 'story' | 'stats' | 'testimonial',
    keywords: string[] 
  }> = [
    { type: 'blog', style: 'knowledge', keywords: ['data analytics', 'business intelligence'] },
    { type: 'social', style: 'stats', keywords: ['data visualization', 'data trends'] },
    { type: 'email', style: 'guide', keywords: ['data solutions', 'data management'] },
    { type: 'infographic', style: 'infographic', keywords: ['statistics', 'data insights'] },
    { type: 'landing-page', style: 'testimonial', keywords: ['data solutions', 'DataHQ services'] },
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
        title: `${contentType.type.charAt(0).toUpperCase() + contentType.type.slice(1)} #${contentIndex + 1}`,
        description: `Create a ${contentType.type} post about ${contentType.keywords[Math.floor(Math.random() * contentType.keywords.length)]}`,
        objective: getObjectiveByStyle(contentType.style),
        dueDate: currentDate.toISOString(),
        completed: false,
        contentType: contentType.type,
        contentStyle: contentType.style,
        keywords: [...contentType.keywords]
      });
      
      contentIndex++;
    }
    
    // Move to the next day
    currentDate = addDays(currentDate, 1);
  }
  
  return contentPlan;
};

// Helper function to get objective by content style with specific content goals
const getObjectiveByStyle = (style: string): string => {
  const objectives = [
    "Focus on how clean data improves prospecting.",
    "SEO-targeted landing page on cleaning & enriching data.",
    "Best practices for creating targeted B2B email lists.",
    "Demonstrate data enrichment ROI with real-world examples.",
    "Explain how data decay affects marketing performance.",
    "Position DataHQ as experts in data-driven marketing.",
    "Show how improved data quality leads to higher conversion rates.",
    "Highlight the cost of poor data quality in marketing campaigns.",
    "Explain our data processing methodology compared to competitors.",
    "Educate prospects on GDPR compliance in data management.",
    "Build trust by sharing transparent data handling practices.",
    "Showcase customer success metrics from data cleansing projects."
  ];
  
  // Return a random objective from the list
  return objectives[Math.floor(Math.random() * objectives.length)];
};

// Function to generate a new content plan based on keywords
export const generateContentPlanFromKeywords = (
  keywords: string[], 
  startDate: Date, 
  includeWeekends: boolean = false,
  contentTypes: string[] = ['blog', 'social', 'email', 'infographic', 'landing-page']
): ContentPlanItem[] => {
  const contentPlan: ContentPlanItem[] = [];
  
  // Filter the selected content types from all available types
  const availableContentTypes = [
    'blog', 'social', 'email', 'infographic', 'landing-page'
  ] as const;
  
  // Only include the selected content types
  const selectedTypes = availableContentTypes.filter(type => 
    contentTypes.includes(type)
  ) as Array<'blog' | 'social' | 'email' | 'infographic' | 'landing-page'>;
  
  if (selectedTypes.length === 0) {
    // If no content types are selected, return empty plan
    return [];
  }
  
  const contentStyles: Array<'knowledge' | 'guide' | 'infographic' | 'story' | 'stats' | 'testimonial'> = [
    'knowledge', 'guide', 'infographic', 'story', 'stats', 'testimonial'
  ];
  
  // Distribution of content types (how many of each type per month)
  const distribution = {
    blog: 8,
    social: 12,
    email: 4,
    infographic: 2,
    'landing-page': 2
  };
  
  let contentId = 1;
  let currentDate = new Date(startDate);
  
  // Generate content items for each type according to the distribution
  for (let type of selectedTypes) {
    const count = distribution[type];
    
    for (let i = 0; i < count; i++) {
      // Make sure we only schedule on working days if includeWeekends is false
      if (!includeWeekends) {
        while (!isWorkingDay(currentDate)) {
          currentDate = addDays(currentDate, 1);
        }
      }
      
      const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
      const randomStyle = contentStyles[Math.floor(Math.random() * contentStyles.length)];
      
      contentPlan.push({
        id: `item-${contentId++}`,
        title: generateTitle(type, randomKeyword, randomStyle),
        description: `Create a ${type} about ${randomKeyword}`,
        objective: getObjectiveByStyle(randomStyle),
        dueDate: currentDate.toISOString(),
        completed: false,
        contentType: type,
        contentStyle: randomStyle,
        keywords: [randomKeyword]
      });
      
      // Add a few days between content items to space them out
      // Use either working days or all days based on includeWeekends setting
      for (let j = 0; j < 2; j++) {
        currentDate = includeWeekends ? addDays(currentDate, 1) : getNextWorkingDay(currentDate);
      }
    }
  }
  
  // Sort by due date
  contentPlan.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  return contentPlan;
};

// Generate a title based on content type, keyword and style
const generateTitle = (
  type: 'blog' | 'social' | 'email' | 'infographic' | 'landing-page', 
  keyword: string, 
  style: 'knowledge' | 'guide' | 'infographic' | 'story' | 'stats' | 'testimonial'
): string => {
  const titleTemplates = {
    blog: {
      knowledge: `Understanding ${keyword}: Industry Insights`,
      guide: `The Ultimate Guide to ${keyword}`,
      story: `How We Transformed Our Business with ${keyword}`,
      stats: `${keyword} in Numbers: Key Statistics You Should Know`,
      testimonial: `Success Story: How ${keyword} Changed Our Client's Business`,
      infographic: `${keyword} Explained: Visual Guide`
    },
    social: {
      knowledge: `#DidYouKnow about ${keyword}?`,
      guide: `Quick Tips for ${keyword}`,
      story: `Our Journey with ${keyword}`,
      stats: `${keyword} Facts You Won't Believe`,
      testimonial: `Client Spotlight: ${keyword} Success`,
      infographic: `${keyword} At A Glance`
    },
    email: {
      knowledge: `${keyword} Insights: Latest Trends`,
      guide: `${keyword} Mastery in 5 Steps`,
      story: `${keyword} Case Study: Behind the Scenes`,
      stats: `${keyword} Report: Data & Insights`,
      testimonial: `${keyword} Champions: Client Showcase`,
      infographic: `Visual Guide: ${keyword} Explained`
    },
    infographic: {
      knowledge: `${keyword} Visualized`,
      guide: `${keyword} Step-by-Step`,
      story: `The Evolution of ${keyword}`,
      stats: `${keyword} By The Numbers`,
      testimonial: `${keyword} Impact: Client Results`,
      infographic: `${keyword} Simplified`
    },
    'landing-page': {
      knowledge: `${keyword} Solutions by DataHQ`,
      guide: `Mastering ${keyword} with DataHQ`,
      story: `${keyword} Journey: Partner with DataHQ`,
      stats: `${keyword} ROI: What DataHQ Delivers`,
      testimonial: `${keyword} Success Stories: DataHQ Clients`,
      infographic: `${keyword} Expertise: Why Choose DataHQ`
    }
  };

  return titleTemplates[type][style] || `${type}: ${keyword}`;
};

// Format date for display
export const formatDate = (date: Date, formatStr: string = 'MMM d, yyyy'): string => {
  return format(date, formatStr);
};
