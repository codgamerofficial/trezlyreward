
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Wand2, Loader2, Sparkles, Image as ImageIcon, UploadCloud } from 'lucide-react';

import {
  generateImage,
} from '@/ai/flows/image-generator';
import { type GenerateImageOutput, GenerateImageInputSchema } from '@/ai/flows/image-generator-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

type FormValues = z.infer<typeof GenerateImageInputSchema>;

export default function CreativeStudioPage() {
  const [result, setResult] = useState<GenerateImageOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(GenerateImageInputSchema),
    defaultValues: {
      prompt: '',
      style: 'Ghibli',
      photoDataUri: undefined,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setPreview(dataUri);
        form.setValue('photoDataUri', dataUri, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateImage(data);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        title: 'An error occurred',
        description: 'Failed to generate image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline text-primary">
          Creative Studio
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Your AI-powered suite for content creation. Starting with Text-to-Image.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Image Controls</CardTitle>
              <CardDescription>Provide a prompt and optional reference image.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormItem>
                    <FormLabel>Reference Image (Optional)</FormLabel>
                    <FormControl>
                       <Card className="flex flex-col items-center justify-center p-4 border-2 border-dashed hover:border-primary transition-colors">
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
                                alt="Reference preview"
                                fill
                                className="object-contain rounded-md"
                              />
                            </div>
                          ) : (
                            <div className="space-y-2 text-muted-foreground">
                              <UploadCloud className="mx-auto h-10 w-10" />
                              <p className="font-semibold text-sm">Click to upload an image</p>
                              <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
                            </div>
                          )}
                        </label>
                      </Card>
                    </FormControl>
                  </FormItem>

                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prompt</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., A majestic dragon soaring over a mystical forest at dawn."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="style"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Ghibli">Ghibli</SelectItem>
                            <SelectItem value="Anime">Anime</SelectItem>
                            <SelectItem value="Cartoon">Cartoon</SelectItem>
                            <SelectItem value="Realistic">Realistic</SelectItem>
                            <SelectItem value="Pixel Art">Pixel Art</SelectItem>
                            <SelectItem value="Cyberpunk">Cyberpunk</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" size="lg" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Image
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
            <Card className="bg-card flex flex-col min-h-[500px] items-center justify-center sticky top-20 p-4">
            {isLoading ? (
                <div className="text-center space-y-4 text-muted-foreground">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="font-semibold">Painting your vision...</p>
                <p>Our AI is bringing your prompt to life.</p>
                </div>
            ) : result ? (
                <div className="relative w-full aspect-square">
                    <Image
                    src={result.imageUrl}
                    alt="Generated image"
                    fill
                    className="object-contain rounded-md"
                    />
                </div>
            ) : (
                <div className="text-center space-y-4 text-muted-foreground">
                <ImageIcon className="mx-auto h-12 w-12" />
                <p className="font-semibold">Your generated image will appear here</p>
                <p>What masterpiece will you create today?</p>
                </div>
            )}
            </Card>
        </div>
      </div>
    </div>
  );
}
