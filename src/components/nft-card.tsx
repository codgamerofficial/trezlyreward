
'use client';

import Image from 'next/image';
import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card';
import {Button} from './ui/button';
import {useToast} from '@/hooks/use-toast';
import {useRouter} from 'next/navigation';

type NftCardProps = {
  id: string;
  name: string;
  creator: string;
  price: string;
  imageUrl: string;
  aiHint: string;
  priority?: boolean;
};

declare const Razorpay: any;

export function NftCard({
  id,
  name,
  creator,
  price,
  imageUrl,
  aiHint,
  priority = false,
}: NftCardProps) {
  const {toast} = useToast();
  const router = useRouter();

  const handleBuy = async () => {
    const priceInRupees = parseFloat(price.replace(' ETH', '')) * 250000; // Assuming 1 ETH = 2,50,000 INR for demo

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
      amount: priceInRupees,
      currency: "INR",
      name: "Treazly Inc.",
      description: `Purchase NFT: ${name}`,
      image: "https://placehold.co/100x100.png",
      handler: function (response: any){
        toast({
          title: 'Purchase Successful!',
          description: `You have successfully purchased ${name}. It has been added to your profile.`,
        });

        // Add to user's collection in localStorage
        const existingNfts = JSON.parse(localStorage.getItem('userNfts') || '[]');
        const newNft = { id, name, creator, price, imageUrl, aiHint };
        localStorage.setItem('userNfts', JSON.stringify([...existingNfts, newNft]));

        // Remove from trending list in localStorage (if it exists there)
        const existingTrending = JSON.parse(localStorage.getItem('trendingNfts') || '[]');
        const newTrending = existingTrending.filter((nft: any) => nft.id !== id);
        localStorage.setItem('trendingNfts', JSON.stringify(newTrending));

        router.push('/profile');
        router.refresh(); // To reflect changes if on the same page
      },
      prefill: {
          name: "PixelPioneer",
          email: "pioneer@example.com",
          contact: "9999999999"
      },
      theme: {
          color: "#A755F7"
      }
    };

    if (typeof Razorpay === 'undefined') {
      toast({
        title: 'Razorpay not loaded',
        description: 'Please check your internet connection and try again.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!process.env.NEXT_PUBLIC_RAZORPAY_API_KEY) {
      toast({
        title: 'Razorpay Key not configured',
        description: 'The Razorpay API key is missing.',
        variant: 'destructive',
      });
      return;
    }

    const rzp1 = new Razorpay(options);

    rzp1.on('payment.failed', function (response: any){
      toast({
        title: 'Payment Failed',
        description: response.error.description,
        variant: 'destructive',
      });
    });

    rzp1.open();
  };


  return (
    <Card className="group overflow-hidden border-2 border-transparent hover:border-accent transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/40 bg-card">
      <CardHeader className="p-0">
        <div className="relative aspect-square">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            data-ai-hint={aiHint}
            priority={priority}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <div className="font-headline text-lg font-semibold truncate">{name}</div>
        <p className="text-sm text-muted-foreground">by {creator}</p>
        <p className="text-lg font-bold text-primary">{price}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={handleBuy}>Buy Now</Button>
      </CardFooter>
    </Card>
  );
}
