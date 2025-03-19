
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
  
  // Load content plan from Supabase or localStorage
  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      
      if (user && selectedWebsite) {
        // If user is logged in, load from Supabase
        try {
          console.log("Loading from Supabase for user:", user.id, "website:", selectedWebsite.id);
          const items = await loadContentPlanItems(user.id, selectedWebsite.id);
          console.log("Loaded from Supabase:", items.length, "items");
          setContentPlan(items);
        } catch (error) {
          console.error("Error loading from Supabase:", error);
          toast({
            title: "Error loading content",
            description: "Failed to load content from the database. Trying local storage as fallback.",
            variant: "destructive"
          });
          
          // Fall back to localStorage if Supabase fails
          const savedPlan = loadContentPlanFromStorage();
          if (savedPlan) {
            console.log("Fallback to localStorage - loaded:", savedPlan.length, "items");
            setContentPlan(savedPlan);
          }
        }
      } else {
        // If not logged in, use localStorage
        console.log("User not logged in, loading from localStorage");
        const savedPlan = loadContentPlanFromStorage();
        if (savedPlan && savedPlan.length > 0) {
          console.log("Loaded from localStorage:", savedPlan.length, "items");
          setContentPlan(savedPlan);
        } else {
          console.log("No saved plan found, generating initial plan");
          const initialPlan = generateInitialContentPlan();
          console.log("Generated initial plan with:", initialPlan.length, "items");
          setContentPlan(initialPlan);
          saveContentPlanToStorage(initialPlan);
        }
      }
      
      setIsLoading(false);
    };
    
    loadContent();
  }, [user, selectedWebsite, toast]);
  
  useEffect(() => {
    // Check for email reminders that need to be sent
    const settings = emailSettings.get();
    if (settings.email) {
      // Send initial check on load
      checkAndSendReminders(
        contentPlan, 
        settings.email, 
        settings.daysBeforeDue
      );
      
      // Clear any existing intervals (to prevent duplicates if component remounts)
      if (window.reminderCheckInterval) {
        clearInterval(window.reminderCheckInterval);
      }
      
      // Check for reminders every hour (in a real app, this would be server-side)
      window.reminderCheckInterval = setInterval(() => {
        checkAndSendReminders(contentPlan, settings.email, settings.daysBeforeDue);
      }, 60 * 60 * 1000); // Every hour
    }
    
    // Cleanup interval when component unmounts
    return () => {
      if (window.reminderCheckInterval) {
        clearInterval(window.reminderCheckInterval);
      }
    };
  }, [contentPlan]);
  
  // Save content plan to localStorage as fallback if not logged in
  useEffect(() => {
    if (contentPlan.length > 0 && !user) {
      console.log("Saving to localStorage:", contentPlan.length, "items");
      saveContentPlanToStorage(contentPlan);
    }
  }, [contentPlan, user]);
  
  const handleUpdateItem = async (updatedItem: ContentPlanItem) => {
    if (user && selectedWebsite) {
      // Update in Supabase
      const success = await updateContentPlanItem(updatedItem, user.id, selectedWebsite.id);
      
      if (success) {
        // Update local state
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
      // Fallback to local update only
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
      // Delete from Supabase
      const success = await deleteContentPlanItem(itemId);
      
      if (success) {
        // Update local state
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
      // Fallback to local delete only
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
        // Save to Supabase
        const addedItem = await addContentPlanItem(newItem, user.id, selectedWebsite.id);
        
        if (addedItem) {
          // Create a new array with the added item to avoid reference issues
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
        // Fallback to local save only
        // Create a new array with the new item to avoid reference issues
        const updatedPlan = [...contentPlan, newItem];
        setContentPlan(updatedPlan);
        
        // Save to localStorage immediately to ensure it's persisted
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

// For TypeScript
declare global {
  interface Window {
    reminderCheckInterval: any;
    weeklySummaryInterval: any;
  }
}

export default CalendarPage;
