
/**
 * Content Plan Storage Utility
 * 
 * This utility provides reliable functions for saving and loading content plans
 * with proper deep cloning and error handling.
 */

import { ContentPlanItem } from '@/utils/calendarUtils';

/**
 * Save the content plan to localStorage with proper deep cloning
 * to prevent reference issues
 * 
 * @param contentPlan The content plan array to save
 * @returns boolean indicating success or failure
 */
export const saveContentPlanToStorage = (contentPlan: ContentPlanItem[]): boolean => {
  // Validate input
  if (!contentPlan || !Array.isArray(contentPlan)) {
    console.error('Invalid content plan provided to saveContentPlanToStorage:', contentPlan);
    return false;
  }

  try {
    // Create a deep copy through serialization to remove any reference issues
    console.log(`Saving ${contentPlan.length} items to localStorage`);
    
    // Perform a pre-check to ensure we can stringify the array
    // This helps catch circular references before attempting to save
    const serializedPlan = JSON.stringify(contentPlan);
    
    if (!serializedPlan || serializedPlan === '[]' && contentPlan.length > 0) {
      console.error('Serialization failed - empty result when content exists');
      return false;
    }
    
    // Save the serialized content plan to localStorage
    localStorage.setItem('contentCalendarPlan', serializedPlan);
    
    // Verify the save by reading it back
    const verification = localStorage.getItem('contentCalendarPlan');
    if (!verification) {
      console.error('Verification failed - could not read saved content');
      return false;
    }
    
    // Parse the verification data to ensure it's valid JSON
    try {
      const parsedVerification = JSON.parse(verification);
      if (!Array.isArray(parsedVerification)) {
        console.error('Verification failed - saved content is not an array');
        return false;
      }
      
      // Check if all items were saved properly
      if (parsedVerification.length !== contentPlan.length) {
        console.error(`Verification failed - expected ${contentPlan.length} items but got ${parsedVerification.length}`);
        return false;
      }
      
      console.log(`Successfully saved and verified ${parsedVerification.length} items`);
      return true;
    } catch (parseError) {
      console.error('Verification failed - could not parse saved content:', parseError);
      return false;
    }
  } catch (error) {
    console.error('Failed to save content plan:', error);
    return false;
  }
};

/**
 * Load the content plan from localStorage with proper parsing and validation
 * 
 * @returns The loaded content plan array or null if not found or invalid
 */
export const loadContentPlanFromStorage = (): ContentPlanItem[] | null => {
  try {
    const storedData = localStorage.getItem('contentCalendarPlan');
    
    if (!storedData) {
      console.log('No content plan found in localStorage');
      return null;
    }
    
    console.log(`Loading content plan, data length: ${storedData.length}`);
    
    try {
      // Parse the stored JSON data
      const parsedPlan = JSON.parse(storedData);
      
      // Validate that the parsed data is an array
      if (!Array.isArray(parsedPlan)) {
        console.error('Invalid content plan format, expected array but got:', typeof parsedPlan);
        return null;
      }
      
      console.log(`Successfully loaded ${parsedPlan.length} content plan items`);
      
      // Create a deep clone to ensure we don't have reference issues
      const deepClone = JSON.parse(JSON.stringify(parsedPlan));
      
      return deepClone;
    } catch (parseError) {
      console.error('Failed to parse content plan:', parseError);
      return null;
    }
  } catch (error) {
    console.error('Error loading content plan:', error);
    return null;
  }
};

/**
 * Clear the content plan from localStorage
 * 
 * @returns boolean indicating success or failure
 */
export const clearContentPlanStorage = (): boolean => {
  try {
    localStorage.removeItem('contentCalendarPlan');
    return true;
  } catch (error) {
    console.error('Failed to clear content plan:', error);
    return false;
  }
};
