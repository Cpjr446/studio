// SummarizeInquiry flow
'use server';

/**
 * @fileOverview Summarizes complex customer inquiries for support agents.
 *
 * - summarizeInquiry - A function that summarizes customer inquiries.
 * - SummarizeInquiryInput - The input type for the summarizeInquiry function.
 * - SummarizeInquiryOutput - The return type for the summarizeInquiry function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeInquiryInputSchema = z.object({
  inquiry: z.string().describe('The customer inquiry to summarize.'),
});
export type SummarizeInquiryInput = z.infer<typeof SummarizeInquiryInputSchema>;

const SummarizeInquiryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the customer inquiry.'),
});
export type SummarizeInquiryOutput = z.infer<typeof SummarizeInquiryOutputSchema>;

export async function summarizeInquiry(input: SummarizeInquiryInput): Promise<SummarizeInquiryOutput> {
  return summarizeInquiryFlow(input);
}

const summarizeInquiryPrompt = ai.definePrompt({
  name: 'summarizeInquiryPrompt',
  input: {schema: SummarizeInquiryInputSchema},
  output: {schema: SummarizeInquiryOutputSchema},
  prompt: `Summarize the following customer inquiry in a concise and easy-to-understand manner for a support agent:\n\n{{{inquiry}}}`,
});

const summarizeInquiryFlow = ai.defineFlow(
  {
    name: 'summarizeInquiryFlow',
    inputSchema: SummarizeInquiryInputSchema,
    outputSchema: SummarizeInquiryOutputSchema,
  },
  async input => {
    const {output} = await summarizeInquiryPrompt(input);
    return output!;
  }
);
