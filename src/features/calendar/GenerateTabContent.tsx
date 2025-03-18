
import React from 'react';
import KeywordForm from '@/components/KeywordForm';
import { useWebsite } from '@/contexts/WebsiteContext';

interface GenerateTabContentProps {
  onGeneratePlan: (
    keywords: string[], 
    startDate: Date, 
    includeWeekends: boolean,
    contentTypes: string[]
  ) => void;
}

const GenerateTabContent: React.FC<GenerateTabContentProps> = ({ onGeneratePlan }) => {
  const { selectedWebsite } = useWebsite();
  
  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Content Plan Generator</h2>
        <p className="text-muted-foreground">
          Generate a 90-day content plan for {selectedWebsite.name} with your target keywords.
          Customize the start date, content types, and scheduling options.
        </p>
      </div>
      <KeywordForm onGeneratePlan={onGeneratePlan} />
    </div>
  );
};

export default GenerateTabContent;
