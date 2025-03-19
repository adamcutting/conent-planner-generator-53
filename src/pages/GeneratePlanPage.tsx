import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import GenerateTabContent from '@/features/calendar/GenerateTabContent';
import { generateContentPlanFromKeywords, getStartDate } from '@/utils/calendarUtils';
import { saveContentPlanToStorage, loadContentPlanFromStorage, clearContentPlanStorage } from '@/utils/contentPlanStorage';
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
import { useAuth } from '@/contexts/AuthContext';
import { addMultipleContentPlanItems } from '@/utils/contentPlanItems';
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
  const { user } = useAuth();
  const [openAIConfigured] = React.useState<boolean>(isApiKeySet());
  const [generatedPlan, setGeneratedPlan] = useState<ContentPlanItem[] | null>(null);
  const [isModifying, setIsModifying] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showReplaceDialog, setShowReplaceDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
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
    const existingPlan = loadContentPlanFromStorage();
    if (existingPlan && existingPlan.length > 0) {
      console.log("Found existing plan with items:", existingPlan.length);
      setShowReplaceDialog(true);
    } else {
      // No existing plan, just save
      console.log("No existing plan found, saving new plan");
      saveNewPlan();
    }
  };

  const saveNewPlan = async () => {
    if (!generatedPlan || generatedPlan.length === 0) return;
    
    console.log("Saving new plan with items:", generatedPlan.length);
    setIsSaving(true);
    
    try {
      // Ensure we're working with a fresh copy
      const planToSave = JSON.parse(JSON.stringify(generatedPlan));
      console.log("Created deep copy with items:", planToSave.length);
      
      // Additional validation before saving
      if (!Array.isArray(planToSave) || planToSave.length === 0) {
        console.error("Invalid plan to save - not an array or empty:", planToSave);
        toast({
          title: "Error saving plan",
          description: "The generated plan appears to be invalid. Please try again.",
          variant: "destructive"
        });
        setIsSaving(false);
        return;
      }

      // Log a sample item from the plan
      console.log("Sample item to save:", JSON.stringify(planToSave[0]));
      if (planToSave.length > 1) {
        console.log("Second item to save:", JSON.stringify(planToSave[1]));
      }
      
      let saveSuccess = false;
      
      // If user is logged in, save to Supabase
      if (user && selectedWebsite) {
        console.log("User is logged in, saving to Supabase");
        saveSuccess = await addMultipleContentPlanItems(
          planToSave, 
          user.id, 
          selectedWebsite.id
        );
        
        console.log("Supabase save result:", saveSuccess);
      } else {
        // Otherwise use local storage
        console.log("User not logged in, saving to localStorage");
        saveSuccess = saveContentPlanToStorage(planToSave);
        console.log("LocalStorage save result:", saveSuccess);
      }
      
      if (saveSuccess) {
        toast({
          title: `Content plan added to calendar`,
          description: `Added ${planToSave.length} items to your content calendar.`,
        });
        
        // Navigate after a small delay to ensure storage has time to sync
        setTimeout(() => {
          navigate('/');
        }, 500);
      } else {
        toast({
          title: "Error saving plan",
          description: "There was a problem saving your content plan. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error in saveNewPlan:", error);
      toast({
        title: "Error saving plan",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const appendToPlan = async () => {
    if (!generatedPlan || generatedPlan.length === 0) return;
    
    setIsSaving(true);
    try {
      // Create fresh copies to avoid reference issues
      const generatedPlanCopy = JSON.parse(JSON.stringify(generatedPlan));
      
      if (user && selectedWebsite) {
        // If logged in, append directly to Supabase
        console.log("User logged in, appending to Supabase");
        const success = await addMultipleContentPlanItems(
          generatedPlanCopy,
          user.id,
          selectedWebsite.id
        );
        
        if (success) {
          toast({
            title: `Content plan updated`,
            description: `Added ${generatedPlanCopy.length} new items to your content calendar.`,
          });
          
          setTimeout(() => {
            navigate('/');
          }, 500);
        } else {
          toast({
            title: "Error updating plan",
            description: "Failed to add items to your content plan. Please try again.",
            variant: "destructive"
          });
        }
      } else {
        // If not logged in, use localStorage
        const existingPlan = loadContentPlanFromStorage() || [];
        console.log("User not logged in, appending to localStorage");
        console.log("Existing items:", existingPlan.length, "New items:", generatedPlanCopy.length);
        
        const existingPlanCopy = JSON.parse(JSON.stringify(existingPlan));
        
        // Combine the plans
        const combinedPlan = [...existingPlanCopy, ...generatedPlanCopy];
        console.log("Combined plan total items:", combinedPlan.length);
        
        const saveResult = saveContentPlanToStorage(combinedPlan);
        
        if (saveResult) {
          toast({
            title: `Content plan updated`,
            description: `Added ${generatedPlanCopy.length} new items to your existing content calendar.`,
          });
          
          setTimeout(() => {
            navigate('/');
          }, 500);
        } else {
          toast({
            title: "Error updating plan",
            description: "There was a problem updating your content plan. Please try again.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Error in appendToPlan:", error);
      toast({
        title: "Error updating plan",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
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
            <Button 
              onClick={handleApproveAndSave} 
              disabled={isSaving}
              className="relative"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CalendarPlus className="mr-2 h-4 w-4" />
              )}
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
                    key={item.id || index} 
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{item.title}</h3>
                        <Badge variant="outline">{item.contentType}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {item.keywords && item.keywords.map((keyword, idx) => (
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
