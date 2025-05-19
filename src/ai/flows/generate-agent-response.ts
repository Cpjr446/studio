
'use server';
/**
 * @fileOverview Generates a contextual and helpful response for a support agent.
 *
 * - generateAgentResponse - A function that generates a response.
 * - GenerateAgentResponseInput - The input type for the generateAgentResponse function.
 * - GenerateAgentResponseOutput - The return type for the generateAgentResponse function.
 */

import {ai} from '@/ai/genkit';
import {z}from 'genkit';

const GenerateAgentResponseInputSchema = z.object({
  inquiryThread: z.string().describe('The full customer inquiry thread, with messages clearly indicating sender (e.g., "Customer: ...", "Agent: ..."). Provide the most recent messages first if possible, but ensure the full context is available.'),
  customerName: z.string().optional().describe('The name of the customer for personalization.'),
});
export type GenerateAgentResponseInput = z.infer<typeof GenerateAgentResponseInputSchema>;

const GenerateAgentResponseOutputSchema = z.object({
  suggestedResponse: z.string().describe('A comprehensive, empathetic, and ready-to-use suggested response for the agent. This response should directly address the customer\'s issue based on the provided thread.'),
});
export type GenerateAgentResponseOutput = z.infer<typeof GenerateAgentResponseOutputSchema>;

export async function generateAgentResponse(input: GenerateAgentResponseInput): Promise<GenerateAgentResponseOutput> {
  return generateAgentResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAgentResponsePrompt',
  input: {schema: GenerateAgentResponseInputSchema},
  output: {schema: GenerateAgentResponseOutputSchema},
  prompt: `You are an expert AI Customer Support Assistant. Your primary goal is to help a human support agent by drafting a high-quality, helpful, empathetic, and comprehensive response to a customer inquiry.

  Analyze the entire customer inquiry thread provided below. Identify the customer's primary issue, question, or concern.
  {{#if customerName}}The customer's name is {{{customerName}}}. Use it to personalize the response if appropriate.{{/if}}

  Customer Inquiry Thread:
  {{{inquiryThread}}}

  Based on your analysis, draft a response that the agent can send to the customer. The response should:
  1. Directly address the customer's main point(s) from the latest messages in the context of the whole thread.
  2. Acknowledge the customer's situation and show empathy, especially if they seem frustrated or are facing a problem.
  3. Provide clear, actionable information, answers, solutions, or next steps.
  4. If essential information is missing from the inquiry that prevents you from giving a complete solution, politely and specifically ask for what's needed.
  5. Maintain a professional, friendly, and helpful tone. Avoid jargon where possible, or explain it if necessary.
  6. Do not suggest the customer "check the FAQ" or "look at our knowledge base" as a generic answer. If a specific piece of information from such a source is relevant, incorporate that information directly into your response.
  7. The response should be ready for the agent to send, possibly with minor edits.

  Generate only the suggested response text.
  `,
});

const generateAgentResponseFlow = ai.defineFlow(
  {
    name: 'generateAgentResponseFlow',
    inputSchema: GenerateAgentResponseInputSchema,
    outputSchema: GenerateAgentResponseOutputSchema,
  },
  async (input): Promise<GenerateAgentResponseOutput> => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        console.error("AI prompt returned no output for generateAgentResponseFlow.");
        return { suggestedResponse: "AI Assistant could not generate a response at this time. Please try again." };
      }
      return output;
    } catch (error: any) {
      console.error("Error in generateAgentResponseFlow:", error);
      let userFriendlyMessage = "AI Assistant encountered an unexpected error. Please try again or proceed manually.";
      if (error.message && error.message.includes('[429 Too Many Requests]')) {
        userFriendlyMessage = "AI Assistant is temporarily unavailable due to high demand (rate limit exceeded). Please check your API quota or try again later.";
      }
      return { suggestedResponse: userFriendlyMessage };
    }
  }
);
