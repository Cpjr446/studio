
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
  error: z.string().optional().describe('An error message if suggestions could not be generated.'),
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
  output: {schema: SuggestKnowledgeArticlesOutputSchema}, // Output schema should ideally just be the articles
  prompt: `You are a customer support AI assistant. Your job is to suggest relevant knowledge base articles based on the customer's inquiry.
Provide up to 3 relevant article titles.

Customer Inquiry: {{{customerInquiry}}}

Respond with a list of suggested article titles.
  `,
});

const suggestKnowledgeArticlesFlow = ai.defineFlow(
  {
    name: 'suggestKnowledgeArticlesFlow',
    inputSchema: SuggestKnowledgeArticlesInputSchema,
    outputSchema: SuggestKnowledgeArticlesOutputSchema, // Flow output can include error
  },
  async (input): Promise<SuggestKnowledgeArticlesOutput> => {
    try {
      const {output} = await prompt(input);
      if (!output || !output.suggestedArticles) {
        console.warn("AI prompt returned no article suggestions for suggestKnowledgeArticlesFlow.");
        return { suggestedArticles: [], error: "AI could not find relevant articles at this time." };
      }
      return { suggestedArticles: output.suggestedArticles };
    } catch (error: any) {
      console.error("Error in suggestKnowledgeArticlesFlow:", error);
      let userFriendlyMessage = "Could not load article suggestions due to an unexpected error.";
      if (error.message && error.message.includes('[429 Too Many Requests]')) {
        userFriendlyMessage = "Article suggestions temporarily unavailable due to high demand. Please try again later.";
      }
      return { suggestedArticles: [], error: userFriendlyMessage };
    }
  }
);
