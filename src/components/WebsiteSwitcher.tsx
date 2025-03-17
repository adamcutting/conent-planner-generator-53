
import React, { useState } from 'react';
import { Check, Globe, Plus, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useWebsite, Website } from '@/contexts/WebsiteContext';
import { useToast } from "@/components/ui/use-toast";

export const WebsiteSwitcher: React.FC = () => {
  const { selectedWebsite, setSelectedWebsite, websites, addWebsite, removeWebsite } = useWebsite();
  const [newWebsiteUrl, setNewWebsiteUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleAddWebsite = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newWebsiteUrl) {
      addWebsite(newWebsiteUrl);
      setNewWebsiteUrl("");
      setIsOpen(false);
      
      toast({
        title: "Website added",
        description: `Added ${newWebsiteUrl} to your websites list`,
      });
    }
  };

  const handleRemoveWebsite = (e: React.MouseEvent, websiteId: string, websiteName: string) => {
    e.stopPropagation();
    
    // Don't allow removing the last website
    if (websites.length <= 1) {
      toast({
        title: "Cannot remove website",
        description: "You need at least one website in your list",
        variant: "destructive"
      });
      return;
    }
    
    removeWebsite(websiteId);
    
    toast({
      title: "Website removed",
      description: `Removed ${websiteName} from your websites list`,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <div 
        className="h-3 w-3 rounded-full mr-1" 
        style={{ backgroundColor: selectedWebsite.color }}
      />
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1 border-dashed">
            <Globe className="h-4 w-4" />
            <span>{selectedWebsite.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[220px]">
          {websites.map((website) => (
            <DropdownMenuItem
              key={website.id}
              onClick={() => setSelectedWebsite(website)}
              className="flex items-center gap-2 min-w-[180px] group"
            >
              <div 
                className="h-2 w-2 rounded-full" 
                style={{ backgroundColor: website.color }}
              />
              <span>{website.name}</span>
              {selectedWebsite.id === website.id && (
                <Check className="h-4 w-4 ml-auto" />
              )}
              <Button
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleRemoveWebsite(e, website.id, website.name)}
                disabled={websites.length <= 1}
              >
                <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
              </Button>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <div className="p-2">
            <form onSubmit={handleAddWebsite} className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Input
                  value={newWebsiteUrl}
                  onChange={(e) => setNewWebsiteUrl(e.target.value)}
                  placeholder="www.data-broker.co.uk"
                  className="h-8 text-sm"
                />
                <Button 
                  type="submit" 
                  size="sm" 
                  className="h-8 px-2"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                Add a new website to create content for
              </div>
            </form>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default WebsiteSwitcher;
