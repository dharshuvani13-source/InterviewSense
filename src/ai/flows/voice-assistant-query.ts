'use server';
/**
 * @fileOverview This flow handles voice-based AI assistant queries.
 * Optimized for high-speed, precise responses with concise structure.
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
  explanation: z.string().describe('A direct and brief explanation.'),
  example: z.string().describe('A short code snippet or single-sentence example.'),
  keyTips: z.array(z.string()).describe('Exactly 3 critical tips.'),
});

const VoiceAssistantQueryOutputSchema = VoiceAssistantTextOutputSchema.extend({
  audio: z.string().describe("Base64 encoded audio in WAV format."),
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
  prompt: `You are a high-speed technical assistant. Provide ultra-concise, precise answers. 

Rules:
- Title: 2-4 words maximum.
- Explanation: Exactly 2 sentences.
- Example: Very short code or practical scenario.
- Key Tips: Provide exactly 3 bullet points.

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
      throw new Error('AI failed to generate a response.');
    }

    const fullTextForSpeech = `${textResponse.title}. ${textResponse.explanation}. Tips: ${textResponse.keyTips.join('. ')}`;

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
      throw new Error('No audio returned.');
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
