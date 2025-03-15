
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Website {
  id: string;
  name: string;
  color: string;
}

// Default websites list
export const websites: Website[] = [
  { id: 'main', name: 'DataHQ', color: '#9b87f5' },
  { id: 'blog', name: 'Company Blog', color: '#0EA5E9' },
  { id: 'docs', name: 'Documentation', color: '#F97316' },
  { id: 'marketing', name: 'Marketing Site', color: '#8B5CF6' },
];

interface WebsiteContextType {
  selectedWebsite: Website;
  setSelectedWebsite: (website: Website) => void;
  websites: Website[];
}

const WebsiteContext = createContext<WebsiteContextType | undefined>(undefined);

export const WebsiteProvider = ({ children }: { children: ReactNode }) => {
  const [selectedWebsite, setSelectedWebsite] = useState<Website>(websites[0]);

  return (
    <WebsiteContext.Provider value={{ selectedWebsite, setSelectedWebsite, websites }}>
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
