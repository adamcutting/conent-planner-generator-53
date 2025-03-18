
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import GenerateTabContent from '@/features/calendar/GenerateTabContent';
import { generateContentPlanFromKeywords, getStartDate } from '@/utils/calendarUtils';
import { saveContentPlan, loadContentPlan } from '@/utils/contentUtils';
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
import { 
  Loader2, 
  CalendarPlus, 
  MessageSquarePlus,
  AlertCircle
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const GeneratePlanPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { selectedWebsite } = useWebsite();
  const [openAIConfigured] = React.useState<boolean>(isApiKeySet());
  const [generatedPlan, setGeneratedPlan] = useState<ContentPlanItem[] | null>(null);
  const [isModifying, setIsModifying] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showReplaceDialog, setShowReplaceDialog] = useState(false);
  
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
    console.log("Generated plan with items:", newPlan.length);
    
    toast({
      title: `Content plan generated`,
      description: `Created ${newPlan.length} content items. Review and approve them below.`,
    });
  };

  const handleApproveAndSave = () => {
    if (!generatedPlan || generatedPlan.length === 0) {
      toast({
        title: "No content to save",
        description: "Please generate a content plan first.",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Approving plan with items:", generatedPlan.length);
    
    // Check if there's an existing plan
    const existingPlan = loadContentPlan();
    if (existingPlan && existingPlan.length > 0) {
      console.log("Found existing plan with items:", existingPlan.length);
      setShowReplaceDialog(true);
    } else {
      // No existing plan, just save
      console.log("No existing plan found, saving new plan");
      saveNewPlan();
    }
  };

  const saveNewPlan = () => {
    if (!generatedPlan || generatedPlan.length === 0) return;
    
    console.log("Saving new plan with items:", generatedPlan.length);
    
    // Create a deep copy of the array to ensure we're not just passing a reference
    const planToSave = JSON.parse(JSON.stringify(generatedPlan));
    const saveResult = saveContentPlan(planToSave);
    
    if (saveResult) {
      toast({
        title: `Content plan added to calendar`,
        description: `Added ${planToSave.length} items to your content calendar.`,
      });
      navigate('/');
    } else {
      toast({
        title: "Error saving plan",
        description: "There was a problem saving your content plan. Please try again.",
        variant: "destructive"
      });
    }
  };

  const appendToPlan = () => {
    if (!generatedPlan || generatedPlan.length === 0) return;
    
    const existingPlan = loadContentPlan() || [];
    console.log("Appending to existing plan. New items:", generatedPlan.length, "Existing items:", existingPlan.length);
    
    // Create a deep copy of both arrays before combining
    const generatedPlanCopy = JSON.parse(JSON.stringify(generatedPlan));
    const existingPlanCopy = JSON.parse(JSON.stringify(existingPlan));
    
    // Create a new array combining both plans
    const combinedPlan = [...existingPlanCopy, ...generatedPlanCopy];
    console.log("Combined plan total items:", combinedPlan.length);
    
    const saveResult = saveContentPlan(combinedPlan);
    
    if (saveResult) {
      toast({
        title: `Content plan updated`,
        description: `Added ${generatedPlan.length} new items to your existing content calendar.`,
      });
      navigate('/');
    } else {
      toast({
        title: "Error updating plan",
        description: "There was a problem updating your content plan. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleModifyWithAI = async () => {
    if (!aiPrompt || !generatedPlan) return;

    setIsModifying(true);
    try {
      const prompt = `Given this content plan: \n${JSON.stringify(generatedPlan, null, 2)}\n\nModify it according to this request: ${aiPrompt}\n\nReturn ONLY the modified JSON array of content items with the same structure.`;
      const generatedContent = await generateContentWithOpenAI(prompt);

      try {
        // Extract the content which contains our JSON
        const jsonContent = generatedContent.content;
        const modifiedPlan = JSON.parse(jsonContent);
        
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
      
      <div className="w-full mx-auto">
        <GenerateTabContent onGeneratePlan={handleGeneratePlan} />
      </div>

      {generatedPlan && (
        <div className="mt-8 space-y-6 animate-fade-in w-full mx-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Review Generated Plan</h2>
            <Button onClick={handleApproveAndSave}>
              <CalendarPlus className="mr-2 h-4 w-4" />
              Add to Calendar ({generatedPlan.length} items)
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

      <AlertDialog open={showReplaceDialog} onOpenChange={setShowReplaceDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Existing Content Plan Found</AlertDialogTitle>
            <AlertDialogDescription>
              You already have content items in your calendar. Would you like to replace them with this new plan or add these new items to your existing plan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={saveNewPlan} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Replace Existing
            </AlertDialogAction>
            <AlertDialogAction onClick={appendToPlan}>
              Add to Existing
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GeneratePlanPage;
