
import React from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import GenerateTabContent from '@/features/calendar/GenerateTabContent';
import { generateContentPlanFromKeywords, getStartDate } from '@/utils/calendarUtils';
import { saveContentPlan } from '@/utils/contentUtils';

const GeneratePlanPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
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
      title: "Content plan generated",
      description: `Created a new content plan with ${newPlan.length} items starting from ${startDate.toLocaleDateString()}`,
    });
    
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">Generate Content Plan</h1>
        <p className="text-muted-foreground">
          Create a new content plan for your marketing calendar
        </p>
      </header>
      
      <GenerateTabContent onGeneratePlan={handleGeneratePlan} />
    </div>
  );
};

export default GeneratePlanPage;
