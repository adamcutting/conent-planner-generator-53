
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import GenerateTabContent from '@/features/calendar/GenerateTabContent';
import { generateContentPlanFromKeywords, getStartDate } from '@/utils/calendarUtils';
import { saveContentPlan } from '@/utils/contentUtils';
import { useWebsite } from '@/contexts/WebsiteContext';
import { isApiKeySet } from '@/utils/openaiUtils';
import OpenAISetup from '@/components/OpenAISetup';
import { ContentPlanItem } from '@/utils/calendarUtils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { generateContentWithOpenAI } from '@/utils/openaiUtils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CalendarPlus, MessageSquarePlus, Check } from 'lucide-react';

const GeneratePlanPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { selectedWebsite } = useWebsite();
  const [openAIConfigured] = React.useState<boolean>(isApiKeySet());
  const [generatedPlan, setGeneratedPlan] = useState<ContentPlanItem[] | null>(null);
  const [isModifying, setIsModifying] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  
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
    
    setGeneratedPlan(newPlan);
    
    toast({
      title: `Content plan generated`,
      description: `Created ${newPlan.length} content items. Review and approve them below.`,
    });
  };

  const handleApproveAndSave = () => {
    if (generatedPlan) {
      saveContentPlan(generatedPlan);
      toast({
        title: `Content plan added to calendar`,
        description: `Added ${generatedPlan.length} items to your content calendar.`,
      });
      navigate('/');
    }
  };

  const handleModifyWithAI = async () => {
    if (!aiPrompt || !generatedPlan) return;

    setIsModifying(true);
    try {
      const { generatedText } = await generateContentWithOpenAI({
        prompt: `Given this content plan: \n${JSON.stringify(generatedPlan, null, 2)}\n\nModify it according to this request: ${aiPrompt}\n\nReturn ONLY the modified JSON array of content items with the same structure.`,
        keyword: ''  // Not needed for this use case
      });

      try {
        const modifiedPlan = JSON.parse(generatedText);
        if (Array.isArray(modifiedPlan)) {
          setGeneratedPlan(modifiedPlan);
          toast({
            title: "Plan modified",
            description: "The content plan has been updated according to your request.",
          });
        }
      } catch (e) {
        toast({
          title: "Error parsing AI response",
          description: "The AI response couldn't be processed. Please try a different prompt.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error modifying plan",
        description: error instanceof Error ? error.message : "Failed to modify the plan",
        variant: "destructive"
      });
    } finally {
      setIsModifying(false);
      setAiPrompt('');
    }
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
      
      {!openAIConfigured && (
        <div className="mb-6">
          <OpenAISetup />
        </div>
      )}
      
      <GenerateTabContent onGeneratePlan={handleGeneratePlan} />

      {generatedPlan && (
        <div className="mt-8 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Review Generated Plan</h2>
            <Button onClick={handleApproveAndSave}>
              <CalendarPlus className="mr-2 h-4 w-4" />
              Add to Calendar
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="ai-prompt">Modify plan with AI</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    id="ai-prompt"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g., Add more video content, or make content more technical"
                    disabled={isModifying}
                  />
                  <Button 
                    onClick={handleModifyWithAI}
                    disabled={!aiPrompt || isModifying}
                  >
                    {isModifying ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MessageSquarePlus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <ScrollArea className="h-[400px] border rounded-lg p-4">
              <div className="space-y-4">
                {generatedPlan.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{item.title}</h3>
                        <Badge variant="outline">{item.contentType}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {item.keywords.map((keyword, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(item.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratePlanPage;

