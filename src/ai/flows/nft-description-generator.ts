'use server';

/**
 * @fileOverview A flow that generates a creative and imaginative description for an NFT, including a name, based on an image.
 *
 * - generateNftDescription - A function that generates the NFT description.
 * - GenerateNftDescriptionInput - The input type for the generateNftDescription function.
 * - GenerateNftDescriptionOutput - The return type for the generateNftDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNftDescriptionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of an NFT, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateNftDescriptionInput = z.infer<typeof GenerateNftDescriptionInputSchema>;

const GenerateNftDescriptionOutputSchema = z.object({
  name: z.string().describe('The imaginative name of the NFT.'),
  description: z.string().describe('The creative description of the NFT.'),
});
export type GenerateNftDescriptionOutput = z.infer<typeof GenerateNftDescriptionOutputSchema>;

export async function generateNftDescription(input: GenerateNftDescriptionInput): Promise<GenerateNftDescriptionOutput> {
  return generateNftDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNftDescriptionPrompt',
  input: {schema: GenerateNftDescriptionInputSchema},
  output: {schema: GenerateNftDescriptionOutputSchema},
  prompt: `You are a creative content creator specializing in writing NFT names and descriptions.

  Based on the NFT image, create an imaginative name and a creative description for the NFT.

  Photo: {{media url=photoDataUri}}`,
});

const generateNftDescriptionFlow = ai.defineFlow(
  {
    name: 'generateNftDescriptionFlow',
    inputSchema: GenerateNftDescriptionInputSchema,
    outputSchema: GenerateNftDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
