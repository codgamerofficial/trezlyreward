import {AiNamerForm} from '@/components/ai-namer-form';

export default function AiNamerPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline text-primary">
          NFT Description Generator
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Unleash the power of AI to craft the perfect name and description for
          your NFT. Just upload your artwork and let the magic happen.
        </p>
      </div>
      <AiNamerForm />
    </div>
  );
}
