import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import CalendarTabContent from './CalendarTabContent';
import ContentDialogs from './ContentDialogs';
import { 
  ContentPlanItem, 
  generateInitialContentPlan, 
  generateContentPlanFromKeywords, 
  getStartDate
} from '@/utils/calendarUtils';
import { emailSettings } from '@/utils/contentUtils';
import { 
  loadContentPlanFromStorage,
  saveContentPlanToStorage
} from '@/utils/contentPlanStorage';
import { 
  loadContentPlanItems,
  addContentPlanItem,
  updateContentPlanItem,
  deleteContentPlanItem
} from '@/utils/contentPlanItems';
import { checkAndSendReminders } from '@/utils/emailUtils';
import { Button } from "@/components/ui/button";
import { SettingsIcon, PlusIcon } from 'lucide-react';
import { useWebsite } from '@/contexts/WebsiteContext';
import { useAuth } from '@/contexts/AuthContext';

const CalendarPage: React.FC = () => {
  const { toast } = useToast();
  const { selectedWebsite } = useWebsite();
  const { user } = useAuth();
  const [contentPlan, setContentPlan] = useState<ContentPlanItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(getStartDate());
  const [showEmailSettings, setShowEmailSettings] = useState(false);
  const [showContentGenerator, setShowContentGenerator] = useState(false);
  const [editingContentItem, setEditingContentItem] = useState<ContentPlanItem | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      
      if (user && selectedWebsite) {
        try {
          console.log("Loading from Supabase for user:", user.id, "website:", selectedWebsite.id);
          const items = await loadContentPlanItems(user.id, selectedWebsite.id);
          console.log("Loaded from Supabase:", items.length, "items");
          
          if (items.length > 0) {
            console.log("Sample item loaded from Supabase:", items[0]);
            if (items.length > 1) {
              console.log("Second item loaded from Supabase:", items[1]);
            }
          }
          
          setContentPlan(items);
        } catch (error) {
          console.error("Error loading from Supabase:", error);
          toast({
            title: "Error loading content",
            description: "Failed to load content from the database. Trying local storage as fallback.",
            variant: "destructive"
          });
          
          const savedPlan = loadContentPlanFromStorage();
          if (savedPlan) {
            console.log("Fallback to localStorage - loaded:", savedPlan.length, "items");
            
            if (savedPlan.length > 0) {
              console.log("Sample item from localStorage:", savedPlan[0]);
              if (savedPlan.length > 1) {
                console.log("Second item from localStorage:", savedPlan[1]);
              }
            }
            
            setContentPlan(savedPlan);
          }
        }
      } else {
        console.log("User not logged in, loading from localStorage");
        const savedPlan = loadContentPlanFromStorage();
        
        if (savedPlan && savedPlan.length > 0) {
          console.log("Loaded from localStorage:", savedPlan.length, "items");
          console.log("Sample item from localStorage:", savedPlan[0]);
          if (savedPlan.length > 1) {
            console.log("Second item from localStorage:", savedPlan[1]);
          }
          
          setContentPlan(savedPlan);
        } else {
          console.log("No saved plan found, generating initial plan");
          const initialPlan = generateInitialContentPlan();
          console.log("Generated initial plan with:", initialPlan.length, "items");
          
          if (initialPlan.length > 0) {
            console.log("Sample item from initial plan:", initialPlan[0]);
            if (initialPlan.length > 1) {
              console.log("Second item from initial plan:", initialPlan[1]);
            }
          }
          
          setContentPlan(initialPlan);
          
          const saveResult = saveContentPlanToStorage(initialPlan);
          console.log("Initial plan save result:", saveResult);
        }
      }
      
      setIsLoading(false);
    };
    
    loadContent();
  }, [user, selectedWebsite, toast]);
  
  useEffect(() => {
    const settings = emailSettings.get();
    if (settings.email) {
      console.log("Running initial reminder check when content plan loaded/updated");
      checkAndSendReminders(
        contentPlan, 
        settings.email, 
        settings.daysBeforeDue
      );
    }
  }, [contentPlan]);
  
  useEffect(() => {
    if (contentPlan.length > 0 && !user) {
      console.log("Saving to localStorage:", contentPlan.length, "items");
      
      const planToSave = JSON.parse(JSON.stringify(contentPlan));
      
      if (planToSave.length > 0) {
        console.log("Sample item to save:", planToSave[0]);
        if (planToSave.length > 1) {
          console.log("Second item to save:", planToSave[1]);
        }
      }
      
      saveContentPlanToStorage(planToSave);
    }
  }, [contentPlan, user]);
  
  const handleUpdateItem = async (updatedItem: ContentPlanItem) => {
    if (user && selectedWebsite) {
      const success = await updateContentPlanItem(updatedItem, user.id, selectedWebsite.id);
      
      if (success) {
        const updatedPlan = contentPlan.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        );
        setContentPlan(updatedPlan);
        
        toast({
          description: `${updatedItem.title} ${updatedItem.completed ? 'marked as completed' : 'marked as pending'}`,
        });
      } else {
        toast({
          title: "Update failed",
          description: "Failed to update item. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      const updatedPlan = contentPlan.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      );
      setContentPlan(updatedPlan);
      
      toast({
        description: `${updatedItem.title} ${updatedItem.completed ? 'marked as completed' : 'marked as pending'}`,
      });
    }
  };
  
  const handleDeleteItem = async (itemId: string) => {
    const itemToDelete = contentPlan.find(item => item.id === itemId);
    
    if (!itemToDelete) return;
    
    if (user) {
      const success = await deleteContentPlanItem(itemId);
      
      if (success) {
        const updatedPlan = contentPlan.filter(item => item.id !== itemId);
        setContentPlan(updatedPlan);
        
        toast({
          description: `${itemToDelete.title || 'Item'} deleted from your content plan`,
        });
      } else {
        toast({
          title: "Delete failed",
          description: "Failed to delete item. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      const updatedPlan = contentPlan.filter(item => item.id !== itemId);
      setContentPlan(updatedPlan);
      
      toast({
        description: `${itemToDelete.title || 'Item'} deleted from your content plan`,
      });
    }
  };
  
  const handleEditContent = (item: ContentPlanItem) => {
    setEditingContentItem(item);
    setShowContentGenerator(true);
  };
  
  const handleSaveContent = async (title: string, content: string) => {
    if (editingContentItem) {
      const updatedItem = {
        ...editingContentItem,
        title,
        description: content.slice(0, 100) + (content.length > 100 ? '...' : '')
      };
      
      await handleUpdateItem(updatedItem);
    } else {
      const newItem: ContentPlanItem = {
        id: `new-${Date.now()}`,
        title,
        description: content.slice(0, 100) + (content.length > 100 ? '...' : ''),
        dueDate: selectedDate.toISOString(),
        completed: false,
        contentType: 'blog',
        contentStyle: 'knowledge',
        objective: 'Focus on how clean data improves prospecting.',
        keywords: ['content']
      };
      
      if (user && selectedWebsite) {
        const addedItem = await addContentPlanItem(newItem, user.id, selectedWebsite.id);
        
        if (addedItem) {
          const updatedPlan = [...contentPlan, addedItem];
          setContentPlan(updatedPlan);
          
          toast({
            title: "Content saved",
            description: "Your content has been saved to the plan",
          });
        } else {
          toast({
            title: "Save failed",
            description: "Failed to save content. Please try again.",
            variant: "destructive"
          });
        }
      } else {
        const updatedPlan = [...contentPlan, newItem];
        setContentPlan(updatedPlan);
        
        saveContentPlanToStorage(updatedPlan);
        
        toast({
          title: "Content saved",
          description: "Your content has been saved to the plan",
        });
      }
    }
    
    setShowContentGenerator(false);
    setEditingContentItem(undefined);
  };

  const handleNewContent = () => {
    setEditingContentItem(undefined);
    setShowContentGenerator(true);
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">Content Calendar</h1>
        <p className="text-muted-foreground">
          Plan, create, and schedule your content for {selectedWebsite.name}
        </p>
        {!user && (
          <div className="mt-2 p-2 bg-orange-100 text-orange-800 rounded-md text-sm">
            You're not signed in. Your content will be saved locally and won't be available on other devices.
          </div>
        )}
      </header>
      
      <div className="flex justify-end mb-6">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowEmailSettings(true)}>
            <SettingsIcon className="h-4 w-4 mr-2" />
            Email Settings
          </Button>
          <Button size="sm" onClick={handleNewContent}>
            <PlusIcon className="h-4 w-4 mr-2" />
            New Content
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <CalendarTabContent 
          contentPlan={contentPlan}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setContentPlan={setContentPlan}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
          onEditContent={handleEditContent}
        />
      )}
      
      <ContentDialogs 
        showEmailSettings={showEmailSettings}
        setShowEmailSettings={setShowEmailSettings}
        showContentGenerator={showContentGenerator}
        setShowContentGenerator={setShowContentGenerator}
        editingContentItem={editingContentItem}
        setEditingContentItem={setEditingContentItem}
        onSaveContent={handleSaveContent}
      />
    </div>
  );
};

declare global {
  interface Window {
    reminderCheckInterval: any;
    weeklySummaryInterval: any;
  }
}

export default CalendarPage;
