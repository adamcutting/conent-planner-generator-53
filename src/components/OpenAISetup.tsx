
import React from 'react';
import { InfoIcon, CheckCircle2 } from 'lucide-react';
import { isApiKeySet } from '@/utils/openaiUtils';

interface OpenAISetupProps {
  onKeyConfigured?: () => void;
}

const OpenAISetup: React.FC<OpenAISetupProps> = ({ onKeyConfigured }) => {
  React.useEffect(() => {
    // If the API key is set and we have an onKeyConfigured callback, call it
    if (isApiKeySet() && onKeyConfigured) {
      onKeyConfigured();
    }
  }, [onKeyConfigured]);

  if (!isApiKeySet()) {
    return (
      <div className="flex items-start gap-3 p-3 rounded-md bg-amber-50 border border-amber-200">
        <InfoIcon className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-amber-800">OpenAI API Key Not Configured</p>
          <p className="text-amber-700 mt-1">
            The application administrator needs to set up the OpenAI API key to enable AI-powered content generation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 p-3 rounded-md bg-green-50 border border-green-200">
      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
      <div className="text-sm">
        <p className="font-medium text-green-800">OpenAI API Key Configured</p>
        <p className="text-green-700 mt-1">
          AI-powered content generation is enabled and ready to use.
        </p>
      </div>
    </div>
  );
};

export default OpenAISetup;
