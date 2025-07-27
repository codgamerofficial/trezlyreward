
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Wand2, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';

import {
  generateImage,
  type GenerateImageOutput,
  GenerateImageInputSchema,
} from '@/ai/flows/image-generator';
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

  const form = useForm<FormValues>({
    resolver: zodResolver(GenerateImageInputSchema),
    defaultValues: {
      prompt: '',
      style: 'Ghibli',
    },
  });

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
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline text-primary">
          Creative Studio
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Your AI-powered suite for content creation. Starting with Text-to-Image.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Text-to-Image Generator</CardTitle>
          <CardDescription>Create stunning visuals from your words in various artistic styles.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            
            <Card className="bg-card flex flex-col min-h-[300px] items-center justify-center">
              {isLoading ? (
                <div className="text-center space-y-4 text-muted-foreground">
                  <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                  <p className="font-semibold">Painting your vision...</p>
                  <p>Our AI is bringing your prompt to life.</p>
                </div>
              ) : result ? (
                 <div className="relative aspect-square w-full">
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
        </CardContent>
      </Card>
    </div>
  );
}
