
import { supabase } from '@/integrations/supabase/client';

export type WebsiteUser = {
  id: string;
  user_id: string;
  website_id: string;
  role: 'admin' | 'editor';
  created_at: string;
};

// Get all users for a website
export const getWebsiteUsers = async (websiteId: string): Promise<WebsiteUser[]> => {
  try {
    const { data, error } = await supabase
      .from('website_users')
      .select(`
        id, 
        user_id, 
        website_id, 
        role, 
        created_at,
        profiles:user_id (
          display_name,
          avatar_url
        )
      `)
      .eq('website_id', websiteId);
    
    if (error) {
      console.error('Error fetching website users:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching website users:', error);
    return [];
  }
};

// Add a user to a website
export const addUserToWebsite = async (
  email: string, 
  websiteId: string, 
  role: 'admin' | 'editor' = 'editor'
): Promise<boolean> => {
  try {
    // First, find the user by email
    const { data: users, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();
    
    if (userError || !users) {
      console.error('User not found:', email);
      return false;
    }
    
    // Then add them to the website
    const { error } = await supabase
      .from('website_users')
      .insert({
        user_id: users.id,
        website_id: websiteId,
        role
      });
      
    return !error;
  } catch (error) {
    console.error('Error adding user to website:', error);
    return false;
  }
};

// Remove a user from a website
export const removeUserFromWebsite = async (userId: string, websiteId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('website_users')
      .delete()
      .eq('user_id', userId)
      .eq('website_id', websiteId);
      
    return !error;
  } catch (error) {
    console.error('Error removing user from website:', error);
    return false;
  }
};

// Check if a user has access to a website
export const hasWebsiteAccess = async (websiteId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('website_users')
      .select('id')
      .eq('website_id', websiteId)
      .single();
      
    return !error && !!data;
  } catch (error) {
    console.error('Error checking website access:', error);
    return false;
  }
};

// Update a user's role for a website
export const updateUserRole = async (
  userId: string, 
  websiteId: string, 
  role: 'admin' | 'editor'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('website_users')
      .update({ role })
      .eq('user_id', userId)
      .eq('website_id', websiteId);
      
    return !error;
  } catch (error) {
    console.error('Error updating user role:', error);
    return false;
  }
};
