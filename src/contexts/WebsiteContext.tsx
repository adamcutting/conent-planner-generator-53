
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export interface Website {
  id: string;
  name: string;
  color: string;
}

// Default websites list
export const defaultWebsites: Website[] = [
  { id: 'main', name: 'DataHQ', color: '#9b87f5' },
  { id: 'blog', name: 'Company Blog', color: '#0EA5E9' },
  { id: 'docs', name: 'Documentation', color: '#F97316' },
  { id: 'marketing', name: 'Marketing Site', color: '#8B5CF6' },
];

// Function to generate a website object from a URL
export const websiteFromUrl = (url: string): Website => {
  // Remove protocol and www if present
  const cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '');
  
  // Generate a random color
  const colors = ['#9b87f5', '#0EA5E9', '#F97316', '#8B5CF6', '#D946EF', '#F43F5E'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  return {
    id: cleanUrl.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name: cleanUrl,
    color: randomColor,
  };
};

// Get websites from localStorage or use defaults
const getSavedWebsites = (): Website[] => {
  const saved = localStorage.getItem('websites');
  return saved ? JSON.parse(saved) : defaultWebsites;
};

interface WebsiteContextType {
  selectedWebsite: Website;
  setSelectedWebsite: (website: Website) => void;
  websites: Website[];
  addWebsite: (url: string) => void;
  removeWebsite: (id: string) => void;
}

const WebsiteContext = createContext<WebsiteContextType | undefined>(undefined);

export const WebsiteProvider = ({ children }: { children: ReactNode }) => {
  const [websites, setWebsites] = useState<Website[]>(getSavedWebsites);
  const [selectedWebsite, setSelectedWebsite] = useState<Website>(websites[0]);
  const { user } = useAuth();

  // Save websites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('websites', JSON.stringify(websites));
  }, [websites]);

  // Load websites from Supabase when authenticated
  useEffect(() => {
    const loadUserWebsites = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('website_users')
          .select('website_id')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error loading user websites:', error);
          return;
        }

        // If user has website access, just continue with current websites
        // This is a simplified approach - in a real app, you'd want to
        // fetch websites from the database and merge with local storage
        if (data && data.length > 0) {
          console.log('User has access to websites:', data);
        }
      } catch (error) {
        console.error('Error loading user websites:', error);
      }
    };

    loadUserWebsites();
  }, [user]);

  // Add a new website from URL
  const addWebsite = async (url: string) => {
    if (!url || !user) return;

    // Check if website already exists
    const exists = websites.some(
      (site) => site.name.toLowerCase() === url.toLowerCase()
    );

    if (!exists) {
      const newWebsite = websiteFromUrl(url);
      const updatedWebsites = [...websites, newWebsite];
      setWebsites(updatedWebsites);
      setSelectedWebsite(newWebsite);

      // Add the association in the database
      try {
        await supabase
          .from('website_users')
          .insert({
            user_id: user.id,
            website_id: newWebsite.id,
            role: 'admin'  // First user is admin
          });
      } catch (error) {
        console.error('Error adding website to database:', error);
      }
    }
  };

  // Remove a website by ID
  const removeWebsite = async (id: string) => {
    // Don't allow removing the last website
    if (websites.length <= 1 || !user) {
      return;
    }

    const updatedWebsites = websites.filter(site => site.id !== id);
    setWebsites(updatedWebsites);
    
    // If we're removing the currently selected website, select the first one
    if (selectedWebsite.id === id) {
      setSelectedWebsite(updatedWebsites[0]);
    }

    // Remove the association in the database
    try {
      await supabase
        .from('website_users')
        .delete()
        .eq('website_id', id)
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error removing website from database:', error);
    }
  };

  return (
    <WebsiteContext.Provider 
      value={{ 
        selectedWebsite, 
        setSelectedWebsite, 
        websites, 
        addWebsite,
        removeWebsite
      }}
    >
      {children}
    </WebsiteContext.Provider>
  );
};

export const useWebsite = () => {
  const context = useContext(WebsiteContext);
  if (!context) {
    throw new Error('useWebsite must be used within a WebsiteProvider');
  }
  return context;
};
