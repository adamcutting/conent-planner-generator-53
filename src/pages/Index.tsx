
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  CalendarIcon, 
  BellIcon, 
  SparkleFill, 
  PencilIcon, 
  PlusCircle,
  Settings,
  PlusIcon
} from 'lucide-react';
import CalendarView from '@/components/CalendarView';
import ContentPlan from '@/components/ContentPlan';
import KeywordForm from '@/components/KeywordForm';
import ContentGenerator from '@/components/ContentGenerator';
import EmailSettings from '@/components/EmailSettings';
import { 
  ContentPlanItem, 
  generateInitialContentPlan, 
  generateContentPlanFromKeywords, 
  getStartDate
} from '@/utils/calendarUtils';
import { saveContentPlan, loadContentPlan } from '@/utils/contentUtils';

const Index = () => {
  const { toast } = useToast();
  const [contentPlan, setContentPlan] = useState<ContentPlanItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(getStartDate());
  const [activeTab, setActiveTab] = useState<string>('calendar');
  const [showEmailSettings, setShowEmailSettings] = useState(false);
  const [showContentGenerator, setShowContentGenerator] = useState(false);
  const [editingContentItem, setEditingContentItem] = useState<ContentPlanItem | undefined>(undefined);
  
  // Initialize content plan
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
  
  // Save content plan whenever it changes
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
    // Get the current start date (for content continuity)
    const startDate = new Date();
    
    const newPlan = generateContentPlanFromKeywords(keywords, startDate);
    setContentPlan(newPlan);
    
    toast({
      title: "Content plan generated",
      description: `Created a new 90-day content plan with ${newPlan.length} items`,
    });
    
    // Switch to calendar view
    setActiveTab('calendar');
  };
  
  const handleEditContent = (item: ContentPlanItem) => {
    setEditingContentItem(item);
    setShowContentGenerator(true);
  };
  
  const handleSaveContent = (title: string, content: string) => {
    if (editingContentItem) {
      // Update existing item
      const updatedItem = {
        ...editingContentItem,
        title,
        description: content.slice(0, 100) + (content.length > 100 ? '...' : '')
      };
      
      handleUpdateItem(updatedItem);
    } else {
      // Create new content item
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
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="calendar" className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="generate" className="flex items-center">
              <SparkleFill className="mr-2 h-4 w-4" />
              Generate Plan
            </TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowEmailSettings(true)}
              className="flex items-center"
            >
              <BellIcon className="mr-2 h-4 w-4" />
              Alerts
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setEditingContentItem(undefined);
                setShowContentGenerator(true);
              }}
              className="flex items-center"
            >
              <PencilIcon className="mr-2 h-4 w-4" />
              Create Content
            </Button>
          </div>
        </div>
        
        <TabsContent value="calendar" className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CalendarView 
              contentPlan={contentPlan}
              onSelectDate={setSelectedDate}
              selectedDate={selectedDate}
            />
            
            <div className="mt-6 flex justify-center">
              <Button 
                variant="outline" 
                onClick={() => {
                  const newItem: ContentPlanItem = {
                    id: `new-${Date.now()}`,
                    title: `New Content Item`,
                    description: `Add description`,
                    dueDate: selectedDate.toISOString(),
                    completed: false,
                    contentType: 'blog',
                    keywords: ['content']
                  };
                  
                  setContentPlan([...contentPlan, newItem]);
                  
                  toast({
                    description: "New content item added to your plan",
                  });
                }}
                className="w-full flex items-center"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Item to {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Button>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <ContentPlan 
              contentPlan={contentPlan}
              selectedDate={selectedDate}
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
              onEditContent={handleEditContent}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="generate">
          <div className="max-w-xl mx-auto">
            <KeywordForm onGeneratePlan={handleGeneratePlan} />
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Email Settings Dialog */}
      <Dialog open={showEmailSettings} onOpenChange={setShowEmailSettings}>
        <DialogContent className="sm:max-w-md">
          <EmailSettings onClose={() => setShowEmailSettings(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Content Generator Dialog */}
      <Dialog open={showContentGenerator} onOpenChange={setShowContentGenerator}>
        <DialogContent className="sm:max-w-[800px] p-0">
          <ContentGenerator 
            contentItem={editingContentItem}
            onSave={handleSaveContent}
            onClose={() => {
              setShowContentGenerator(false);
              setEditingContentItem(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
