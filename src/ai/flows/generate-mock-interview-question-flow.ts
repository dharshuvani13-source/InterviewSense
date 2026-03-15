'use server';
/**
 * @fileOverview This flow generates a single mock interview question.
 * It now categorizes questions as 'conceptual' (voice-only) or 'solving' (code/numeric).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateMockInterviewQuestionInputSchema = z.object({
  domain: z
    .string()
    .optional()
    .describe('The domain (e.g., "Software Developer").'),
});
export type GenerateMockInterviewQuestionInput = z.infer<
  typeof GenerateMockInterviewQuestionInputSchema
>;

const GenerateMockInterviewQuestionOutputSchema = z.object({
  question: z.string().describe('The mock interview question generated.'),
  domain: z.string().describe('The domain this question belongs to.'),
  skillAssessed: z.string().describe('The primary skill assessed.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('Difficulty level.'),
  type: z.enum(['conceptual', 'solving']).describe('The type of question: conceptual (conceptual/behavioral) or solving (technical/coding/numeric).'),
  initialCode: z.string().optional().describe('Starter code or a template if it is a solving question.'),
});
export type GenerateMockInterviewQuestionOutput = z.infer<
  typeof GenerateMockInterviewQuestionOutputSchema
>;

export async function generateMockInterviewQuestion(
  input: GenerateMockInterviewQuestionInput
): Promise<GenerateMockInterviewQuestionOutput> {
  return generateMockInterviewQuestionFlow(input);
}

const generateMockInterviewQuestionPrompt = ai.definePrompt({
  name: 'generateMockInterviewQuestionPrompt',
  input: { schema: GenerateMockInterviewQuestionInputSchema },
  output: { schema: GenerateMockInterviewQuestionOutputSchema },
  prompt: `You are an experienced interviewer. Generate a single interview question.

Maintain a strict 50/50 ratio between 'conceptual' and 'solving' questions.
- 'conceptual': Focus on soft skills, architecture, or theoretical concepts. Answered via voice.
- 'solving': Focus on coding, debugging, or numeric calculations. Requires a solving board.

Domain: {{#if domain}}{{{domain}}}{{else}}General Software Engineering{{/if}}

Provide clear, professional questions. For 'solving' questions, provide a small snippet of code or a scenario in 'initialCode'.`,
});

const generateMockInterviewQuestionFlow = ai.defineFlow(
  {
    name: 'generateMockInterviewQuestionFlow',
    inputSchema: GenerateMockInterviewQuestionInputSchema,
    outputSchema: GenerateMockInterviewQuestionOutputSchema,
  },
  async (input) => {
    const { output } = await generateMockInterviewQuestionPrompt(input);
    return output!;
  }
);
