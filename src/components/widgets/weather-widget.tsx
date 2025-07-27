'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Cloud, CloudRain, CloudSnow, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';

const cities = [
  { name: 'Mumbai', temp: '31°C', condition: 'Sunny', icon: <Sun className="w-16 h-16 text-yellow-400" /> },
  { name: 'Delhi', temp: '34°C', condition: 'Hazy', icon: <Sun className="w-16 h-16 text-orange-400" /> },
  { name: 'Bangalore', temp: '25°C', condition: 'Cloudy', icon: <Cloud className="w-16 h-16 text-gray-400" /> },
  { name: 'Chennai', temp: '32°C', condition: 'Rainy', icon: <CloudRain className="w-16 h-16 text-blue-400" /> },
  { name: 'Kolkata', temp: '30°C', condition: 'Cloudy', icon: <Cloud className="w-16 h-16 text-gray-400" /> },
  { name: 'Shimla', temp: '15°C', condition: 'Snowy', icon: <CloudSnow className="w-16 h-16 text-white" /> },
];

type City = typeof cities[0];

export function WeatherWidget() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  useEffect(() => {
    // Set initial city on client side to avoid hydration mismatch
    setSelectedCity(cities[0]);
  }, []);

  const handleCityChange = (cityName: string) => {
    const city = cities.find(c => c.name === cityName) || null;
    setSelectedCity(city);
  }

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Weather</CardTitle>
        <Select defaultValue="Mumbai" onValueChange={handleCityChange}>
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
      <CardContent className="flex flex-col items-center justify-center text-center h-[120px]">
        {selectedCity ? (
          <>
            <div className="mb-4">
                {selectedCity.icon}
            </div>
            <p className="text-5xl font-bold">{selectedCity.temp}</p>
            <p className="text-muted-foreground">{selectedCity.condition}</p>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
             <Loader2 className="w-16 h-16 animate-spin" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
