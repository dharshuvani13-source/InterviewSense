'use server';
/**
 * @fileOverview Generates modern mock interview questions across expanded domains.
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
  prompt: `You are an experienced industry interviewer. Generate a single professional interview question.

Maintain a strict 50/50 ratio between 'conceptual' and 'solving' questions.
- 'conceptual': Focus on architecture, trade-offs, soft skills, or advanced theory. Answered via voice.
- 'solving': Focus on coding algorithms, debugging logic, or complex numeric calculations. Requires a solving board.

Current Era Domains:
- AI Engineer: LLMs, prompt engineering, vector DBs.
- Cloud Architect: AWS/Azure/GCP, scalability, serverless.
- Cybersecurity: Zero trust, encryption, vulnerability analysis.
- Full Stack: Next.js, performance, React patterns.
- Product Manager (Tech): System trade-offs, roadmap logic.

Selected Domain: {{#if domain}}{{{domain}}}{{else}}General Software Engineering{{/if}}

Provide high-quality, relevant questions that a real mentor would ask to test boundaries.`,
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
