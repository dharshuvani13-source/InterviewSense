'use server';
/**
 * @fileOverview This flow handles voice-based AI assistant queries, converting speech to text, processing with Gemini AI to generate structured answers, and converting the answer back to speech.
 *
 * - voiceAssistantQuery - A function that processes a user's spoken question and returns a structured text response along with its audio.
 * - VoiceAssistantQueryInput - The input type for the voiceAssistantQuery function.
 * - VoiceAssistantQueryOutput - The return type for the voiceAssistantQuery function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/google-genai';

// Input Schema: The user's question as a string
const VoiceAssistantQueryInputSchema = z.object({
  question: z.string().describe('The user’s question to the AI assistant.'),
});
export type VoiceAssistantQueryInput = z.infer<typeof VoiceAssistantQueryInputSchema>;

// Output Schema for the text content from the AI (before TTS)
const VoiceAssistantTextOutputSchema = z.object({
  title: z.string().describe('A concise title for the answer.'),
  explanation: z.string().describe('A detailed explanation of the concept or answer.'),
  example: z.string().describe('A relevant example, sample answer, or code snippet related to the explanation.'),
  keyTips: z.array(z.string()).describe('A list of key tips or optimization suggestions.'),
});

// Final Output Schema: Combines the text output with the audio data URI
const VoiceAssistantQueryOutputSchema = VoiceAssistantTextOutputSchema.extend({
  audio: z.string().describe("Base64 encoded audio in WAV format, representing the spoken AI response."),
});
export type VoiceAssistantQueryOutput = z.infer<typeof VoiceAssistantQueryOutputSchema>;

/**
 * Converts PCM audio data to WAV format.
 *
 * @param pcmData The PCM audio data buffer.
 * @param channels Number of audio channels (default: 1).
 * @param rate Sample rate in Hz (default: 24000).
 * @param sampleWidth Sample width in bytes (default: 2).
 * @returns A Promise that resolves with the base64 encoded WAV audio string.
 */
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

// Define the prompt for the AI to generate structured text responses
const voiceAssistantPrompt = ai.definePrompt({
  name: 'voiceAssistantPrompt',
  input: { schema: VoiceAssistantQueryInputSchema },
  output: { schema: VoiceAssistantTextOutputSchema },
  prompt: `You are an expert interview coach and technical assistant. Your goal is to provide concise, helpful, and structured answers to interview-related and programming questions.

Analyze the user's question and determine its primary domain (e.g., Technical, Programming, Aptitude, HR, Resume, Career, Soft skills, System design basics).

Based on the domain, generate a structured response including:
1. A concise Title for the answer.
2. A clear and detailed Explanation of the concept.
3. A relevant Example. This should be a sample answer for interview questions, or a code example for programming questions.
4. A list of Key Tips or optimization suggestions.

The output MUST be in JSON format matching the provided schema.

Question: {{{question}}}`,
});

// Define the Genkit flow
const voiceAssistantQueryFlow = ai.defineFlow(
  {
    name: 'voiceAssistantQueryFlow',
    inputSchema: VoiceAssistantQueryInputSchema,
    outputSchema: VoiceAssistantQueryOutputSchema,
  },
  async (input) => {
    // Step 1: Get the structured text response from the AI
    const { output: textResponse } = await voiceAssistantPrompt(input);

    if (!textResponse) {
      throw new Error('AI failed to generate a text response.');
    }

    // Concatenate the text parts for TTS
    const fullTextForSpeech = `Title: ${textResponse.title}. Explanation: ${textResponse.explanation}. Example: ${textResponse.example}. Key tips: ${textResponse.keyTips.join('. ')}.`;

    // Step 2: Convert the text response to speech using TTS model
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' }, // Or another suitable voice
          },
        },
      },
      prompt: fullTextForSpeech,
    });

    if (!media) {
      throw new Error('No audio media returned from TTS.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavAudioBase64 = await toWav(audioBuffer);

    // Step 3: Combine text response and audio into the final output
    return {
      ...textResponse,
      audio: 'data:audio/wav;base64,' + wavAudioBase64,
    };
  }
);

/**
 * Processes a user's spoken question and returns a structured text response along with its audio.
 * @param input The input containing the user's question.
 * @returns A structured AI response including title, explanation, example, key tips, and base64 encoded WAV audio.
 */
export async function voiceAssistantQuery(input: VoiceAssistantQueryInput): Promise<VoiceAssistantQueryOutput> {
  return voiceAssistantQueryFlow(input);
}
