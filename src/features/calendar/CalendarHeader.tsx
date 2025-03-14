
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, 
  SparklesIcon, 
  MailIcon,
  SettingsIcon, 
  PlusIcon 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CalendarHeaderProps {
  activeTab: string;
  setShowEmailSettings: (show: boolean) => void;
  setEditingContentItem: (item: any) => void;
  setShowContentGenerator: (show: boolean) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ 
  activeTab, 
  setShowEmailSettings, 
  setEditingContentItem,
  setShowContentGenerator
}) => {
  const navigate = useNavigate();

  const handleNewContent = () => {
    setEditingContentItem(undefined);
    setShowContentGenerator(true);
  };

  const handleEmailTabClick = () => {
    navigate('/email');
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <TabsList>
        <TabsTrigger value="calendar" className="flex items-center">
          <CalendarIcon className="h-4 w-4 mr-2" />
          Calendar
        </TabsTrigger>
        <TabsTrigger value="generate" className="flex items-center">
          <SparklesIcon className="h-4 w-4 mr-2" />
          Generate Plan
        </TabsTrigger>
        <TabsTrigger 
          value="email" 
          className="flex items-center"
          onClick={handleEmailTabClick}
        >
          <MailIcon className="h-4 w-4 mr-2" />
          Email Templates
        </TabsTrigger>
      </TabsList>
      
      <div className="flex gap-2">
        {activeTab === "calendar" && (
          <>
            <Button variant="outline" size="sm" onClick={() => setShowEmailSettings(true)}>
              <SettingsIcon className="h-4 w-4 mr-2" />
              Email Settings
            </Button>
            <Button size="sm" onClick={handleNewContent}>
              <PlusIcon className="h-4 w-4 mr-2" />
              New Content
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default CalendarHeader;
