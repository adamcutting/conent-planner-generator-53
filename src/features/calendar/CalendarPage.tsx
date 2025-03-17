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
import { saveContentPlan, loadContentPlan, emailSettings } from '@/utils/contentUtils';
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
        const items = await loadContentPlanItems(user.id, selectedWebsite.id);
        setContentPlan(items);
      } else {
        // If not logged in, fall back to localStorage
        const savedPlan = loadContentPlan();
        if (savedPlan) {
          setContentPlan(savedPlan);
        } else {
          const initialPlan = generateInitialContentPlan();
          setContentPlan(initialPlan);
          saveContentPlan(initialPlan);
        }
      }
      
      setIsLoading(false);
    };
    
    loadContent();
  }, [user, selectedWebsite]);
  
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
      saveContentPlan(contentPlan);
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
          setContentPlan([...contentPlan, addedItem]);
          
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
        setContentPlan([...contentPlan, newItem]);
        
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
