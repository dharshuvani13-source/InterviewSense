'use server';
/**
 * @fileOverview Provides humanized, mentor-like feedback on user answers.
 * Adopts a moderate but firm professional tone.
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
  clarityFeedback: z.string().describe('Feedback on clarity and communication style.'),
  technicalAccuracyFeedback: z.string().describe('Feedback on technical correctness and depth.'),
  improvementSuggestions: z.array(z.string()).describe('Actionable mentor advice for improvement.'),
  confidenceAssessment: z.string().describe('Assessment of verbal confidence and delivery.'),
  overallScore: z.number().int().min(0).max(10).describe('Score out of 10 (Moderate-Strict evaluation).'),
});
export type InterviewAnswerFeedbackOutput = z.infer<typeof InterviewAnswerFeedbackOutputSchema>;

export async function aiInterviewAnswerFeedback(input: InterviewAnswerFeedbackInput): Promise<InterviewAnswerFeedbackOutput> {
  return aiInterviewAnswerFeedbackFlow(input);
}

const interviewAnswerFeedbackPrompt = ai.definePrompt({
  name: 'interviewAnswerFeedbackPrompt',
  input: { schema: InterviewAnswerFeedbackInputSchema },
  output: { schema: InterviewAnswerFeedbackOutputSchema },
  prompt: `You are a Senior Technical Lead and a moderate yet firm Mentor. 
Evaluate the following interview response with the standard expected in a top-tier firm (e.g., Google, Amazon).

Role/Domain: {{{domain}}}
Question: {{{question}}}
Spoken Answer: {{#if userAnswer}}{{{userAnswer}}}{{else}}N/A{{/if}}
Code/Solution: {{#if codeSnippet}}{{{codeSnippet}}}{{else}}N/A{{/if}}

Your Persona:
- Not overly liberal: Don't give high scores for effort if the technical depth is missing.
- Not excessively strict: Acknowledge good communication and correct logic even if a minor detail is missed.
- Moderate & Professional: Be human. Use phrases like "In a real interview, this would..." or "You correctly identified X, but a stronger candidate would mention Y."

Guidelines:
1. Evaluate 'Clarity': Did they ramble? Was the structure logical?
2. Evaluate 'Technical Accuracy': Is the code/answer correct? Is it optimized?
3. Provide 'Expert Advice': Exactly 3-4 points on how to sound more like a senior professional.
4. Score: Be realistic. 8/10 is excellent. 5/10 is a 'Maybe'. 3/10 is a 'Reject'.`,
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
