
import { supabase } from '@/integrations/supabase/client';

export type ContentLock = {
  id: string;
  content_id: string;
  user_id: string;
  locked_at: string;
  expires_at: string;
};

// Acquire a lock on a content item
export const acquireLock = async (contentId: string): Promise<boolean> => {
  try {
    // First, clean up any expired locks
    await cleanupExpiredLocks();
    
    // Check if the content is already locked by someone else
    const { data: existingLock } = await supabase
      .from('content_locks')
      .select('*')
      .eq('content_id', contentId)
      .single();
      
    if (existingLock) {
      // If lock exists but is expired, remove it
      const now = new Date();
      const expiresAt = new Date(existingLock.expires_at);
      
      if (now > expiresAt) {
        await supabase
          .from('content_locks')
          .delete()
          .eq('content_id', contentId);
      } else {
        // Content is locked by someone else
        return false;
      }
    }
    
    // Create a new lock
    const { error } = await supabase
      .from('content_locks')
      .insert({
        content_id: contentId,
        // expires_at is set by default to now() + 10 minutes in the database
      });
    
    return !error;
  } catch (error) {
    console.error('Error acquiring lock:', error);
    return false;
  }
};

// Release a lock on a content item
export const releaseLock = async (contentId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('content_locks')
      .delete()
      .eq('content_id', contentId);
      
    return !error;
  } catch (error) {
    console.error('Error releasing lock:', error);
    return false;
  }
};

// Renew a lock to extend its expiration time
export const renewLock = async (contentId: string): Promise<boolean> => {
  try {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes from now
    
    const { error } = await supabase
      .from('content_locks')
      .update({ expires_at: expiresAt.toISOString() })
      .eq('content_id', contentId);
      
    return !error;
  } catch (error) {
    console.error('Error renewing lock:', error);
    return false;
  }
};

// Check if the current user has a lock on a content item
export const hasLock = async (contentId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('content_locks')
      .select('*')
      .eq('content_id', contentId)
      .single();
      
    if (error || !data) {
      return false;
    }
    
    // Check if the lock is expired
    const now = new Date();
    const expiresAt = new Date(data.expires_at);
    
    return now < expiresAt;
  } catch (error) {
    console.error('Error checking lock:', error);
    return false;
  }
};

// Clean up expired locks in the database
export const cleanupExpiredLocks = async (): Promise<void> => {
  try {
    const now = new Date().toISOString();
    
    await supabase
      .from('content_locks')
      .delete()
      .lt('expires_at', now);
  } catch (error) {
    console.error('Error cleaning up locks:', error);
  }
};
