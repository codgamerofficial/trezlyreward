
'use client'
import Image from 'next/image';
import { ProfileNftCard } from '@/components/profile-nft-card';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';
import {Button} from '@/components/ui/button';
import {Settings, Share2} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

type Nft = {
  id: string;
  name: string;
  creator: string;
  price: string;
  imageUrl: string;
  aiHint: string;
};

const initialUserNfts = [
  {
    id: '101',
    name: 'Cosmic Dream',
    creator: 'PixelPioneer',
    price: '2.1 ETH',
    imageUrl: 'https://placehold.co/600x600.png',
    aiHint: 'cosmic dream',
  },
  {
    id: '102',
    name: 'Retro Future',
    creator: 'PixelPioneer',
    price: '1.8 ETH',
    imageUrl: 'https://placehold.co/600x600.png',
    aiHint: 'retro future',
  },
];

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [userNfts, setUserNfts] = useState<Nft[]>([]);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndNfts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const storedNfts = JSON.parse(localStorage.getItem('userNfts') || '[]');
        if (storedNfts.length === 0) {
            localStorage.setItem('userNfts', JSON.stringify(initialUserNfts));
            setUserNfts(initialUserNfts);
        } else {
            setUserNfts(storedNfts);
        }
      } else {
        router.push('/login');
      }
    };
    fetchUserAndNfts();
  }, [supabase, router]);
  
  const handleSellNft = (nftId: string) => {
    const nftToSell = userNfts.find(nft => nft.id === nftId);
    if (!nftToSell) return;

    // Remove from user's collection
    const updatedUserNfts = userNfts.filter(nft => nft.id !== nftId);
    setUserNfts(updatedUserNfts);
    localStorage.setItem('userNfts', JSON.stringify(updatedUserNfts));

    // Add back to trending list
    const existingTrending = JSON.parse(localStorage.getItem('trendingNfts') || '[]');
    localStorage.setItem('trendingNfts', JSON.stringify([...existingTrending, nftToSell]));
  };


  if (!user) {
    return <div className="flex justify-center items-center h-[80vh]">Loading...</div>;
  }

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const userEmail = user.email || 'No email provided';


  return (
    <div className="space-y-8">
      <Card className="bg-card overflow-hidden">
        <CardHeader className="p-0 relative h-36 md:h-48">
          <Image
            src="https://placehold.co/1200x400.png"
            alt="Banner"
            fill
            className="object-cover"
            data-ai-hint="abstract background"
          />
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 -mt-12 md:-mt-16">
          <div className="flex items-end gap-4">
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-background bg-background">
              <Image
                src="https://placehold.co/200x200.png"
                alt="User Avatar"
                fill
                className="rounded-full object-cover"
                data-ai-hint="avatar abstract"
              />
            </div>
            <div className="flex-grow pb-2">
              <h2 className="text-2xl md:text-3xl font-bold font-headline">{userName}</h2>
              <p className="text-sm md:text-base text-muted-foreground">{userEmail}</p>
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
              <p className="text-xl md:text-2xl font-bold font-mono">1,200</p>
              <p className="text-xs md:text-sm text-muted-foreground">Loyalty Points</p>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold font-mono">15.8 ETH</p>
              <p className="text-xs md:text-sm text-muted-foreground">Volume</p>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold font-mono">{userNfts.length}</p>
              <p className="text-xs md:text-sm text-muted-foreground">NFTs Owned</p>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold font-mono">12</p>
              <p className="text-xs md:text-sm text-muted-foreground">Creations</p>
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
        <h3 className="text-2xl font-bold font-headline mb-4">My Collection</h3>
        {userNfts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {userNfts.map(nft => (
              <ProfileNftCard key={nft.id} {...nft} onSell={handleSellNft} />
            ))}
          </div>
        ) : (
          <Card className="text-center p-8">
            <p className="text-muted-foreground">Your collection is empty.</p>
            <Button variant="link" asChild><a href="/">Explore the marketplace</a></Button>
          </Card>
        )}
      </div>
    </div>
  );
}
