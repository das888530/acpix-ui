'use server';
/**
 * @fileOverview An AI agent for generating detailed and engaging video descriptions.
 *
 * - generateVideoDescription - A function that handles the video description generation process.
 * - GenerateVideoDescriptionInput - The input type for the generateVideoDescription function.
 * - GenerateVideoDescriptionOutput - The return type for the generateVideoDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVideoDescriptionInputSchema = z.object({
  title: z.string().optional().describe('The title of the video.'),
  briefInput: z.string().optional().describe('A brief summary or keywords about the video content.'),
}).refine(data => data.title || data.briefInput, {
  message: 'Either title or briefInput must be provided.',
  path: ['title', 'briefInput'],
});
export type GenerateVideoDescriptionInput = z.infer<typeof GenerateVideoDescriptionInputSchema>;

const GenerateVideoDescriptionOutputSchema = z.object({
  description: z.string().describe('A detailed and engaging description for the video.'),
});
export type GenerateVideoDescriptionOutput = z.infer<typeof GenerateVideoDescriptionOutputSchema>;

export async function generateVideoDescription(input: GenerateVideoDescriptionInput): Promise<GenerateVideoDescriptionOutput> {
  return generateVideoDescriptionFlow(input);
}

const generateVideoDescriptionPrompt = ai.definePrompt({
  name: 'generateVideoDescriptionPrompt',
  input: {schema: GenerateVideoDescriptionInputSchema},
  output: {schema: GenerateVideoDescriptionOutputSchema},
  prompt: `You are an expert content creator and copywriter specializing in engaging video descriptions.
Your task is to generate a detailed and engaging description for a new video.

Here is the information about the video:
{{#if title}}Title: {{{title}}}{{/if}}
{{#if briefInput}}Brief Input/Keywords: {{{briefInput}}}{{/if}}

Generate a compelling description that attracts viewers. Focus on key plot points, unique features, or the overall theme. The description should be suitable for an entertainment platform. Ensure it is detailed but concise enough to be easily readable.
`,
});

const generateVideoDescriptionFlow = ai.defineFlow(
  {
    name: 'generateVideoDescriptionFlow',
    inputSchema: GenerateVideoDescriptionInputSchema,
    outputSchema: GenerateVideoDescriptionOutputSchema,
  },
  async input => {
    const {output} = await generateVideoDescriptionPrompt(input);
    return output!;
  }
);
