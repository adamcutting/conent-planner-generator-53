
import React, { useState } from 'react';
import { format, parseISO, isSameDay } from 'date-fns';
import { CheckCircle, Clock, Edit, CheckIcon, Trash2, TagIcon } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContentPlanItem } from '@/utils/calendarUtils';

interface ContentPlanProps {
  contentPlan: ContentPlanItem[];
  selectedDate: Date;
  onUpdateItem: (item: ContentPlanItem) => void;
  onDeleteItem: (itemId: string) => void;
  onEditContent: (item: ContentPlanItem) => void;
}

const ContentPlan: React.FC<ContentPlanProps> = ({ 
  contentPlan, 
  selectedDate, 
  onUpdateItem, 
  onDeleteItem,
  onEditContent
}) => {
  const itemsForDate = contentPlan.filter(item => 
    isSameDay(parseISO(item.dueDate), selectedDate)
  );

  // Get upcoming items (next 7 days) if no items for selected date
  const upcomingItems = contentPlan
    .filter(item => {
      const dueDate = parseISO(item.dueDate);
      return dueDate > selectedDate && dueDate <= new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    })
    .sort((a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime())
    .slice(0, 3);

  const handleToggleComplete = (item: ContentPlanItem) => {
    onUpdateItem({
      ...item,
      completed: !item.completed
    });
  };

  const getContentTypeColor = (type: string): string => {
    switch(type) {
      case 'blog': return 'bg-blue-100 text-blue-800';
      case 'social': return 'bg-green-100 text-green-800';
      case 'video': return 'bg-purple-100 text-purple-800';
      case 'email': return 'bg-orange-100 text-orange-800';
      case 'infographic': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="content-card">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
          Content for {format(selectedDate, 'MMMM d, yyyy')}
        </h2>
        
        {itemsForDate.length > 0 ? (
          <div className="space-y-4">
            {itemsForDate.map(item => (
              <div key={item.id} className={`
                p-4 rounded-lg border transition-all duration-250
                ${item.completed ? 'bg-muted/50 border-muted' : 'bg-card border-border'}
              `}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className={`font-medium text-base ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </div>
                  <div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleToggleComplete(item)}
                    >
                      {item.completed ? 
                        <CheckCircle className="h-5 w-5 text-green-600" /> : 
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      }
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="outline"
                      className={`text-xs ${getContentTypeColor(item.contentType)}`}
                    >
                      {item.contentType}
                    </Badge>
                    
                    {item.keywords.slice(0, 2).map((keyword, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline" 
                        className="bg-slate-100 text-slate-800 text-xs flex items-center"
                      >
                        <TagIcon className="h-3 w-3 mr-1" />
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEditContent(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onDeleteItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">No content planned for this date</p>
            <p className="text-sm text-muted-foreground mt-1">Select another date or add new content</p>
          </div>
        )}
      </div>
      
      {itemsForDate.length === 0 && upcomingItems.length > 0 && (
        <div className="content-card mt-6">
          <h3 className="text-md font-medium mb-4">Upcoming content</h3>
          <div className="space-y-2">
            {upcomingItems.map(item => (
              <div key={item.id} className="p-3 rounded-lg border bg-card/50 border-border hover:shadow-sm transition-all duration-250">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      Due: {format(parseISO(item.dueDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Badge 
                    variant="outline"
                    className={`text-xs ${getContentTypeColor(item.contentType)}`}
                  >
                    {item.contentType}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentPlan;
