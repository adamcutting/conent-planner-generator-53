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
import { saveContentPlan, loadContentPlan } from '@/utils/contentUtils';
import { Button } from "@/components/ui/button";
import { SettingsIcon, PlusIcon } from 'lucide-react';
import { useWebsite } from '@/contexts/WebsiteContext';

const CalendarPage: React.FC = () => {
  const { toast } = useToast();
  const { selectedWebsite } = useWebsite();
  const [contentPlan, setContentPlan] = useState<ContentPlanItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(getStartDate());
  const [showEmailSettings, setShowEmailSettings] = useState(false);
  const [showContentGenerator, setShowContentGenerator] = useState(false);
  const [editingContentItem, setEditingContentItem] = useState<ContentPlanItem | undefined>(undefined);
  
  useEffect(() => {
    const savedPlan = loadContentPlan();
    if (savedPlan) {
      setContentPlan(savedPlan);
    } else {
      const initialPlan = generateInitialContentPlan();
      setContentPlan(initialPlan);
      saveContentPlan(initialPlan);
    }
  }, []);
  
  useEffect(() => {
    if (contentPlan.length > 0) {
      saveContentPlan(contentPlan);
    }
  }, [contentPlan]);
  
  const handleUpdateItem = (updatedItem: ContentPlanItem) => {
    const updatedPlan = contentPlan.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    setContentPlan(updatedPlan);
    
    toast({
      description: `${updatedItem.title} ${updatedItem.completed ? 'marked as completed' : 'marked as pending'}`,
    });
  };
  
  const handleDeleteItem = (itemId: string) => {
    const itemToDelete = contentPlan.find(item => item.id === itemId);
    const updatedPlan = contentPlan.filter(item => item.id !== itemId);
    setContentPlan(updatedPlan);
    
    toast({
      description: `${itemToDelete?.title || 'Item'} deleted from your content plan`,
    });
  };
  
  const handleEditContent = (item: ContentPlanItem) => {
    setEditingContentItem(item);
    setShowContentGenerator(true);
  };
  
  const handleSaveContent = (title: string, content: string) => {
    if (editingContentItem) {
      const updatedItem = {
        ...editingContentItem,
        title,
        description: content.slice(0, 100) + (content.length > 100 ? '...' : '')
      };
      
      handleUpdateItem(updatedItem);
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
      
      setContentPlan([...contentPlan, newItem]);
    }
    
    setShowContentGenerator(false);
    setEditingContentItem(undefined);
    
    toast({
      title: "Content saved",
      description: "Your content has been saved to the plan",
    });
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
      
      <CalendarTabContent 
        contentPlan={contentPlan}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setContentPlan={setContentPlan}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
        onEditContent={handleEditContent}
      />
      
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

export default CalendarPage;
