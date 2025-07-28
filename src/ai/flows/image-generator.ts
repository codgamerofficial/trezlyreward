
'use server';

/**
 * @fileOverview A flow that generates an image based on a text prompt and a selected style.
 *
 * - generateImage - A function that generates an image.
 */

import {ai} from '@/ai/genkit';
import { GenerateImageInput, GenerateImageInputSchema, GenerateImageOutput, GenerateImageOutputSchema } from './image-generator-types';

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    let prompt: any = `Generate an image of the following prompt in a ${input.style} style: ${input.prompt}`;

    if (input.photoDataUri) {
      prompt = [
        { media: { url: input.photoDataUri } },
        { text: `Generate an image of the provided subject, but in a ${input.style} style. Also consider the following prompt: ${input.prompt}` },
      ];
    }
    
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media.url) {
        throw new Error('Image generation failed.');
    }

    return { imageUrl: media.url };
  }
);
