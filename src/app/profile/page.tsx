'use client'
import Image from 'next/image';
import {NftCard} from '@/components/nft-card';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';
import {Button} from '@/components/ui/button';
import {Settings, Share2} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';


const userNfts = [
  {
    id: '1',
    name: 'Cosmic Dream',
    creator: 'PixelPioneer',
    price: '2.1 ETH',
    imageUrl: 'https://placehold.co/400x400.png',
    aiHint: 'cosmic dream',
  },
  {
    id: '2',
    name: 'Retro Future',
    creator: 'PixelPioneer',
    price: '1.8 ETH',
    imageUrl: 'https://placehold.co/400x400.png',
    aiHint: 'retro future',
  },
  {
    id: '3',
    name: 'Pixelated Hero',
    creator: 'PixelPioneer',
    price: '3.5 ETH',
    imageUrl: 'https://placehold.co/400x400.png',
    aiHint: 'pixel hero',
  },
  {
    id: '4',
    name: 'Glitch Garden',
    creator: 'PixelPioneer',
    price: '0.7 ETH',
    imageUrl: 'https://placehold.co/400x400.png',
    aiHint: 'glitch art',
  },
];

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        router.push('/login');
      }
    };
    fetchUser();
  }, [supabase, router]);

  if (!user) {
    return <div className="flex justify-center items-center h-[80vh]">Loading...</div>;
  }

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const userEmail = user.email || 'No email provided';


  return (
    <div className="space-y-8">
      <Card className="bg-card overflow-hidden">
        <CardHeader className="p-0 relative h-48">
          <Image
            src="https://placehold.co/1200x400.png"
            alt="Banner"
            fill
            className="object-cover"
            data-ai-hint="abstract background"
          />
        </CardHeader>
        <CardContent className="p-6 pt-0 -mt-16">
          <div className="flex items-end gap-4">
            <div className="relative w-32 h-32 rounded-full border-4 border-background bg-background">
              <Image
                src="https://placehold.co/200x200.png"
                alt="User Avatar"
                fill
                className="rounded-full object-cover"
                data-ai-hint="avatar abstract"
              />
            </div>
            <div className="flex-grow pb-2">
              <h2 className="text-3xl font-bold font-headline">{userName}</h2>
              <p className="text-muted-foreground">{userEmail}</p>
            </div>
            <div className="flex gap-2 pb-2">
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="mt-4 text-foreground/80">
            Digital artist & collector. Exploring the frontiers of creativity on
            the blockchain. Founder of @CyberCritters.
          </p>
          <Separator className="my-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold font-mono">1,200</p>
              <p className="text-sm text-muted-foreground">Loyalty Points</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-mono">15.8 ETH</p>
              <p className="text-sm text-muted-foreground">Volume</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-mono">87</p>
              <p className="text-sm text-muted-foreground">NFTs Owned</p>
            </div>
            <div>
              <p className="text-2xl font-bold font-mono">12</p>
              <p className="text-sm text-muted-foreground">Creations</p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Badge className="bg-primary/20 text-primary border-primary/30 text-base">
              Level 5: Grandmaster
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-2xl font-bold font-headline mb-4">Collection</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {userNfts.map(nft => (
            <NftCard key={nft.id} {...nft} />
          ))}
        </div>
      </div>
    </div>
  );
}
