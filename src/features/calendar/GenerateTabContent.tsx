
import React from 'react';
import KeywordForm from '@/components/KeywordForm';

interface GenerateTabContentProps {
  onGeneratePlan: (keywords: string[]) => void;
}

const GenerateTabContent: React.FC<GenerateTabContentProps> = ({ onGeneratePlan }) => {
  return (
    <div className="max-w-xl mx-auto">
      <KeywordForm onGeneratePlan={onGeneratePlan} />
    </div>
  );
};

export default GenerateTabContent;
