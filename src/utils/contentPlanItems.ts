
import { supabase } from '@/integrations/supabase/client';
import { ContentPlanItem } from '@/utils/calendarUtils';
import { v4 as uuidv4 } from '@/utils/uuid';

// Convert a database row to a ContentPlanItem
const dbRowToContentItem = (row: any): ContentPlanItem => {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    objective: row.objective || '',
    dueDate: row.due_date, // Store as ISO string
    completed: row.completed || false,
    contentType: row.content_type,
    contentStyle: row.content_style,
    keywords: row.keywords || []
  };
};

// Convert a ContentPlanItem to a database row format
const contentItemToDbRow = (item: ContentPlanItem, userId: string, websiteId: string) => {
  // Make sure we have a string format for due_date
  let dueDate: string;
  
  // Safely extract the dueDate as a string in ISO format
  if (typeof item.dueDate === 'string') {
    dueDate = item.dueDate;
  } else if (item.dueDate && typeof item.dueDate === 'object') {
    // If it's a Date object (or at least has toISOString)
    try {
      dueDate = (item.dueDate as any).toISOString();
    } catch (e) {
      console.warn('Failed to convert date object to ISO string:', e);
      dueDate = new Date().toISOString(); // Fallback to current date
    }
  } else {
    // Last resort: try to create a new Date from whatever we have
    try {
      dueDate = new Date(item.dueDate as any).toISOString();
    } catch (e) {
      console.warn('Failed to convert to Date, using current date:', e);
      dueDate = new Date().toISOString(); // Fallback to current date
    }
  }
  
  // For existing items with valid UUIDs we keep the ID, for new items we don't include an ID
  // so Supabase will generate one for us
  const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id);
  
  // The base object without an ID
  const baseObject = {
    user_id: userId,
    website_id: websiteId,
    title: item.title,
    description: item.description || '',
    objective: item.objective || '',
    due_date: dueDate, // Use the string format for Supabase
    completed: item.completed || false,
    content_type: item.contentType,
    content_style: item.contentStyle,
    keywords: item.keywords || []
  };
  
  // Only include ID if it's a valid UUID and we're doing an update operation
  if (isValidUuid) {
    console.log(`Using existing valid UUID: ${item.id}`);
    return {
      id: item.id,
      ...baseObject
    };
  }
  
  console.log(`No ID provided or invalid UUID: ${item.id} - Supabase will generate one`);
  return baseObject;
};

// Load all content plan items for a user and website
export const loadContentPlanItems = async (
  userId: string, 
  websiteId: string
): Promise<ContentPlanItem[]> => {
  try {
    console.log(`Loading content items for user ${userId} and website ${websiteId}`);
    
    const { data, error } = await supabase
      .from('content_plan_items')
      .select('*')
      .eq('user_id', userId)
      .eq('website_id', websiteId)
      .order('due_date', { ascending: true });
    
    if (error) {
      console.error('Error loading content plan items from Supabase:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('No content plan items found in database');
      return [];
    }
    
    console.log(`Loaded ${data.length} content plan items from Supabase`);
    
    const contentItems = data.map(dbRowToContentItem);
    return contentItems;
  } catch (error) {
    console.error('Error in loadContentPlanItems:', error);
    throw error;
  }
};

// Add a new content plan item
export const addContentPlanItem = async (
  item: ContentPlanItem,
  userId: string,
  websiteId: string
): Promise<ContentPlanItem | null> => {
  try {
    console.log(`Adding content item for user ${userId} and website ${websiteId}:`, item.title);
    
    // Convert to DB format but remove the ID field to let Supabase generate it
    const dbItem = contentItemToDbRow(item, userId, websiteId);
    
    // Check if the result has an ID property before trying to destructure it
    // This is a TypeScript-safe way to handle potential missing ID field
    const insertData = { ...dbItem };
    if ('id' in insertData) {
      delete insertData.id;
    }
    
    const { data, error } = await supabase
      .from('content_plan_items')
      .insert(insertData)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding content plan item to Supabase:', error);
      throw error;
    }
    
    console.log('Successfully added content plan item to Supabase:', data.id);
    return dbRowToContentItem(data);
  } catch (error) {
    console.error('Error in addContentPlanItem:', error);
    return null;
  }
};

