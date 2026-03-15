'use server';
/**
 * @fileOverview Generates modern mock interview questions across an expanded set of technical domains.
 * Maintains a strict balance between conceptual (voice) and solving (technical/numeric) questions.
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
  type: z.enum(['conceptual', 'solving']).describe('The type of question: conceptual (voice answer) or solving (technical/coding/numeric answer).'),
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
  prompt: `You are an experienced industry interviewer at a top-tier firm. Generate a single professional interview question.

Maintain a strict 50/50 ratio between 'conceptual' and 'solving' questions across all sessions.
- 'conceptual': Focus on architecture, trade-offs, soft skills, or advanced theory. Answered via voice.
- 'solving': Focus on coding algorithms, debugging logic, or complex numeric/data calculations. Requires a solving board.

Current Era Domains & Focus:
- Data Scientist: Data analysis, ML models, statistical rigor.
- DevOps Engineer: CI/CD pipelines, deployment strategies, monitoring.
- Mobile App Developer: Android/iOS specific patterns, performance, UI lifecycle.
- Frontend Developer: React patterns, Web performance, UI architecture.
- Backend Developer: API design, database scaling, system architecture.
- QA / Test Engineer: Automation frameworks, testing strategies, edge-case analysis.
- UI/UX Designer: Design thinking, user experience flows, accessibility.
- Data Engineer: ETL pipelines, Big Data systems (Spark/Hadoop), data modeling.
- Machine Learning Engineer: Model deployment, feature engineering, MLOps.
- Blockchain Developer: Smart contracts, Web3 architecture, security.
- Game Developer: Game engines (Unity/Unreal), graphics optimization, physics logic.
- Embedded Systems Engineer: IoT, hardware-level coding, real-time constraints.

Selected Domain: {{#if domain}}{{{domain}}}{{else}}General Software Engineering{{/if}}

Provide a high-quality, relevant question that tests the candidate's professional boundaries.`,
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
