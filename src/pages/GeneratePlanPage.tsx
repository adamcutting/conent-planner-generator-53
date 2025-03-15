
import React from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import GenerateTabContent from '@/features/calendar/GenerateTabContent';
import { generateContentPlanFromKeywords, getStartDate } from '@/utils/calendarUtils';
import { saveContentPlan } from '@/utils/contentUtils';
import { useWebsite } from '@/contexts/WebsiteContext';

const GeneratePlanPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { selectedWebsite } = useWebsite();
  
  const handleGeneratePlan = (
    keywords: string[], 
    startDate: Date, 
    includeWeekends: boolean,
    contentTypes: string[]
  ) => {
    const newPlan = generateContentPlanFromKeywords(
      keywords, 
      startDate, 
      includeWeekends,
      contentTypes
    );
    
    saveContentPlan(newPlan);
    
    toast({
      title: `Content plan generated for ${selectedWebsite.name}`,
      description: `Created a new content plan with ${newPlan.length} items starting from ${startDate.toLocaleDateString()}`,
    });
    
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-8 animate-fade-in">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold">Generate Content Plan</h1>
          <div 
            className="h-3 w-3 rounded-full" 
            style={{ backgroundColor: selectedWebsite.color }}
          />
          <span className="text-muted-foreground">{selectedWebsite.name}</span>
        </div>
        <p className="text-muted-foreground">
          Create a new content plan for your {selectedWebsite.name} marketing calendar
        </p>
      </header>
      
      <GenerateTabContent onGeneratePlan={handleGeneratePlan} />
    </div>
  );
};

export default GeneratePlanPage;
