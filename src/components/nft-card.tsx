import Image from 'next/image';
import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card';
import {Button} from './ui/button';

type NftCardProps = {
  name: string;
  creator: string;
  price: string;
  imageUrl: string;
  aiHint: string;
};

export function NftCard({
  name,
  creator,
  price,
  imageUrl,
  aiHint,
}: NftCardProps) {
  return (
    <Card className="group overflow-hidden border-2 border-transparent hover:border-primary transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/30 bg-card">
      <CardHeader className="p-0">
        <div className="relative aspect-square">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={aiHint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <div className="font-headline text-lg font-semibold truncate">{name}</div>
        <p className="text-sm text-muted-foreground">by {creator}</p>
        <p className="text-lg font-bold text-accent">{price}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full">Buy Now</Button>
      </CardFooter>
    </Card>
  );
}
