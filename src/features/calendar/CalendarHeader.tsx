
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CalendarIcon, BellIcon, Sparkles, PencilIcon } from 'lucide-react';

interface CalendarHeaderProps {
  activeTab: string;
  setShowEmailSettings: (show: boolean) => void;
  setEditingContentItem: (item: undefined) => void;
  setShowContentGenerator: (show: boolean) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  activeTab,
  setShowEmailSettings,
  setEditingContentItem,
  setShowContentGenerator,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <TabsList>
        <TabsTrigger value="calendar" className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Calendar
        </TabsTrigger>
        <TabsTrigger value="generate" className="flex items-center">
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Plan
        </TabsTrigger>
      </TabsList>
      
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowEmailSettings(true)}
          className="flex items-center"
        >
          <BellIcon className="mr-2 h-4 w-4" />
          Alerts
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            setEditingContentItem(undefined);
            setShowContentGenerator(true);
          }}
          className="flex items-center"
        >
          <PencilIcon className="mr-2 h-4 w-4" />
          Create Content
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
