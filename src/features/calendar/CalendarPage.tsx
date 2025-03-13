
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import CalendarHeader from './CalendarHeader';
import CalendarTabContent from './CalendarTabContent';
import GenerateTabContent from './GenerateTabContent';
import ContentDialogs from './ContentDialogs';
import { 
  ContentPlanItem, 
  generateInitialContentPlan, 
  generateContentPlanFromKeywords, 
  getStartDate
} from '@/utils/calendarUtils';
import { saveContentPlan, loadContentPlan } from '@/utils/contentUtils';

const CalendarPage: React.FC = () => {
  const { toast } = useToast();
  const [contentPlan, setContentPlan] = useState<ContentPlanItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(getStartDate());
  const [activeTab, setActiveTab] = useState<string>('calendar');
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
  
  const handleGeneratePlan = (keywords: string[]) => {
    const startDate = new Date();
    
    const newPlan = generateContentPlanFromKeywords(keywords, startDate);
    setContentPlan(newPlan);
    
    toast({
      title: "Content plan generated",
      description: `Created a new 90-day content plan with ${newPlan.length} items`,
    });
    
    setActiveTab('calendar');
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

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">Content Calendar</h1>
        <p className="text-muted-foreground">
          Plan, create, and schedule your content for www.datahq.co.uk
        </p>
      </header>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <CalendarHeader 
          activeTab={activeTab}
          setShowEmailSettings={setShowEmailSettings}
          setEditingContentItem={setEditingContentItem}
          setShowContentGenerator={setShowContentGenerator}
        />
        
        <TabsContent value="calendar">
          <CalendarTabContent 
            contentPlan={contentPlan}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            setContentPlan={setContentPlan}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            onEditContent={handleEditContent}
          />
        </TabsContent>
        
        <TabsContent value="generate">
          <GenerateTabContent onGeneratePlan={handleGeneratePlan} />
        </TabsContent>
      </Tabs>
      
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
