
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusIcon } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import CalendarView from '@/components/CalendarView';
import ContentPlan from '@/components/ContentPlan';
import { ContentPlanItem } from '@/utils/calendarUtils';

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

  const handleAddItem = () => {
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
  };

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-7 gap-6">
      <div className="lg:col-span-4 h-[calc(100vh-250px)]">
        <CalendarView 
          contentPlan={contentPlan}
          onSelectDate={setSelectedDate}
          selectedDate={selectedDate}
        />
        
        <div className="mt-6 flex justify-center">
          <Button 
            variant="outline" 
            onClick={handleAddItem}
            className="w-full flex items-center"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Item to {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Button>
        </div>
      </div>
      
      <div className="lg:col-span-3 max-h-[calc(100vh-250px)] overflow-y-auto">
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
