'use server';
/**
 * @fileOverview A Genkit flow for suggesting video metadata (tags and genres).
 *
 * - suggestVideoMetadata - A function that handles the video metadata suggestion process.
 * - SuggestVideoMetadataInput - The input type for the suggestVideoMetadata function.
 * - SuggestVideoMetadataOutput - The return type for the suggestVideoMetadata function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestVideoMetadataInputSchema = z.object({
  title: z.string().describe('The title of the video.'),
  description: z.string().describe('The description of the video content.'),
});
export type SuggestVideoMetadataInput = z.infer<typeof SuggestVideoMetadataInputSchema>;

const SuggestVideoMetadataOutputSchema = z.object({
  tags: z.array(z.string()).describe('A list of suggested tags for the video.'),
  genres: z.array(z.string()).describe('A list of suggested genre classifications for the video.'),
});
export type SuggestVideoMetadataOutput = z.infer<typeof SuggestVideoMetadataOutputSchema>;

export async function suggestVideoMetadata(input: SuggestVideoMetadataInput): Promise<SuggestVideoMetadataOutput> {
  return suggestVideoMetadataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestVideoMetadataPrompt',
  input: { schema: SuggestVideoMetadataInputSchema },
  output: { schema: SuggestVideoMetadataOutputSchema },
  prompt: `You are an expert video content categorizer for an OTT app called StreamVault.
Your task is to analyze the provided video title and description and suggest a list of relevant tags and genre classifications.

Instructions:
- Provide at least 5 relevant tags and no more than 10.
- Provide at least 1 relevant genre and no more than 3.
- The genres should be common video genres (e.g., Action, Drama, Comedy, Sci-Fi, Documentary, Thriller, Horror, Romance, Animation, Family).
- Ensure the output is a valid JSON object matching the specified schema.

Video Title: {{{title}}}
Video Description: {{{description}}}`,
});

const suggestVideoMetadataFlow = ai.defineFlow(
  {
    name: 'suggestVideoMetadataFlow',
    inputSchema: SuggestVideoMetadataInputSchema,
    outputSchema: SuggestVideoMetadataOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
