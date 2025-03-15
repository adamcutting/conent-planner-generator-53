
import React from 'react';
import { Check, Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWebsite, Website } from '@/contexts/WebsiteContext';

const WebsiteSwitcher: React.FC = () => {
  const { selectedWebsite, setSelectedWebsite, websites } = useWebsite();

  return (
    <div className="flex items-center gap-2">
      <div 
        className="h-3 w-3 rounded-full mr-1" 
        style={{ backgroundColor: selectedWebsite.color }}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1 border-dashed">
            <Globe className="h-4 w-4" />
            <span>{selectedWebsite.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {websites.map((website) => (
            <DropdownMenuItem
              key={website.id}
              onClick={() => setSelectedWebsite(website)}
              className="flex items-center gap-2 min-w-[180px]"
            >
              <div 
                className="h-2 w-2 rounded-full" 
                style={{ backgroundColor: website.color }}
              />
              <span>{website.name}</span>
              {selectedWebsite.id === website.id && (
                <Check className="h-4 w-4 ml-auto" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default WebsiteSwitcher;
