'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function CalendarWidget() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setDate(new Date());
  }, []);

  return (
    <Card className="col-span-1 md:col-span-2 row-span-1 md:row-span-2 flex flex-col animate-in fade-in-0 slide-in-from-top-4 duration-500 ease-in-out">
      <CardContent className="p-0 flex items-center justify-center flex-grow">
        {isClient ? (
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="p-0"
            classNames={{
              root: 'w-full h-full flex flex-col justify-center',
              months: 'w-full',
              month: 'w-full space-y-2',
              table: 'w-full',
              head_row: 'flex justify-around',
              row: 'flex w-full justify-around mt-1',
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
                <Skeleton className="h-5 w-8" />
                <Skeleton className="h-5 w-8" />
                <Skeleton className="h-5 w-8" />
                <Skeleton className="h-5 w-8" />
                <Skeleton className="h-5 w-8" />
                <Skeleton className="h-5 w-8" />
                <Skeleton className="h-5 w-8" />
              </div>
              <div className="flex justify-around">
                 <Skeleton className="h-9 w-9 rounded-full" />
                 <Skeleton className="h-9 w-9 rounded-full" />
                 <Skeleton className="h-9 w-9 rounded-full" />
                 <Skeleton className="h-9 w-9 rounded-full" />
                 <Skeleton className="h-9 w-9 rounded-full" />
                 <Skeleton className="h-9 w-9 rounded-full" />
                 <Skeleton className="h-9 w-9 rounded-full" />
              </div>
               <div className="flex justify-around">
                 <Skeleton className="h-9 w-9 rounded-full" />
                 <Skeleton className="h-9 w-9 rounded-full" />
                 <Skeleton className="h-9 w-9 rounded-full" />
                 <Skeleton className="h-9 w-9 rounded-full" />
                 <Skeleton className="h-9 w-9 rounded-full" />
                 <Skeleton className="h-9 w-9 rounded-full" />
                 <Skeleton className="h-9 w-9 rounded-full" />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
