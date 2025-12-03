'use server';
/**
 * @fileOverview AI-powered IT context note enhancement for Japanese vocabulary entries.
 *
 * - enhanceItContextNote - An asynchronous function to enhance IT context notes for vocabulary entries.
 * - EnhanceItContextNoteInput - The input type for the enhanceItContextNote function.
 * - EnhanceItContextNoteOutput - The output type for the enhanceItContextNote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceItContextNoteInputSchema = z.object({
  kanji: z.string().describe('The Kanji form of the Japanese word.'),
  hiragana: z.string().describe('The Hiragana form of the Japanese word.'),
  hanViet: z.string().describe('The Sino-Vietnamese reading of the word.'),
  vietnameseMeaning: z.string().describe('The Vietnamese meaning of the word.'),
  existingNote: z.string().optional().describe('The existing IT context note, if any.'),
});
export type EnhanceItContextNoteInput = z.infer<typeof EnhanceItContextNoteInputSchema>;

const EnhanceItContextNoteOutputSchema = z.object({
  enhancedNote: z.string().describe('The enhanced IT context note.'),
});
export type EnhanceItContextNoteOutput = z.infer<typeof EnhanceItContextNoteOutputSchema>;

export async function enhanceItContextNote(input: EnhanceItContextNoteInput): Promise<EnhanceItContextNoteOutput> {
  return enhanceItContextNoteFlow(input);
}

const enhanceItContextNotePrompt = ai.definePrompt({
  name: 'enhanceItContextNotePrompt',
  input: {schema: EnhanceItContextNoteInputSchema},
  output: {schema: EnhanceItContextNoteOutputSchema},
  prompt: `You are a helpful assistant specializing in Japanese IT terminology.

  Given a Japanese word and its existing IT context note (if any), your task is to enhance or suggest a new IT context note that aids in understanding and recall.
  The enhanced note should be clear, concise, and relevant to the IT field.

  Kanji: {{{kanji}}}
  Hiragana: {{{hiragana}}}
  Han Viet: {{{hanViet}}}
  Vietnamese Meaning: {{{vietnameseMeaning}}}
  Existing Note: {{{existingNote}}}

  Enhanced IT Context Note:`,
});

const enhanceItContextNoteFlow = ai.defineFlow(
  {
    name: 'enhanceItContextNoteFlow',
    inputSchema: EnhanceItContextNoteInputSchema,
    outputSchema: EnhanceItContextNoteOutputSchema,
  },
  async input => {
    const {output} = await enhanceItContextNotePrompt(input);
    return output!;
  }
);
