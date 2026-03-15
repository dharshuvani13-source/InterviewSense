'use server';
/**
 * @fileOverview This flow handles voice-based AI assistant queries, converting speech to text, 
 * processing with Gemini AI to generate structured answers, and converting the answer back to speech.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/google-genai';

const VoiceAssistantQueryInputSchema = z.object({
  question: z.string().describe('The user’s question to the AI assistant.'),
});
export type VoiceAssistantQueryInput = z.infer<typeof VoiceAssistantQueryInputSchema>;

const VoiceAssistantTextOutputSchema = z.object({
  title: z.string().describe('A concise title for the answer.'),
  explanation: z.string().describe('A detailed explanation of the concept or answer.'),
  example: z.string().describe('A relevant example, sample answer, or code snippet related to the explanation.'),
  keyTips: z.array(z.string()).describe('A list of key tips or optimization suggestions.'),
});

const VoiceAssistantQueryOutputSchema = VoiceAssistantTextOutputSchema.extend({
  audio: z.string().describe("Base64 encoded audio in WAV format, representing the spoken AI response."),
});
export type VoiceAssistantQueryOutput = z.infer<typeof VoiceAssistantQueryOutputSchema>;

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

const voiceAssistantPrompt = ai.definePrompt({
  name: 'voiceAssistantPrompt',
  input: { schema: VoiceAssistantQueryInputSchema },
  output: { schema: VoiceAssistantTextOutputSchema },
  prompt: `You are an expert interview coach and technical assistant. Your goal is to provide concise, helpful, and structured answers to interview-related and programming questions.

Analyze the user's question and provide:
1. A concise Title.
2. A clear and detailed Explanation.
3. A relevant Example or Sample Answer.
4. A list of Key Tips.

Question: {{{question}}}`,
});

const voiceAssistantQueryFlow = ai.defineFlow(
  {
    name: 'voiceAssistantQueryFlow',
    inputSchema: VoiceAssistantQueryInputSchema,
    outputSchema: VoiceAssistantQueryOutputSchema,
  },
  async (input) => {
    const { output: textResponse } = await voiceAssistantPrompt(input);

    if (!textResponse) {
      throw new Error('AI failed to generate a text response.');
    }

    const fullTextForSpeech = `Title: ${textResponse.title}. Explanation: ${textResponse.explanation}. Example: ${textResponse.example}. Key tips: ${textResponse.keyTips.join('. ')}.`;

    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
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

    return {
      ...textResponse,
      audio: 'data:audio/wav;base64,' + wavAudioBase64,
    };
  }
);

export async function voiceAssistantQuery(input: VoiceAssistantQueryInput): Promise<VoiceAssistantQueryOutput> {
  return voiceAssistantQueryFlow(input);
}
