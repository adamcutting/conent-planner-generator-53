
import React from 'react';
import KeywordForm from '@/components/KeywordForm';
import { ChartBarIcon } from 'lucide-react';

interface GenerateTabContentProps {
  onGeneratePlan: (
    keywords: string[], 
    startDate: Date, 
    includeWeekends: boolean,
    contentTypes: string[]
  ) => void;
}

const GenerateTabContent: React.FC<GenerateTabContentProps> = ({ onGeneratePlan }) => {
  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <img 
            src="/logo.svg" 
            alt="DataHQ Logo" 
            className="h-16 w-16"
          />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Content Plan Generator</h2>
        <p className="text-muted-foreground">
          Generate a 90-day content plan for DataHQ with your target keywords.
          Customize the start date, content types, and scheduling options.
        </p>
      </div>
      <KeywordForm onGeneratePlan={onGeneratePlan} />
    </div>
  );
};

export default GenerateTabContent;
