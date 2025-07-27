'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useState, useEffect } from 'react';

export function CalendarWidget() {
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    setDate(new Date());
  }, []);

  return (
    <Card className="col-span-1 md:col-span-2 row-span-1 md:row-span-2 flex flex-col">
      <CardContent className="p-0 flex items-center justify-center flex-grow">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="p-0"
          classNames={{
            root: 'w-full h-full flex flex-col justify-center',
            months: "w-full",
            month: "w-full space-y-2",
            table: "w-full",
            head_row: "flex justify-around",
            row: "flex w-full justify-around mt-1",
          }}
        />
      </CardContent>
    </Card>
  );
}
