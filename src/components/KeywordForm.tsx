
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { 
  X, 
  PlusCircle, 
  Sparkles, 
  CalendarIcon, 
  Check,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface KeywordFormProps {
  onGeneratePlan: (
    keywords: string[], 
    startDate: Date, 
    includeWeekends: boolean,
    contentTypes: string[]
  ) => void;
}

const KeywordForm: React.FC<KeywordFormProps> = ({ onGeneratePlan }) => {
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [includeWeekends, setIncludeWeekends] = useState(false);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([
    'blog', 'social', 'email', 'infographic', 'landing-page'
  ]);
  
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
      onGeneratePlan(keywords, startDate, includeWeekends, selectedContentTypes);
    }
  };

  const handleContentTypeChange = (value: string) => {
    if (value === "all") {
      setSelectedContentTypes([
        'blog', 'social', 'email', 'infographic', 'landing-page'
      ]);
    } else {
      // Toggle selection
      setSelectedContentTypes(current => 
        current.includes(value)
          ? current.filter(type => type !== value)
          : [...current, value]
      );
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start-date">Plan start date</Label>
            <div className="mt-1.5">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="start-date"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "PPP")
                    ) : (
                      <span>Pick a start date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div>
            <Label>Content types to include</Label>
            <Select onValueChange={handleContentTypeChange}>
              <SelectTrigger className="w-full mt-1.5">
                <SelectValue placeholder="Select content types" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Content Types</SelectLabel>
                  <SelectItem value="all">All content types</SelectItem>
                  <SelectItem value="blog">Blog posts</SelectItem>
                  <SelectItem value="social">Social media posts</SelectItem>
                  <SelectItem value="email">Email newsletters</SelectItem>
                  <SelectItem value="infographic">Infographics</SelectItem>
                  <SelectItem value="landing-page">Landing pages</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedContentTypes.map((type) => (
                <Badge key={type} variant="outline" className="capitalize">
                  {type}
                  <button
                    type="button"
                    onClick={() => handleContentTypeChange(type)}
                    className="ml-1 hover:bg-muted rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="weekends" 
            checked={includeWeekends} 
            onCheckedChange={(checked) => setIncludeWeekends(checked === true)}
          />
          <Label htmlFor="weekends" className="cursor-pointer">
            Include weekends in plan
          </Label>
        </div>
        
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
