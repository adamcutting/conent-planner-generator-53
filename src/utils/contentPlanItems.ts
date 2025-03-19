
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
    dueDate: row.due_date.toISOString(),
    completed: row.completed || false,
    contentType: row.content_type,
    contentStyle: row.content_style,
    keywords: row.keywords || []
  };
};

// Convert a ContentPlanItem to a database row format
const contentItemToDbRow = (item: ContentPlanItem, userId: string, websiteId: string) => {
  return {
    id: item.id && !item.id.startsWith('new-') ? item.id : uuidv4(),
    user_id: userId,
    website_id: websiteId,
    title: item.title,
    description: item.description || '',
    objective: item.objective || '',
    due_date: new Date(item.dueDate),
    completed: item.completed || false,
    content_type: item.contentType,
    content_style: item.contentStyle,
    keywords: item.keywords || []
  };
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
    
    const dbItem = contentItemToDbRow(item, userId, websiteId);
    
    const { data, error } = await supabase
      .from('content_plan_items')
      .insert(dbItem)
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
    
    // Convert all items to DB format
    const dbItems = items.map(item => contentItemToDbRow(item, userId, websiteId));
    
    const { error } = await supabase
      .from('content_plan_items')
      .insert(dbItems);
    
    if (error) {
      console.error('Error adding multiple content plan items to Supabase:', error);
      throw error;
    }
    
    console.log(`Successfully added ${items.length} content plan items to Supabase`);
    return true;
  } catch (error) {
    console.error('Error in addMultipleContentPlanItems:', error);
    return false;
  }
};
