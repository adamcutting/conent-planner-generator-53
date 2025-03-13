
import React from 'react';
import KeywordForm from '@/components/KeywordForm';
import { ChartBarIcon } from 'lucide-react';

interface GenerateTabContentProps {
  onGeneratePlan: (keywords: string[]) => void;
}

const GenerateTabContent: React.FC<GenerateTabContentProps> = ({ onGeneratePlan }) => {
  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8 text-center">
        <div className="inline-block bg-primary/10 p-3 rounded-full mb-4">
          <ChartBarIcon className="h-8 w-8 text-datahq-blue" />
        </div>
        <h2 className="text-2xl font-bold text-datahq-charcoal mb-2">Content Plan Generator</h2>
        <p className="text-gray-600">
          Generate a 90-day content plan for DataHQ with your target keywords.
          Content will be scheduled only on weekdays.
        </p>
      </div>
      <KeywordForm onGeneratePlan={onGeneratePlan} />
    </div>
  );
};

export default GenerateTabContent;
