
import { supabase } from '@/integrations/supabase/client';
import { ContentPlanItem } from './calendarUtils';

// Convert Supabase data to ContentPlanItem format
export const convertToContentPlanItem = (item: any): ContentPlanItem => {
  return {
    id: item.id,
    title: item.title,
    description: item.description || '',
    objective: item.objective || '',
    dueDate: item.due_date,
    completed: item.completed || false,
    contentType: item.content_type as "blog" | "social" | "email" | "infographic" | "landing-page",
    contentStyle: item.content_style as "infographic" | "knowledge" | "guide" | "story" | "stats" | "testimonial",
    keywords: item.keywords || []
  };
};

// Convert ContentPlanItem to Supabase format
export const convertToSupabaseFormat = (item: ContentPlanItem, userId: string, websiteId: string) => {
  return {
    id: item.id.startsWith('new-') ? undefined : item.id,
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

// Add a new content plan item to Supabase
export const addContentPlanItem = async (item: ContentPlanItem, userId: string, websiteId: string) => {
  try {
    const supabaseItem = convertToSupabaseFormat(item, userId, websiteId);
    
    const { data, error } = await supabase
      .from('content_plan_items')
      .insert(supabaseItem)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding content plan item:', error);
      return null;
    }
    
    return convertToContentPlanItem(data);
  } catch (error) {
    console.error('Error adding content plan item:', error);
    return null;
  }
};

// Update an existing content plan item in Supabase
export const updateContentPlanItem = async (item: ContentPlanItem, userId: string, websiteId: string) => {
  try {
    const supabaseItem = convertToSupabaseFormat(item, userId, websiteId);
    
    // Remove id from the update payload
    const { id, ...updatePayload } = supabaseItem;
    
    const { data, error } = await supabase
      .from('content_plan_items')
      .update(updatePayload)
      .eq('id', item.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating content plan item:', error);
      return null;
    }
    
    return convertToContentPlanItem(data);
  } catch (error) {
    console.error('Error updating content plan item:', error);
    return null;
  }
};

// Delete a content plan item from Supabase
export const deleteContentPlanItem = async (itemId: string) => {
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

// Load content plan items for a user and website
export const loadContentPlanItems = async (userId: string, websiteId: string) => {
  try {
    const { data, error } = await supabase
      .from('content_plan_items')
      .select('*')
      .eq('website_id', websiteId)
      .order('due_date', { ascending: true });
    
    if (error) {
      console.error('Error loading content plan items:', error);
      return [];
    }
    
    return data.map(convertToContentPlanItem);
  } catch (error) {
    console.error('Error loading content plan items:', error);
    return [];
  }
};
