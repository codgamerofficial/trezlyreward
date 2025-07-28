/**
 * @fileOverview Type definitions for the image generator flow.
 *
 * - GenerateImageInputSchema - The Zod schema for the input of the image generation flow.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutputSchema - The Zod schema for the output of the image generation flow.
 * - GenerateImageOutput - The return type for the generateImage function.
 */
import { z } from 'zod';

export const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate an image from.'),
  style: z.string().describe('The artistic style for the image (e.g., Ghibli, Anime, Realistic).'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

export const GenerateImageOutputSchema = z.object({
    imageUrl: z.string().describe("The data URI of the generated image. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;
