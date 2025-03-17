
import { supabase } from '@/integrations/supabase/client';
import { ContentPlanItem } from './calendarUtils';

// Type for content plan items stored in Supabase
export type ContentPlanItemDB = {
  id: string;
  user_id: string;
  website_id: string;
  title: string;
  description: string | null;
  objective: string | null;
  due_date: string;
  completed: boolean;
  content_type: string;
  content_style: string;
  keywords: string[];
  created_at: string;
  updated_at: string;
};

// Convert a ContentPlanItem to a format suitable for Supabase storage
export const toDBFormat = (item: ContentPlanItem, userId: string, websiteId: string): Omit<ContentPlanItemDB, 'id' | 'created_at' | 'updated_at'> => {
  return {
    user_id: userId,
    website_id: websiteId,
    title: item.title,
    description: item.description,
    objective: item.objective,
    due_date: item.dueDate,
    completed: item.completed,
    content_type: item.contentType,
    content_style: item.contentStyle,
    keywords: item.keywords
  };
};

// Convert from Supabase format to app format
export const fromDBFormat = (dbItem: ContentPlanItemDB): ContentPlanItem => {
  return {
    id: dbItem.id,
    title: dbItem.title,
    description: dbItem.description || '',
    objective: dbItem.objective || 'Engage with target audience',
    dueDate: dbItem.due_date,
    completed: dbItem.completed,
    contentType: dbItem.content_type,
    contentStyle: dbItem.content_style,
    keywords: dbItem.keywords
  };
};

// Get all content plan items for a website
export const getContentPlanItems = async (websiteId: string): Promise<ContentPlanItem[]> => {
  try {
    const { data, error } = await supabase
      .from('content_plan_items')
      .select('*')
      .eq('website_id', websiteId);
    
    if (error) {
      console.error('Error fetching content plan items:', error);
      return [];
    }
    
    return data.map(fromDBFormat);
  } catch (error) {
    console.error('Error fetching content plan items:', error);
    return [];
  }
};

// Add a content plan item
export const addContentPlanItem = async (item: ContentPlanItem, userId: string, websiteId: string): Promise<ContentPlanItem | null> => {
  try {
    const { data, error } = await supabase
      .from('content_plan_items')
      .insert(toDBFormat(item, userId, websiteId))
      .select()
      .single();
    
    if (error) {
      console.error('Error adding content plan item:', error);
      return null;
    }
    
    return fromDBFormat(data);
  } catch (error) {
    console.error('Error adding content plan item:', error);
    return null;
  }
};

// Update a content plan item
export const updateContentPlanItem = async (item: ContentPlanItem, userId: string, websiteId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('content_plan_items')
      .update(toDBFormat(item, userId, websiteId))
      .eq('id', item.id);
    
    if (error) {
      console.error('Error updating content plan item:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating content plan item:', error);
    return false;
  }
};

// Delete a content plan item
export const deleteContentPlanItem = async (itemId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('content_plan_items')
      .delete()
      .eq('id', itemId);
    
    if (error) {
      console.error('Error deleting content plan item:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting content plan item:', error);
    return false;
  }
};
