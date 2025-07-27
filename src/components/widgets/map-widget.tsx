'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function MapWidget() {
  return (
    <Card className="col-span-1 md:col-span-2 animate-in fade-in-0 slide-in-from-top-4 duration-500 ease-in-out">
      <CardHeader>
        <CardTitle>World Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-171.2109375,-40.3130433,178.59375,69.0990393&layer=mapnik"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </CardContent>
    </Card>
  );
}
