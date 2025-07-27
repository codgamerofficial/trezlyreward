'use client';

import {useState} from 'react';
import Image from 'next/image';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {UploadCloud, Wand2, Loader2, Sparkles} from 'lucide-react';

import {
  generateNftDescription,
  type GenerateNftDescriptionOutput,
} from '@/ai/flows/nft-description-generator';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {useToast} from '@/hooks/use-toast';

const formSchema = z.object({
  photo: z
    .instanceof(File)
    .refine(file => file.size > 0, 'An image is required.'),
});
type FormValues = z.infer<typeof formSchema>;

export function AiNamerForm() {
  const [result, setResult] = useState<GenerateNftDescriptionOutput | null>(
    null
  );
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {photo: new File([], '')},
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('photo', file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setResult(null);
    try {
      const photoDataUri = await fileToBase64(data.photo);
      const response = await generateNftDescription({photoDataUri});
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: 'An error occurred',
        description: 'Failed to generate NFT description. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col items-center justify-center p-6 border-2 border-dashed hover:border-primary transition-colors">
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <label
            htmlFor="photo-upload"
            className="cursor-pointer text-center w-full"
          >
            {preview ? (
              <div className="relative aspect-square w-full max-w-sm mx-auto">
                <Image
                  src={preview}
                  alt="NFT preview"
                  fill
                  className="object-contain rounded-md"
                />
              </div>
            ) : (
              <div className="space-y-2 text-muted-foreground">
                <UploadCloud className="mx-auto h-12 w-12" />
                <p className="font-semibold">Click to upload or drag and drop</p>
                <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
          </label>
        </Card>

        <Card className="bg-card flex flex-col min-h-[300px]">
          <CardContent className="p-6 flex-grow flex flex-col justify-center">
            {isLoading ? (
              <div className="text-center space-y-4 text-muted-foreground">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="font-semibold">Generating cosmic ideas...</p>
                <p>Our AI is crafting a unique identity for your creation.</p>
              </div>
            ) : result ? (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold font-headline text-primary">
                  {result.name}
                </h3>
                <p className="text-foreground/90 whitespace-pre-wrap">
                  {result.description}
                </p>
              </div>
            ) : (
              <div className="text-center space-y-4 text-muted-foreground">
                <Wand2 className="mx-auto h-12 w-12" />
                <p className="font-semibold">
                  Your AI-powered description will appear here
                </p>
                <p>Ready to give your NFT a legendary name and story?</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={isLoading || !form.formState.isValid}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Description
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
