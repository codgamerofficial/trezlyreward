'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function MapWidget() {
  return (
    <Card className="col-span-1 md:col-span-2 animate-in fade-in-0 slide-in-from-top-4 duration-500 ease-in-out">
      <CardHeader>
        <CardTitle>Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video w-full">
          <Image
            src="https://placehold.co/800x450.png"
            alt="Map"
            fill
            className="object-cover rounded-md"
            data-ai-hint="world map"
          />
        </div>
      </CardContent>
    </Card>
  );
}
