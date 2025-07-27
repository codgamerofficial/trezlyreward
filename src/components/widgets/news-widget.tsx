'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

const newsItems = [
  { id: 1, title: 'Sensex, Nifty extend gains to new record highs', source: 'The Economic Times' },
  { id: 2, title: 'ISRO successfully launches new communication satellite', source: 'The Hindu' },
  { id: 3, title: 'Government announces new policy for electric vehicles', source: 'Livemint' },
  { id: 4, title: 'Bollywood star announces new blockbuster movie', source: 'Times of India' },
  { id: 5, title: 'Indian Cricket Team wins the series against Australia', source: 'ESPN Cricinfo' },
  { id: 6, title: 'New UPI feature allows for recurring payments', source: 'Moneycontrol' },
];

export function NewsWidget() {
  return (
    <Card className="col-span-1 md:col-span-2 animate-in fade-in-0 slide-in-from-top-4 duration-500 ease-in-out">
      <CardHeader>
        <CardTitle>Indian Daily News</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48">
          <ul className="space-y-4">
            {newsItems.map(item => (
              <li key={item.id} className="border-b pb-2 last:border-b-0">
                <Link href="#" className="hover:text-primary">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.source}</p>
                </Link>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
