
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { setOpenAIApiKey, getOpenAIApiKey, clearOpenAIApiKey } from '@/utils/openaiUtils';
import { useToast } from '@/components/ui/use-toast';

interface OpenAISetupProps {
  onKeyConfigured?: () => void;
}

const OpenAISetup: React.FC<OpenAISetupProps> = ({ onKeyConfigured }) => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [isKeySet, setIsKeySet] = useState(false);
  const [isKeySaving, setIsKeySaving] = useState(false);
  const [showKey, setShowKey] = useState(false);
  
  useEffect(() => {
    const storedKey = getOpenAIApiKey();
    setIsKeySet(!!storedKey);
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);
  
  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key",
        variant: "destructive"
      });
      return;
    }
    
    setIsKeySaving(true);
    
    // Simulate a validation check
    setTimeout(() => {
      setOpenAIApiKey(apiKey);
      setIsKeySet(true);
      setIsKeySaving(false);
      
      toast({
        title: "API Key Saved",
        description: "Your OpenAI API key has been saved"
      });
      
      if (onKeyConfigured) {
        onKeyConfigured();
      }
    }, 500);
  };
  
  const handleClearKey = () => {
    clearOpenAIApiKey();
    setApiKey('');
    setIsKeySet(false);
    
    toast({
      title: "API Key Removed",
      description: "Your OpenAI API key has been removed"
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-3 rounded-md bg-amber-50 border border-amber-200">
        <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-amber-800">OpenAI API Key Required</p>
          <p className="text-amber-700 mt-1">
            To enable AI-powered content generation, please enter your OpenAI API key.
            Your key will be stored locally in your browser and is not sent to our servers.
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="api-key" className="flex items-center">
          <KeyRound className="h-4 w-4 mr-2" />
          OpenAI API Key
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Input
              id="api-key"
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="pr-24"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-7"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? 'Hide' : 'Show'}
            </Button>
          </div>
          {isKeySet ? (
            <Button variant="outline" onClick={handleClearKey}>
              Reset
            </Button>
          ) : (
            <Button 
              onClick={handleSaveKey} 
              disabled={!apiKey.trim() || isKeySaving}
            >
              {isKeySaving ? 'Saving...' : 'Save Key'}
            </Button>
          )}
        </div>
      </div>
      
      {isKeySet && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          API key is configured and ready to use
        </div>
      )}
    </div>
  );
};

export default OpenAISetup;
