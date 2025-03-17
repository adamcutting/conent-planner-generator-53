
import { supabase } from '@/integrations/supabase/client';

export interface WebsiteUser {
  id: string;
  userId: string;
  websiteId: string;
  role: 'admin' | 'editor';
  created_at: string;
  displayName?: string;
  avatarUrl?: string;
}

// Simplified for demonstration - in a real app would involve proper joins with the profiles table
export const getWebsiteUsers = async (websiteId: string): Promise<WebsiteUser[]> => {
  try {
    const { data, error } = await supabase
      .from('website_users')
      .select(`
        id,
        user_id,
        website_id,
        role,
        created_at
      `)
      .eq('website_id', websiteId);
    
    if (error) {
      console.error('Error fetching website users:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }

    // Transform the data to match our WebsiteUser interface
    return data.map(user => ({
      id: user.id,
      userId: user.user_id,
      websiteId: user.website_id,
      role: user.role as 'admin' | 'editor',
      created_at: user.created_at,
      // These would come from a join with profiles in a real implementation
      displayName: undefined,
      avatarUrl: undefined
    }));
  } catch (error) {
    console.error('Error fetching website users:', error);
    return [];
  }
};

// Get a user's role for a specific website
export const getUserRole = async (userId: string, websiteId: string): Promise<'admin' | 'editor' | null> => {
  try {
    const { data, error } = await supabase
      .from('website_users')
      .select('role')
      .eq('user_id', userId)
      .eq('website_id', websiteId)
      .single();
    
    if (error || !data) {
      console.error('Error fetching user role:', error);
      return null;
    }
    
    return data.role as 'admin' | 'editor';
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
};

// Add a user to a website
export const addWebsiteUser = async (
  userId: string, 
  websiteId: string, 
  role: 'admin' | 'editor' = 'editor'
): Promise<WebsiteUser | null> => {
  try {
    const { data, error } = await supabase
      .from('website_users')
      .insert({
        user_id: userId,
        website_id: websiteId,
        role
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding website user:', error);
      return null;
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      websiteId: data.website_id,
      role: data.role as 'admin' | 'editor',
      created_at: data.created_at,
      displayName: undefined,
      avatarUrl: undefined
    };
  } catch (error) {
    console.error('Error adding website user:', error);
    return null;
  }
};

// Remove a user from a website
export const removeWebsiteUser = async (userId: string, websiteId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('website_users')
      .delete()
      .eq('user_id', userId)
      .eq('website_id', websiteId);
    
    if (error) {
      console.error('Error removing website user:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error removing website user:', error);
    return false;
  }
};

// Update a user's role for a website
export const updateWebsiteUserRole = async (
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
    
    if (error) {
      console.error('Error updating website user role:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating website user role:', error);
    return false;
  }
};
