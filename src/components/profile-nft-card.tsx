
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
  onSell: (id: string) => void;
};

export function ProfileNftCard({
  id,
  name,
  creator,
  price,
  imageUrl,
  aiHint,
  onSell
}: NftCardProps) {
  const {toast} = useToast();
  const router = useRouter();

  const handleSell = () => {
    onSell(id);
    toast({
      title: 'NFT Listed for Sale',
      description: `${name} has been listed on the marketplace.`,
    });
    router.push('/');
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
        <Button variant="secondary" className="w-full" onClick={handleSell}>Sell Now</Button>
      </CardFooter>
    </Card>
  );
}