// Update an existing content plan item
export const updateContentPlanItem = async (
  item: ContentPlanItem,
  userId: string,
  websiteId: string
): Promise<boolean> => {
  try {
    console.log(`Updating content item ${item.id} for user ${userId}:`, item.title);
    
    // Check if the item has a valid UUID
    const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id);
    
    if (!isValidUuid) {
      console.error('Cannot update item with invalid UUID:', item.id);
      return false;
    }
    
    const dbItem = contentItemToDbRow(item, userId, websiteId);
    
    const { error } = await supabase
      .from('content_plan_items')
      .update(dbItem)
      .eq('id', item.id)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error updating content plan item in Supabase:', error);
      throw error;
    }
    
    console.log('Successfully updated content plan item in Supabase');
    return true;
  } catch (error) {
    console.error('Error in updateContentPlanItem:', error);
    return false;
  }
};

// Delete a content plan item
export const deleteContentPlanItem = async (itemId: string): Promise<boolean> => {
  try {
    console.log(`Deleting content item ${itemId}`);
    
    const { error } = await supabase
      .from('content_plan_items')
      .delete()
      .eq('id', itemId);
    
    if (error) {
      console.error('Error deleting content plan item from Supabase:', error);
      throw error;
    }
    
    console.log('Successfully deleted content plan item from Supabase');
    return true;
  } catch (error) {
    console.error('Error in deleteContentPlanItem:', error);
    return false;
  }
};

// Helper utility to generate UUID
export function generateUUID(): string {
  return uuidv4();
}

// Add multiple content plan items in a single transaction
export const addMultipleContentPlanItems = async (
  items: ContentPlanItem[],
  userId: string,
  websiteId: string
): Promise<boolean> => {
  try {
    if (!items || items.length === 0) {
      console.log('No items to add');
      return true;
    }
    
    console.log(`Adding ${items.length} content items for user ${userId} and website ${websiteId}`);
    
    // Convert items to proper Supabase format but remove IDs to let Supabase generate them
    const dbItems = items.map(item => {
      const dbItem = contentItemToDbRow(item, userId, websiteId);
      // Remove the id field for each item in a type-safe way
      const insertData = { ...dbItem };
      if ('id' in insertData) {
        delete insertData.id;
      }
      console.log(`Prepared item for Supabase - Title: ${insertData.title}, Date: ${insertData.due_date}`);
      return insertData;
    });
    
    // Adding debug logs to see what's being sent to Supabase
    console.log('First item being sent to Supabase:', JSON.stringify(dbItems[0]));
    if (dbItems.length > 1) {
      console.log('Second item being sent to Supabase:', JSON.stringify(dbItems[1]));
    }
    
    // Use smaller chunks to reduce payload size
    const chunkSize = 5;
    let success = true;
    
    for (let i = 0; i < dbItems.length; i += chunkSize) {
      const chunk = dbItems.slice(i, i + chunkSize);
      console.log(`Inserting chunk ${Math.floor(i/chunkSize) + 1} of ${Math.ceil(dbItems.length/chunkSize)}, size: ${chunk.length}`);
      
      const { error } = await supabase
        .from('content_plan_items')
        .insert(chunk);
      
      if (error) {
        console.error(`Error adding chunk ${Math.floor(i/chunkSize) + 1} to Supabase:`, error);
        console.error('Error details:', error.message);
        success = false;
        break;
      }
      
      console.log(`Successfully added chunk ${Math.floor(i/chunkSize) + 1} to Supabase`);
    }
    
    if (success) {
      console.log(`Successfully added ${items.length} content plan items to Supabase`);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error in addMultipleContentPlanItems:', error);
    return false;
  }
};
