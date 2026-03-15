'use server';
/**
 * @fileOverview This flow generates a single mock interview question based on a specified or auto-detected domain.
 *
 * - generateMockInterviewQuestion - A function that handles the generation of a mock interview question.
 * - GenerateMockInterviewQuestionInput - The input type for the generateMockInterviewQuestion function.
 * - GenerateMockInterviewQuestionOutput - The return type for the generateMockInterviewQuestion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateMockInterviewQuestionInputSchema = z.object({
  domain: z
    .string()
    .optional()
    .describe(
      'The domain for which to generate an interview question (e.g., "Software Developer", "HR Interview"). If not provided, the AI will infer a suitable domain.'
    ),
});
export type GenerateMockInterviewQuestionInput = z.infer<
  typeof GenerateMockInterviewQuestionInputSchema
>;

const GenerateMockInterviewQuestionOutputSchema = z.object({
  question: z.string().describe('The mock interview question generated.'),
  domain: z
    .string()
    .describe('The domain this question belongs to (e.g., "Software Developer", "Programming").'),
  skillAssessed: z
    .string()
    .describe(
      'The primary skill this question aims to assess (e.g., "Data Structures", "Problem Solving", "Behavioral", "Communication").'
    ),
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The difficulty level of the question.'),
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
  prompt: `You are an experienced interviewer from a top tech company. Your task is to generate a single, relevant interview question for a mock interview session.
The question should be concise and designed to assess specific skills.

If a domain is provided ({{#if domain}}{{{domain}}}{{else}}not specified{{/if}}), tailor the question to that domain. If no domain is provided, choose a common interview domain like 'Software Developer' or 'HR Interview' and generate a relevant question.

Based on the provided domain (or a suitable inferred domain), generate one interview question, identify the primary skill it assesses, and assign a difficulty level.

Strictly return a JSON object with the following structure:
{{jsonSchema outputSchema}}`,
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
