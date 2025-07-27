'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Cloud, CloudRain, CloudSnow } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const cities = [
  { name: 'Mumbai', temp: '31°C', condition: 'Sunny', icon: <Sun className="w-16 h-16 text-yellow-400" /> },
  { name: 'Delhi', temp: '34°C', condition: 'Hazy', icon: <Sun className="w-16 h-16 text-orange-400" /> },
  { name: 'Bangalore', temp: '25°C', condition: 'Cloudy', icon: <Cloud className="w-16 h-16 text-gray-400" /> },
  { name: 'Chennai', temp: '32°C', condition: 'Rainy', icon: <CloudRain className="w-16 h-16 text-blue-400" /> },
  { name: 'Kolkata', temp: '30°C', condition: 'Cloudy', icon: <Cloud className="w-16 h-16 text-gray-400" /> },
  { name: 'Shimla', temp: '15°C', condition: 'Snowy', icon: <CloudSnow className="w-16 h-16 text-white" /> },
];

export function WeatherWidget() {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Weather</CardTitle>
        <Select defaultValue="Mumbai">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select City" />
          </SelectTrigger>
          <SelectContent>
            {cities.map(city => (
              <SelectItem key={city.name} value={city.name}>{city.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center">
        <div className="mb-4">
            {cities[0].icon}
        </div>
        <p className="text-5xl font-bold">{cities[0].temp}</p>
        <p className="text-muted-foreground">{cities[0].condition}</p>
      </CardContent>
    </Card>
  );
}
