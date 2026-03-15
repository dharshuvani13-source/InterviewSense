'use server';
/**
 * @fileOverview Provides feedback on user answers, supporting both spoken text and code snippets.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const InterviewAnswerFeedbackInputSchema = z.object({
  question: z.string().describe('The interview question.'),
  userAnswer: z.string().optional().describe('The user\'s spoken answer.'),
  codeSnippet: z.string().optional().describe('The user\'s code or numeric solution.'),
  domain: z.string().describe('The interview domain.'),
});
export type InterviewAnswerFeedbackInput = z.infer<typeof InterviewAnswerFeedbackInputSchema>;

const InterviewAnswerFeedbackOutputSchema = z.object({
  clarityFeedback: z.string().describe('Feedback on clarity.'),
  technicalAccuracyFeedback: z.string().describe('Feedback on technical correctness.'),
  improvementSuggestions: z.array(z.string()).describe('List of suggestions.'),
  confidenceAssessment: z.string().describe('Assessment of confidence.'),
  overallScore: z.number().int().min(0).max(10).describe('Score out of 10.'),
});
export type InterviewAnswerFeedbackOutput = z.infer<typeof InterviewAnswerFeedbackOutputSchema>;

export async function aiInterviewAnswerFeedback(input: InterviewAnswerFeedbackInput): Promise<InterviewAnswerFeedbackOutput> {
  return aiInterviewAnswerFeedbackFlow(input);
}

const interviewAnswerFeedbackPrompt = ai.definePrompt({
  name: 'interviewAnswerFeedbackPrompt',
  input: { schema: InterviewAnswerFeedbackInputSchema },
  output: { schema: InterviewAnswerFeedbackOutputSchema },
  prompt: `You are an expert interview coach. Evaluate the following response.

Domain: {{{domain}}}
Question: {{{question}}}
Spoken Answer: {{#if userAnswer}}{{{userAnswer}}}{{else}}N/A{{/if}}
Code/Solution: {{#if codeSnippet}}{{{codeSnippet}}}{{else}}N/A{{/if}}

Provide structured feedback including clarity, technical accuracy, and specific improvements.`,
});

const aiInterviewAnswerFeedbackFlow = ai.defineFlow(
  {
    name: 'aiInterviewAnswerFeedbackFlow',
    inputSchema: InterviewAnswerFeedbackInputSchema,
    outputSchema: InterviewAnswerFeedbackOutputSchema,
  },
  async (input) => {
    const { output } = await interviewAnswerFeedbackPrompt(input);
    return output!;
  }
);
