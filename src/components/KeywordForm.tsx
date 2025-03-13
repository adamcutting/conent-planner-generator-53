
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, PlusCircle, Sparkles } from 'lucide-react';

interface KeywordFormProps {
  onGeneratePlan: (keywords: string[]) => void;
}

const KeywordForm: React.FC<KeywordFormProps> = ({ onGeneratePlan }) => {
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  
  const handleAddKeyword = () => {
    if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword('');
    }
  };
  
  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keywords.length > 0) {
      onGeneratePlan(keywords);
    }
  };

  // Sample suggested keywords
  const suggestedKeywords = [
    'data analytics', 'business intelligence', 'data visualization', 
    'big data', 'data science', 'machine learning', 'data management',
    'data quality', 'data integration', 'cloud computing', 'data engineering'
  ];
  
  const handleAddSuggested = (keyword: string) => {
    if (!keywords.includes(keyword)) {
      setKeywords([...keywords, keyword]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="content-card space-y-6 animate-scale-in">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Generate Content Plan</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="keyword">Keywords to target</Label>
          <div className="flex mt-1.5">
            <Input
              id="keyword"
              value={currentKeyword}
              onChange={(e) => setCurrentKeyword(e.target.value)}
              placeholder="Enter a keyword"
              className="rounded-r-none"
            />
            <Button 
              type="button"
              onClick={handleAddKeyword}
              className="rounded-l-none"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
        
        {keywords.length > 0 && (
          <div>
            <Label>Selected keywords</Label>
            <div className="flex flex-wrap gap-2 mt-2 p-3 border rounded-md">
              {keywords.map((keyword) => (
                <Badge 
                  key={keyword} 
                  variant="secondary"
                  className="pl-2 flex items-center gap-1"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="ml-1 hover:bg-muted rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div>
          <Label>Suggested keywords for datahq.co.uk</Label>
          <ScrollArea className="h-[100px] mt-2 border rounded-md p-3">
            <div className="flex flex-wrap gap-2">
              {suggestedKeywords.map((keyword) => (
                <Badge 
                  key={keyword} 
                  variant="outline"
                  className="cursor-pointer hover:bg-secondary transition-colors"
                  onClick={() => handleAddSuggested(keyword)}
                >
                  <PlusCircle className="h-3 w-3 mr-1" />
                  {keyword}
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
      
      <Button type="submit" disabled={keywords.length === 0} className="w-full">
        <Sparkles className="h-4 w-4 mr-2" />
        Generate 90-Day Content Plan
      </Button>
    </form>
  );
};

export default KeywordForm;
