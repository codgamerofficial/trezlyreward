'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


export function MapWidget() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mapUrl, setMapUrl] = useState('https://www.openstreetmap.org/export/embed.html?bbox=-171.2109375,-40.3130433,178.59375,69.0990393&layer=mapnik');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery) return;
    setIsLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, boundingbox } = data[0];
        const [minLat, maxLat, minLon, maxLon] = boundingbox;
        // A smaller bounding box for a better zoom level
        const zoomFactor = 0.1;
        const newBbox = [
            parseFloat(lon) - zoomFactor,
            parseFloat(lat) - zoomFactor,
            parseFloat(lon) + zoomFactor,
            parseFloat(lat) + zoomFactor,
        ].join(',');

        setMapUrl(`https://www.openstreetmap.org/export/embed.html?bbox=${newBbox}&layer=mapnik&marker=${lat},${lon}`);
      } else {
        toast({
          title: 'Location not found',
          description: 'Please try a different search term.',
          variant: 'destructive',
        });
      }
    } catch (error) {
       toast({
        title: 'Error searching location',
        description: 'Could not connect to the geocoding service.',
        variant: 'destructive',
      });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3 animate-in fade-in-0 slide-in-from-top-4 duration-500 ease-in-out">
      <CardHeader>
        <CardTitle>World Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
            <div className="flex w-full max-w-sm items-center space-x-2">
                <Input 
                    type="text" 
                    placeholder="Search for a location..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    disabled={isLoading}
                />
                <Button type="submit" onClick={handleSearch} disabled={isLoading}>
                    <Search className="h-4 w-4" />
                </Button>
            </div>
            <div className="relative aspect-video w-full overflow-hidden rounded-md">
            <iframe
                key={mapUrl}
                className="absolute top-0 left-0 w-full h-full"
                src={mapUrl}
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
