
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Cloud, CloudRain, CloudSnow, Loader2, Droplets, Wind, Thermometer, CloudSun } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';

const cities = [
  { 
    name: 'Mumbai', 
    temp: '31°C', 
    condition: 'Sunny', 
    icon: Sun,
    humidity: '75%',
    airQuality: 'Moderate',
    rainTiming: 'No rain expected in the next 24 hours.',
    next7days: [
        { day: 'Tue', temp: '32°C', condition: 'Sunny', icon: Sun },
        { day: 'Wed', temp: '31°C', condition: 'Cloudy', icon: Cloud },
        { day: 'Thu', temp: '30°C', condition: 'Showers', icon: CloudRain },
        { day: 'Fri', temp: '31°C', condition: 'Showers', icon: CloudRain },
        { day: 'Sat', temp: '32°C', condition: 'Cloudy', icon: Cloud },
        { day: 'Sun', temp: '33°C', condition: 'Sunny', icon: Sun },
        { day: 'Mon', temp: '33°C', condition: 'Sunny', icon: Sun },
    ],
  },
  { 
    name: 'Delhi', 
    temp: '34°C', 
    condition: 'Hazy', 
    icon: CloudSun,
    humidity: '40%',
    airQuality: 'Unhealthy',
    rainTiming: 'Trace amounts of rain possible overnight.',
     next7days: [
        { day: 'Tue', temp: '35°C', condition: 'Sunny', icon: Sun },
        { day: 'Wed', temp: '36°C', condition: 'Sunny', icon: Sun },
        { day: 'Thu', temp: '34°C', condition: 'Hazy', icon: CloudSun },
        { day: 'Fri', temp: '33°C', condition: 'Hazy', icon: CloudSun },
        { day: 'Sat', temp: '34°C', condition: 'Sunny', icon: Sun },
        { day: 'Sun', temp: '35°C', condition: 'Sunny', icon: Sun },
        { day: 'Mon', temp: '35°C', condition: 'Sunny', icon: Sun },
    ],
  },
  { 
    name: 'Bangalore', 
    temp: '25°C', 
    condition: 'Cloudy', 
    icon: Cloud,
    humidity: '85%',
    airQuality: 'Good',
    rainTiming: 'Light drizzle expected around 4 PM.',
     next7days: [
        { day: 'Tue', temp: '26°C', condition: 'Showers', icon: CloudRain },
        { day: 'Wed', temp: '25°C', condition: 'Cloudy', icon: Cloud },
        { day: 'Thu', temp: '24°C', condition: 'Rainy', icon: CloudRain },
        { day: 'Fri', temp: '25°C', condition: 'Cloudy', icon: Cloud },
        { day: 'Sat', temp: '26°C', condition: 'Showers', icon: CloudRain },
        { day: 'Sun', temp: '27°C', condition: 'Cloudy', icon: Cloud },
        { day: 'Mon', temp: '27°C', condition: 'Cloudy', icon: Cloud },
    ],
  },
  { 
    name: 'Chennai', 
    temp: '32°C', 
    condition: 'Rainy', 
    icon: CloudRain,
    humidity: '88%',
    airQuality: 'Moderate',
    rainTiming: 'Heavy rain expected for the next 3 hours.',
     next7days: [
        { day: 'Tue', temp: '31°C', condition: 'Rainy', icon: CloudRain },
        { day: 'Wed', temp: '32°C', condition: 'Showers', icon: CloudRain },
        { day: 'Thu', temp: '30°C', condition: 'Rainy', icon: CloudRain },
        { day: 'Fri', temp: '31°C', condition: 'Cloudy', icon: Cloud },
        { day: 'Sat', temp: '32°C', condition: 'Cloudy', icon: Cloud },
        { day: 'Sun', temp: '33°C', condition: 'Showers', icon: CloudRain },
        { day: 'Mon', temp: '32°C', condition: 'Rainy', icon: CloudRain },
    ],
  },
  { 
    name: 'Kolkata', 
    temp: '30°C', 
    condition: 'Cloudy', 
    icon: Cloud,
    humidity: '82%',
    airQuality: 'Moderate',
    rainTiming: 'Chance of thunderstorms late evening.',
     next7days: [
        { day: 'Tue', temp: '31°C', condition: 'Cloudy', icon: Cloud },
        { day: 'Wed', temp: '30°C', condition: 'Showers', icon: CloudRain },
        { day: 'Thu', temp: '29°C', condition: 'Rainy', icon: CloudRain },
        { day: 'Fri', temp: '30°C', condition: 'Cloudy', icon: Cloud },
        { day: 'Sat', temp: '31°C', condition: 'Cloudy', icon: Cloud },
        { day: 'Sun', temp: '32°C', condition: 'Showers', icon: CloudRain },
        { day: 'Mon', temp: '31°C', condition: 'Cloudy', icon: Cloud },
    ],
  },
    {
    name: 'Hyderabad',
    temp: '32°C',
    condition: 'Partly Cloudy',
    icon: CloudSun,
    humidity: '60%',
    airQuality: 'Moderate',
    rainTiming: 'No significant rain expected.',
    next7days: [
      { day: 'Tue', temp: '33°C', condition: 'Partly Cloudy', icon: CloudSun },
      { day: 'Wed', temp: '34°C', condition: 'Sunny', icon: Sun },
      { day: 'Thu', temp: '33°C', condition: 'Partly Cloudy', icon: CloudSun },
      { day: 'Fri', temp: '32°C', condition: 'Cloudy', icon: Cloud },
      { day: 'Sat', temp: '31°C', condition: 'Showers', icon: CloudRain },
      { day: 'Sun', temp: '32°C', condition: 'Cloudy', icon: Cloud },
      { day: 'Mon', temp: '33°C', condition: 'Partly Cloudy', icon: CloudSun },
    ],
  },
  {
    name: 'Pune',
    temp: '27°C',
    condition: 'Cloudy',
    icon: Cloud,
    humidity: '80%',
    airQuality: 'Good',
    rainTiming: 'Light showers possible in the afternoon.',
    next7days: [
      { day: 'Tue', temp: '28°C', condition: 'Cloudy', icon: Cloud },
      { day: 'Wed', temp: '27°C', condition: 'Showers', icon: CloudRain },
      { day: 'Thu', temp: '26°C', condition: 'Rainy', icon: CloudRain },
      { day: 'Fri', temp: '27°C', condition: 'Cloudy', icon: Cloud },
      { day: 'Sat', temp: '28°C', condition: 'Cloudy', icon: Cloud },
      { day: 'Sun', temp: '29°C', condition: 'Partly Cloudy', icon: CloudSun },
      { day: 'Mon', temp: '28°C', condition: 'Cloudy', icon: Cloud },
    ],
  },
  {
    name: 'Ahmedabad',
    temp: '36°C',
    condition: 'Sunny',
    icon: Sun,
    humidity: '35%',
    airQuality: 'Unhealthy for Sensitive Groups',
    rainTiming: 'No rain expected.',
    next7days: [
      { day: 'Tue', temp: '37°C', condition: 'Sunny', icon: Sun },
      { day: 'Wed', temp: '38°C', condition: 'Sunny', icon: Sun },
      { day: 'Thu', temp: '37°C', condition: 'Sunny', icon: Sun },
      { day: 'Fri', temp: '36°C', condition: 'Sunny', icon: Sun },
      { day: 'Sat', temp: '37°C', condition: 'Hazy', icon: CloudSun },
      { day: 'Sun', temp: '38°C', condition: 'Hazy', icon: CloudSun },
      { day: 'Mon', temp: '37°C', condition: 'Sunny', icon: Sun },
    ],
  },
  {
    name: 'Jaipur',
    temp: '37°C',
    condition: 'Sunny',
    icon: Sun,
    humidity: '30%',
    airQuality: 'Unhealthy',
    rainTiming: 'No rain expected.',
    next7days: [
      { day: 'Tue', temp: '38°C', condition: 'Sunny', icon: Sun },
      { day: 'Wed', temp: '39°C', condition: 'Sunny', icon: Sun },
      { day: 'Thu', temp: '38°C', condition: 'Sunny', icon: Sun },
      { day: 'Fri', temp: '37°C', condition: 'Hazy', icon: CloudSun },
      { day: 'Sat', temp: '38°C', condition: 'Sunny', icon: Sun },
      { day: 'Sun', temp: '39°C', condition: 'Sunny', icon: Sun },
      { day: 'Mon', temp: '38°C', condition: 'Sunny', icon: Sun },
    ],
  },
  {
    name: 'Srinagar',
    temp: '18°C',
    condition: 'Cloudy',
    icon: Cloud,
    humidity: '75%',
    airQuality: 'Good',
    rainTiming: 'Light rain expected tomorrow.',
    next7days: [
      { day: 'Tue', temp: '19°C', condition: 'Showers', icon: CloudRain },
      { day: 'Wed', temp: '18°C', condition: 'Cloudy', icon: Cloud },
      { day: 'Thu', temp: '17°C', condition: 'Rainy', icon: CloudRain },
      { day: 'Fri', temp: '19°C', condition: 'Partly Cloudy', icon: CloudSun },
      { day: 'Sat', temp: '20°C', condition: 'Sunny', icon: Sun },
      { day: 'Sun', temp: '21°C', condition: 'Sunny', icon: Sun },
      { day: 'Mon', temp: '20°C', condition: 'Partly Cloudy', icon: CloudSun },
    ],
  },
  {
    name: 'Guwahati',
    temp: '28°C',
    condition: 'Rainy',
    icon: CloudRain,
    humidity: '92%',
    airQuality: 'Good',
    rainTiming: 'Continuous light rain throughout the day.',
    next7days: [
      { day: 'Tue', temp: '27°C', condition: 'Rainy', icon: CloudRain },
      { day: 'Wed', temp: '28°C', condition: 'Rainy', icon: CloudRain },
      { day: 'Thu', temp: '27°C', condition: 'Thunderstorms', icon: CloudRain },
      { day: 'Fri', temp: '28°C', condition: 'Rainy', icon: CloudRain },
      { day: 'Sat', temp: '29°C', condition: 'Showers', icon: CloudRain },
      { day: 'Sun', temp: '29°C', condition: 'Showers', icon: CloudRain },
      { day: 'Mon', temp: '28°C', condition: 'Rainy', icon: CloudRain },
    ],
  },
  { 
    name: 'Shimla', 
    temp: '15°C', 
    condition: 'Snowy', 
    icon: CloudSnow,
    humidity: '90%',
    airQuality: 'Good',
    rainTiming: 'Light snowfall predicted for tomorrow morning.',
     next7days: [
        { day: 'Tue', temp: '14°C', condition: 'Snowy', icon: CloudSnow },
        { day: 'Wed', temp: '15°C', condition: 'Cloudy', icon: Cloud },
        { day: 'Thu', temp: '13°C', condition: 'Snowy', icon: CloudSnow },
        { day: 'Fri', temp: '16°C', condition: 'Sunny', icon: Sun },
        { day: 'Sat', temp: '17°C', condition: 'Sunny', icon: Sun },
        { day: 'Sun', 'temp': '16°C', 'condition': 'Cloudy', 'icon': Cloud },
        { day: 'Mon', 'temp': '15°C', 'condition': 'Cloudy', 'icon': Cloud },
    ],
  },
];

