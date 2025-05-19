'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting relevant knowledge base articles based on a customer inquiry.
 *
 * The flow takes a customer inquiry as input and returns a list of suggested knowledge base articles.
 * - suggestKnowledgeArticles - A function that handles the knowledge article suggestion process.
 * - SuggestKnowledgeArticlesInput - The input type for the suggestKnowledgeArticles function.
 * - SuggestKnowledgeArticlesOutput - The return type for the suggestKnowledgeArticles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestKnowledgeArticlesInputSchema = z.object({
  customerInquiry: z
    .string()
    .describe('The customer inquiry to find relevant knowledge base articles for.'),
});
export type SuggestKnowledgeArticlesInput = z.infer<typeof SuggestKnowledgeArticlesInputSchema>;

const SuggestKnowledgeArticlesOutputSchema = z.object({
  suggestedArticles: z
    .array(z.string())
    .describe('A list of suggested knowledge base article titles or URLs.'),
});
export type SuggestKnowledgeArticlesOutput = z.infer<typeof SuggestKnowledgeArticlesOutputSchema>;

export async function suggestKnowledgeArticles(
  input: SuggestKnowledgeArticlesInput
): Promise<SuggestKnowledgeArticlesOutput> {
  return suggestKnowledgeArticlesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestKnowledgeArticlesPrompt',
  input: {schema: SuggestKnowledgeArticlesInputSchema},
  output: {schema: SuggestKnowledgeArticlesOutputSchema},
  prompt: `You are a customer support AI assistant. Your job is to suggest relevant knowledge base articles based on the customer's inquiry.

Customer Inquiry: {{{customerInquiry}}}

Suggested Articles:`, // Use a simple prompt to suggest articles
});

const suggestKnowledgeArticlesFlow = ai.defineFlow(
  {
    name: 'suggestKnowledgeArticlesFlow',
    inputSchema: SuggestKnowledgeArticlesInputSchema,
    outputSchema: SuggestKnowledgeArticlesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
