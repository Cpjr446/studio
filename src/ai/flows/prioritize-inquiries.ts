
'use server';

/**
 * @fileOverview This file contains the Genkit flow for prioritizing customer inquiries based on sentiment and urgency.
 *
 * - prioritizeInquiry - A function that prioritizes customer inquiries.
 * - PrioritizeInquiryInput - The input type for the prioritizeInquiry function.
 * - PrioritizeInquiryOutput - The return type for the prioritizeInquiry function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrioritizeInquiryInputSchema = z.object({
  inquiry: z.string().describe('The customer inquiry text.'),
});
export type PrioritizeInquiryInput = z.infer<typeof PrioritizeInquiryInputSchema>;

const PrioritizeInquiryOutputSchema = z.object({
  sentiment: z.enum(['positive', 'neutral', 'negative']).describe('The sentiment of the inquiry.'),
  urgency: z.enum(['low', 'medium', 'high']).describe('The urgency of the inquiry.'),
  priorityScore: z.number().describe('A numerical score indicating the priority of the inquiry (higher is more important).'),
  reason: z.string().describe('Explanation for the assigned priority score.'),
});
export type PrioritizeInquiryOutput = z.infer<typeof PrioritizeInquiryOutputSchema>;

export async function prioritizeInquiry(input: PrioritizeInquiryInput): Promise<PrioritizeInquiryOutput> {
  return prioritizeInquiryFlow(input);
}

const prioritizeInquiryPrompt = ai.definePrompt({
  name: 'prioritizeInquiryPrompt',
  input: {schema: PrioritizeInquiryInputSchema},
  output: {schema: PrioritizeInquiryOutputSchema},
  prompt: `You are an AI expert in customer service, skilled at evaluating customer inquiries and determining the appropriate priority level.

  Analyze the following customer inquiry and determine its sentiment (positive, neutral, or negative), urgency (low, medium, or high), and assign a priority score (a number between 1 and 10, with 10 being the highest priority).
  Also explain the reasoning behind the assigned priority score.

  Inquiry: {{{inquiry}}}

  Respond with the sentiment, urgency, priority score, and reason in a JSON format.
  `,
});

const prioritizeInquiryFlow = ai.defineFlow(
  {
    name: 'prioritizeInquiryFlow',
    inputSchema: PrioritizeInquiryInputSchema,
    outputSchema: PrioritizeInquiryOutputSchema,
  },
  async (input): Promise<PrioritizeInquiryOutput> => {
    try {
      const {output} = await prioritizeInquiryPrompt(input);
      if (!output) {
        console.error("AI prompt returned no output for prioritizeInquiryFlow.");
        return {
          sentiment: 'neutral',
          urgency: 'low',
          priorityScore: 0,
          reason: "AI Assistant could not determine priority at this time. Please try again.",
        };
      }
      return output;
    } catch (error: any) {
      console.error("Error in prioritizeInquiryFlow:", error);
      let userFriendlyReason = "AI Assistant encountered an unexpected error. Priority could not be determined.";
      if (error.message && error.message.includes('[429 Too Many Requests]')) {
        userFriendlyReason = "AI Assistant is temporarily unavailable due to high demand (rate limit exceeded). Priority could not be determined at this time.";
      }
      return {
        sentiment: 'neutral',
        urgency: 'low',
        priorityScore: 0,
        reason: userFriendlyReason,
      };
    }
  }
);

