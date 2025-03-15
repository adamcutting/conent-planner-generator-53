
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
}

const WebsiteContext = createContext<WebsiteContextType | undefined>(undefined);

export const WebsiteProvider = ({ children }: { children: ReactNode }) => {
  const [websites, setWebsites] = useState<Website[]>(getSavedWebsites);
  const [selectedWebsite, setSelectedWebsite] = useState<Website>(websites[0]);

  // Save websites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('websites', JSON.stringify(websites));
  }, [websites]);

  // Add a new website from URL
  const addWebsite = (url: string) => {
    if (!url) return;

    // Check if website already exists
    const exists = websites.some(
      (site) => site.name.toLowerCase() === url.toLowerCase()
    );

    if (!exists) {
      const newWebsite = websiteFromUrl(url);
      const updatedWebsites = [...websites, newWebsite];
      setWebsites(updatedWebsites);
      setSelectedWebsite(newWebsite);
    }
  };

  return (
    <WebsiteContext.Provider 
      value={{ 
        selectedWebsite, 
        setSelectedWebsite, 
        websites, 
        addWebsite 
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
