
import { supabase } from '@/integrations/supabase/client';

export type WebsiteUser = {
  id: string;
  user_id: string;
  website_id: string;
  role: 'admin' | 'editor';
  created_at: string;
  profiles?: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
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
    
    // Transform the raw data to handle potential missing profiles and ensure role is the correct type
    return (data || []).map(user => {
      // If profiles is a SelectQueryError (indicated by error property), replace with null
      const profileData = user.profiles && 'error' in user.profiles 
        ? null 
        : user.profiles;
      
      return {
        ...user,
        role: user.role === 'admin' ? 'admin' : 'editor', // Ensure role is strictly 'admin' or 'editor'
        profiles: profileData
      };
    }) as WebsiteUser[];
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
      .eq('email', email);
    
    if (userError || !users || users.length === 0) {
      console.error('User not found:', email);
      return false;
    }
    
    // Then add them to the website
    const { error } = await supabase
      .from('website_users')
      .insert({
        user_id: users[0].id,
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
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;
    
    const { data, error } = await supabase
      .from('website_users')
      .select('id')
      .eq('website_id', websiteId)
      .eq('user_id', user.id)
      .maybeSingle();
      
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
