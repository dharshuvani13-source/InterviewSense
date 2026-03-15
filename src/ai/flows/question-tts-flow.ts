'use server';
/**
 * @fileOverview A simple TTS flow to convert interview questions to speech.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/google-genai';

const QuestionTTSInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
});

const QuestionTTSOutputSchema = z.object({
  audio: z.string().describe('Base64 encoded audio in WAV format.'),
});

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

export async function questionTTS(text: string): Promise<string> {
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
    prompt: text,
  });

  if (!media) throw new Error('No audio returned');

  const audioBuffer = Buffer.from(
    media.url.substring(media.url.indexOf(',') + 1),
    'base64'
  );

  const wavAudioBase64 = await toWav(audioBuffer);
  return 'data:audio/wav;base64,' + wavAudioBase64;
}
