'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ClockWidget() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Current Time</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        {time ? (
          <div className="font-mono text-5xl font-bold text-primary">
            {time.toLocaleTimeString()}
          </div>
        ) : (
          <div className="font-mono text-5xl font-bold text-primary">
            Loading...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
