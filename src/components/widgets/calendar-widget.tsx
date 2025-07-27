
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { format, isSameDay, startOfDay } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '../ui/scroll-area';

type Reminder = {
  id: number;
  date: string;
  text: string;
};

export function CalendarWidget() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isClient, setIsClient] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reminderText, setReminderText] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const storedReminders = localStorage.getItem('reminders');
    const parsedReminders = storedReminders ? JSON.parse(storedReminders) : [];
    setReminders(parsedReminders);
    
    const today = startOfDay(new Date());
    const todaysReminders = parsedReminders.filter((r: Reminder) => isSameDay(new Date(r.date), today));
    
    if (todaysReminders.length > 0) {
      toast({
        title: "Today's Reminders",
        description: todaysReminders.map((r: Reminder) => r.text).join(', '),
      });
    }
  }, [toast]);

  const handleDateSelect = (selectedDay: Date | undefined) => {
    if (!selectedDay) return;
    setDate(selectedDay);
    setSelectedDate(selectedDay);
    
    const todaysReminders = reminders.filter(r => isSameDay(new Date(r.date), selectedDay));
    if (todaysReminders.length === 0) {
      setIsDialogOpen(true);
    }
  };
  
  const handleSaveReminder = () => {
    if (!reminderText || !selectedDate) return;
    const newReminder: Reminder = {
      id: Date.now(),
      date: startOfDay(selectedDate).toISOString(),
      text: reminderText,
    };
    const updatedReminders = [...reminders, newReminder];
    setReminders(updatedReminders);
    localStorage.setItem('reminders', JSON.stringify(updatedReminders));
    setReminderText('');
    setIsDialogOpen(false);
    toast({
      title: 'Reminder Set!',
      description: `On ${format(selectedDate, 'PPP')}: ${reminderText}`,
    });
  };
  
  const handleDeleteReminder = (id: number) => {
    const updatedReminders = reminders.filter(r => r.id !== id);
    setReminders(updatedReminders);
    localStorage.setItem('reminders', JSON.stringify(updatedReminders));
     toast({
      title: 'Reminder Removed',
      variant: 'destructive'
    });
  };

  const selectedDayReminders = selectedDate ? reminders.filter(r => isSameDay(new Date(r.date), selectedDate)) : [];

  return (
    <>
      <Card className="flex flex-col animate-in fade-in-0 slide-in-from-top-4 duration-500 ease-in-out">
        <CardContent className="p-0 flex items-center justify-center flex-grow">
          {isClient ? (
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="p-0"
              classNames={{
                root: 'w-full h-full flex flex-col justify-center',
                months: 'w-full',
                month: 'w-full space-y-2',
                table: 'w-full',
                head_row: 'flex justify-around',
                row: 'flex w-full justify-around mt-1',
              }}
              components={{
                DayContent: ({ date }) => {
                  const hasReminder = reminders.some(r => isSameDay(new Date(r.date), date));
                  return (
                    <div className="relative">
                      {date.getDate()}
                      {hasReminder && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </div>
                  );
                }
              }}
            />
          ) : (
            <div className="p-4 w-full">
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-6 w-24" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-around">
                  {[...Array(7)].map((_, i) => <Skeleton key={i} className="h-5 w-8" />)}
                </div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-around">
                        {[...Array(7)].map((_, j) => <Skeleton key={j} className="h-9 w-9 rounded-full" />)}
                    </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
         {isClient && selectedDayReminders.length > 0 && (
          <CardHeader>
            <CardTitle className="text-base">Reminders for {selectedDate && format(selectedDate, 'PPP')}</CardTitle>
            <ScrollArea className="h-24 pr-4">
                <ul className="space-y-2 mt-2">
                {selectedDayReminders.map(reminder => (
                    <li key={reminder.id} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded-md">
                    <span>{reminder.text}</span>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteReminder(reminder.id)}>Delete</Button>
                    </li>
                ))}
                </ul>
            </ScrollArea>
             <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)} className="mt-2">
              Add another reminder
            </Button>
          </CardHeader>
        )}
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Reminder</DialogTitle>
             <DialogDescription>
              Set a reminder for {selectedDate && format(selectedDate, 'PPP')}.
            </DialogDescription>
          </DialogHeader>
          <Input 
            value={reminderText}
            onChange={(e) => setReminderText(e.target.value)}
            placeholder="e.g., Doctor's appointment"
          />
          <DialogFooter>
             <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveReminder}>Save Reminder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
