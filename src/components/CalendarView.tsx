
import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, isSameMonth, isToday, parseISO, isSameDay } from 'date-fns';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ContentPlanItem, generateCalendarDays, formatDate, isWorkingDay } from '@/utils/calendarUtils';

interface CalendarViewProps {
  contentPlan: ContentPlanItem[];
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
}

const CalendarView: React.FC<CalendarViewProps> = ({ contentPlan, onSelectDate, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate);
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  
  useEffect(() => {
    setCalendarDays(generateCalendarDays(currentMonth, 'month'));
  }, [currentMonth]);
  
  const nextMonth = () => {
    const nextM = addMonths(currentMonth, 1);
    setCurrentMonth(nextM);
  };
  
  const prevMonth = () => {
    const prevM = subMonths(currentMonth, 1);
    setCurrentMonth(prevM);
  };
  
  const handleDayClick = (day: Date) => {
    onSelectDate(day);
  };
  
  // Function to check if a date has content items
  const hasContentItems = (date: Date): number => {
    return contentPlan.filter(item => isSameDay(parseISO(item.dueDate), date)).length;
  };

  return (
    <div className="glass-panel rounded-xl p-4 animate-fade-in h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center text-datahq-charcoal">
          <CalendarIcon className="mr-2 h-5 w-5 text-datahq-blue" />
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8 rounded-full">
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8 rounded-full">
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, i) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = isSameDay(day, selectedDate);
          const contentCount = hasContentItems(day);
          const isWeekend = !isWorkingDay(day);
          
          return (
            <div
              key={i}
              onClick={() => handleDayClick(day)}
              className={`
                h-24 p-1 rounded-md transition-all duration-250 cursor-pointer relative
                ${isCurrentMonth ? '' : 'text-muted-foreground/30'}
                ${isSelected ? 'bg-primary/10 shadow-sm' : 'hover:bg-secondary'}
                ${isToday(day) ? 'border border-primary/50' : ''}
                ${isWeekend ? 'bg-gray-100' : ''}
              `}
            >
              <div className={`text-xs font-medium text-right p-1 ${isWeekend ? 'text-muted-foreground/50' : ''}`}>
                {format(day, 'd')}
              </div>
              
              {contentCount > 0 && (
                <div className="absolute bottom-1 left-1 right-1 flex justify-center">
                  <div className={`
                    text-xs px-2 py-0.5 rounded-full
                    ${isSelected ? 'bg-datahq-blue text-white' : 'bg-muted text-foreground'}
                  `}>
                    {contentCount} item{contentCount !== 1 ? 's' : ''}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
