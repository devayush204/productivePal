'use server';
/**
 * @fileOverview A motivational quote AI agent.
 *
 * - getMotivationalQuote - A function that returns a motivational quote.
 * - MotivationalQuoteOutput - The return type for the getMotivationalQuote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MotivationalQuoteOutputSchema = z.object({
  quote: z.string().describe('A motivational quote to inspire the user.'),
});
export type MotivationalQuoteOutput = z.infer<typeof MotivationalQuoteOutputSchema>;

export async function getMotivationalQuote(): Promise<MotivationalQuoteOutput> {
  return motivationalQuoteFlow();
}

const prompt = ai.definePrompt({
  name: 'motivationalQuotePrompt',
  output: {schema: MotivationalQuoteOutputSchema},
  prompt: `You are a motivational speaker.  Generate a short, inspirational quote to motivate the user to stick to their habits and tasks.`,
});

const motivationalQuoteFlow = ai.defineFlow(
  {
    name: 'motivationalQuoteFlow',
    outputSchema: MotivationalQuoteOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);
