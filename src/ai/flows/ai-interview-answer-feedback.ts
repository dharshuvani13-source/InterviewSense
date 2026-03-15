'use server';
/**
 * @fileOverview This file implements a Genkit flow for providing detailed AI feedback on a user's
 * spoken answer during a mock interview. It evaluates clarity, technical accuracy,
 * provides improvement suggestions, and assesses confidence.
 *
 * - aiInterviewAnswerFeedback - A function that handles the interview answer feedback process.
 * - InterviewAnswerFeedbackInput - The input type for the aiInterviewAnswerFeedback function.
 * - InterviewAnswerFeedbackOutput - The return type for the aiInterviewAnswerFeedback function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const InterviewAnswerFeedbackInputSchema = z.object({
  question: z.string().describe('The interview question posed by the AI.'),
  userAnswer: z.string().describe('The user\u0027s spoken answer to the question, converted to text.'),
  domain: z.string().describe('The domain of the interview (e.g., \u0027Software developer\u0027, \u0027HR interview\u0027). This helps contextualize the feedback.'),
});
export type InterviewAnswerFeedbackInput = z.infer<typeof InterviewAnswerFeedbackInputSchema>;

const InterviewAnswerFeedbackOutputSchema = z.object({
  clarityFeedback: z.string().describe('Detailed feedback on the clarity and structure of the user\u0027s answer.'),
  technicalAccuracyFeedback: z.string().describe('Detailed feedback on the technical correctness and factual accuracy of the user\u0027s answer.'),
  improvementSuggestions: z.array(z.string()).describe('A list of actionable suggestions for improving the answer.'),
  confidenceAssessment: z.string().describe('An assessment of the user\u0027s perceived confidence based on their phrasing and answer structure.'),
  overallScore: z.number().int().min(0).max(10).describe('An overall score for the answer, out of 10.'),
});
export type InterviewAnswerFeedbackOutput = z.infer<typeof InterviewAnswerFeedbackOutputSchema>;

export async function aiInterviewAnswerFeedback(input: InterviewAnswerFeedbackInput): Promise<InterviewAnswerFeedbackOutput> {
  return aiInterviewAnswerFeedbackFlow(input);
}

const interviewAnswerFeedbackPrompt = ai.definePrompt({
  name: 'interviewAnswerFeedbackPrompt',
  input: { schema: InterviewAnswerFeedbackInputSchema },
  output: { schema: InterviewAnswerFeedbackOutputSchema },
  prompt: `You are an expert interview coach and evaluator. Your task is to provide constructive and detailed feedback on a user's answer to an interview question.

Here is the context:
Interview Domain: {{{domain}}}
Interview Question: {{{question}}}
User's Answer: {{{userAnswer}}}

Evaluate the user's answer strictly based on the provided question, answer, and domain. Provide feedback on the following aspects, ensuring your response is structured exactly according to the output schema:

1.  **Clarity and Structure (clarityFeedback)**: Comment on how clear, concise, and well-organized the answer was. Was it easy to understand? Did it flow logically?
2.  **Technical Accuracy (technicalAccuracyFeedback)**: For technical questions, evaluate the correctness of the information. For behavioral or HR questions, assess if the answer appropriately addresses the prompt and demonstrates relevant skills/experiences accurately.
3.  **Improvement Suggestions (improvementSuggestions)**: Provide specific, actionable tips to improve the answer. Think about content, structure, phrasing, and completeness. Give suggestions as a list of distinct points.
4.  **Confidence Assessment (confidenceAssessment)**: Based on the phrasing, certainty in statements, and completeness of the answer, provide an assessment of how confident the user appeared.
5.  **Overall Score (overallScore)**: Assign an overall score out of 10 for the answer, where 10 is excellent and 0 is completely off-topic or incorrect. Only return the number.

Ensure the output is valid JSON matching the schema and contains no additional commentary outside the JSON block.`,
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