type City = (typeof cities)[0];

export function WeatherWidget() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  useEffect(() => {
    setSelectedCity(cities[0]);
  }, []);

  const handleCityChange = (cityName: string) => {
    const city = cities.find(c => c.name === cityName) || null;
    setSelectedCity(city);
  }

  const Icon = selectedCity?.icon;

  return (
    <Card className="col-span-1 md:col-span-2 animate-in fade-in-0 slide-in-from-top-4 duration-500 ease-in-out">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Weather</CardTitle>
        <Select defaultValue={cities[0].name} onValueChange={handleCityChange}>
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
      <CardContent>
        {!selectedCity || !Icon ? (
           <div className="flex flex-col items-center justify-center text-muted-foreground h-48">
             <Loader2 className="w-16 h-16 animate-spin" />
          </div>
        ) : (
        <Tabs defaultValue="now">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="now">Now</TabsTrigger>
            <TabsTrigger value="24h">Next 24 Hours</TabsTrigger>
            <TabsTrigger value="7d">Next 7 Days</TabsTrigger>
          </TabsList>
          <TabsContent value="now" className="mt-4">
              <div className="flex flex-col items-center text-center">
                <Icon className="w-20 h-20 text-yellow-400" />
                <p className="text-6xl font-bold mt-2">{selectedCity.temp}</p>
                <p className="text-muted-foreground text-lg">{selectedCity.condition}</p>
                <div className="flex gap-x-6 gap-y-2 mt-4 text-sm text-muted-foreground flex-wrap justify-center">
                    <div className="flex items-center gap-1">
                        <Droplets className="w-4 h-4" />
                        <span>{selectedCity.humidity} Humidity</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Wind className="w-4 h-4" />
                        <span>{selectedCity.airQuality} AQI</span>
                    </div>
                </div>
              </div>
          </TabsContent>
          <TabsContent value="24h" className="mt-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="font-semibold text-lg">Rain Forecast</p>
                <p className="text-muted-foreground">{selectedCity.rainTiming}</p>
            </div>
          </TabsContent>
          <TabsContent value="7d" className="mt-4">
            <ul className="space-y-2">
                {selectedCity.next7days.map((day, index) => {
                    const DayIcon = day.icon;
                    return (
                        <li key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                            <span className="font-semibold w-12">{day.day}</span>
                            <DayIcon className="w-6 h-6 mx-4 text-yellow-400" />
                            <span className="flex-grow text-muted-foreground">{day.condition}</span>
                            <span className="font-semibold">{day.temp}</span>
                        </li>
                    )
                })}
            </ul>
          </TabsContent>
        </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
