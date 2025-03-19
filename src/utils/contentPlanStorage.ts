
/**
 * Content Plan Storage Utility
 * 
 * This utility provides reliable functions for saving and loading content plans
 * with proper deep cloning and error handling.
 */

import { ContentPlanItem } from '@/utils/calendarUtils';

/**
 * Save the content plan to localStorage with proper deep cloning
 * to prevent reference issues and additional verification steps
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
    // Basic input validation - check if the array actually has items
    if (contentPlan.length === 0) {
      console.log('Saving empty content plan to localStorage');
      localStorage.setItem('contentCalendarPlan', JSON.stringify([]));
      return true;
    }

    // Enhanced debug logging
    console.log(`Attempting to save ${contentPlan.length} items to localStorage`);
    console.log('First item preview:', JSON.stringify(contentPlan[0]));
    if (contentPlan.length > 1) {
      console.log('Second item preview:', JSON.stringify(contentPlan[1]));
    }
    
    // Create a deep copy to avoid reference issues
    const deepCopy = JSON.parse(JSON.stringify(contentPlan));
    
    // Verify we didn't lose any items during the deep copy
    if (deepCopy.length !== contentPlan.length) {
      console.error(`Deep copy failed: original has ${contentPlan.length} items, but copy has ${deepCopy.length}`);
      return false;
    }
    
    // Convert to JSON with proper error handling
    const serializedPlan = JSON.stringify(deepCopy);
    
    // Validate the JSON string
    if (!serializedPlan) {
      console.error('Failed to serialize content plan - result is empty');
      return false;
    }
    
    if (serializedPlan === '[]' && contentPlan.length > 0) {
      console.error('Serialization produced empty array despite having content');
      return false;
    }
    
    // Log the serialized data length for debugging
    console.log(`Serialized plan size: ${serializedPlan.length} bytes`);
    
    // Save the serialized content plan to localStorage
    localStorage.setItem('contentCalendarPlan', serializedPlan);
    
    // Verification: Retrieve it back to confirm it was saved correctly
    const verification = localStorage.getItem('contentCalendarPlan');
    
    if (!verification) {
      console.error('Verification failed - no data was saved');
      return false;
    }
    
    // Parse verification data
    try {
      const parsedVerification = JSON.parse(verification);
      
      // Check if the parsed data is an array
      if (!Array.isArray(parsedVerification)) {
        console.error('Verification failed - saved data is not an array');
        return false;
      }
      
      // Check if the correct number of items was saved
      if (parsedVerification.length !== contentPlan.length) {
        console.error(`Verification failed - expected ${contentPlan.length} items but found ${parsedVerification.length}`);
        return false;
      }
      
      // Verification successful
      console.log(`Successfully saved and verified ${parsedVerification.length} content plan items`);
      return true;
    } catch (parseError) {
      console.error('Verification failed - saved data is not valid JSON:', parseError);
      return false;
    }
  } catch (error) {
    console.error('Failed to save content plan to localStorage:', error);
    return false;
  }
};

/**
 * Load the content plan from localStorage with enhanced validation
 * 
 * @returns The loaded content plan array or null if not found or invalid
 */
export const loadContentPlanFromStorage = (): ContentPlanItem[] | null => {
  try {
    // Get data from localStorage
    const storedData = localStorage.getItem('contentCalendarPlan');
    
    // Check if data exists
    if (!storedData) {
      console.log('No content plan found in localStorage');
      return null;
    }
    
    console.log(`Loading content plan from localStorage, data length: ${storedData.length} bytes`);
    
    try {
      // Parse the stored JSON data
      const parsedPlan = JSON.parse(storedData);
      
      // Validate that the parsed data is an array
      if (!Array.isArray(parsedPlan)) {
        console.error('Invalid content plan format in localStorage - expected array but got:', typeof parsedPlan);
        return null;
      }
      
      // Log number of items loaded
      console.log(`Successfully loaded ${parsedPlan.length} content plan items from localStorage`);
      
      // Additional logging for first few items
      if (parsedPlan.length > 0) {
        console.log('First item:', JSON.stringify(parsedPlan[0]));
        if (parsedPlan.length > 1) {
          console.log('Second item:', JSON.stringify(parsedPlan[1]));
        }
      }
      
      // Return a deep clone to prevent reference issues
      const deepClone = JSON.parse(JSON.stringify(parsedPlan));
      
      // Extra validation for deep clone integrity
      if (deepClone.length !== parsedPlan.length) {
        console.error(`Deep clone failed: original has ${parsedPlan.length} items, but clone has ${deepClone.length}`);
        return null;
      }
      
      return deepClone;
    } catch (parseError) {
      console.error('Failed to parse content plan from localStorage:', parseError);
      return null;
    }
  } catch (error) {
    console.error('Error loading content plan from localStorage:', error);
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
    console.log('Content plan cleared from localStorage');
    return true;
  } catch (error) {
    console.error('Failed to clear content plan from localStorage:', error);
    return false;
  }
};
