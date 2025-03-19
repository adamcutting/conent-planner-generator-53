
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusIcon } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import CalendarView from '@/components/CalendarView';
import ContentPlan from '@/components/ContentPlan';
import { ContentPlanItem } from '@/utils/calendarUtils';
import { addContentPlanItem } from '@/utils/contentPlanItems';
import { useAuth } from '@/contexts/AuthContext';
import { useWebsite } from '@/contexts/WebsiteContext';

interface CalendarTabContentProps {
  contentPlan: ContentPlanItem[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  setContentPlan: React.Dispatch<React.SetStateAction<ContentPlanItem[]>>;
  onUpdateItem: (updatedItem: ContentPlanItem) => void;
  onDeleteItem: (itemId: string) => void;
  onEditContent: (item: ContentPlanItem) => void;
}

const CalendarTabContent: React.FC<CalendarTabContentProps> = ({
  contentPlan,
  selectedDate,
  setSelectedDate,
  setContentPlan,
  onUpdateItem,
  onDeleteItem,
  onEditContent,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { selectedWebsite } = useWebsite();

  const handleAddItem = async () => {
    const newItem: ContentPlanItem = {
      id: `new-${Date.now()}`,
      title: `New Content Item`,
      description: `Add description`,
      objective: 'Engage with target audience',
      dueDate: selectedDate.toISOString(), // Always use ISO string for consistency
      completed: false,
      contentType: 'blog',
      contentStyle: 'knowledge',
      keywords: ['content']
    };
    
    if (user && selectedWebsite) {
      // Save to Supabase
      const addedItem = await addContentPlanItem(newItem, user.id, selectedWebsite.id);
      
      if (addedItem) {
        // Update state with the returned item from the database
        setContentPlan(prevPlan => [...prevPlan, addedItem]);
        
        toast({
          description: "New content item added to your plan",
        });
      } else {
        toast({
          title: "Add failed",
          description: "Failed to add item. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      // Fallback to local save only
      setContentPlan(prevPlan => [...prevPlan, newItem]);
      
      toast({
        description: "New content item added to your plan",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 h-full">
      <div className="lg:col-span-4 flex flex-col h-[calc(100vh-220px)]">
        <CalendarView 
          contentPlan={contentPlan}
          onSelectDate={setSelectedDate}
          selectedDate={selectedDate}
        />
        
        <div className="mt-6">
          <Button 
            variant="outline" 
            onClick={handleAddItem}
            className="w-full flex items-center justify-center"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Item to {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Button>
        </div>
      </div>
      
      <div className="lg:col-span-3 max-h-[calc(100vh-220px)] overflow-y-auto">
        <ContentPlan 
          contentPlan={contentPlan}
          selectedDate={selectedDate}
          onUpdateItem={onUpdateItem}
          onDeleteItem={onDeleteItem}
          onEditContent={onEditContent}
        />
      </div>
    </div>
  );
};

export default CalendarTabContent;
