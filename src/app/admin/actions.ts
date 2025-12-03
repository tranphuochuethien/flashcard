'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { addVocabulary, deleteVocabulary, updateVocabulary, addManyVocabulary } from '@/lib/data';
import { enhanceItContextNote, EnhanceItContextNoteInput } from '@/ai/flows/ai-note-enhancement';
import type { Vocabulary } from '@/lib/types';
import Papa from 'papaparse';

const vocabSchema = z.object({
  kanji: z.string().min(1, 'Kanji is required.'),
  hiragana: z.string().min(1, 'Hiragana is required.'),
  hanViet: z.string().min(1, 'Han Viet is required.'),
  vietnameseMeaning: z.string().min(1, 'Vietnamese meaning is required.'),
  itContext: z.string().optional(),
});

export type FormState = {
  message: string;
  errors?: Record<string, string[] | undefined>;
  success: boolean;
};

export async function addVocabularyAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = vocabSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your input.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    await addVocabulary(validatedFields.data);
    revalidatePath('/admin');
    revalidatePath('/');
    return { message: 'Vocabulary added successfully!', success: true };
  } catch (error) {
    return { message: 'Failed to add vocabulary.', success: false };
  }
}

export async function updateVocabularyAction(
  id: number,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  if (!id) return { message: 'ID is missing.', success: false };
  
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = vocabSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your input.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    const result = await updateVocabulary(id, validatedFields.data);
    if (!result) throw new Error('Vocabulary not found');
    revalidatePath('/admin');
    revalidatePath('/');
    return { message: 'Vocabulary updated successfully!', success: true };
  } catch (error) {
    return { message: 'Failed to update vocabulary.', success: false };
  }
}


export async function deleteVocabularyAction(id: number) {
  try {
    await deleteVocabulary(id);
    revalidatePath('/admin');
    revalidatePath('/');
    return { message: 'Vocabulary deleted successfully.', success: true };
  } catch (error) {
    return { message: 'Failed to delete vocabulary.', success: false };
  }
}


export async function enhanceNoteAction(input: EnhanceItContextNoteInput) {
  try {
    const result = await enhanceItContextNote(input);
    return { success: true, enhancedNote: result.enhancedNote };
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to enhance note with AI." };
  }
}

const csvVocabSchema = z.object({
    kanji: z.string(),
    hiragana: z.string(),
    hanViet: z.string(),
    vietnameseMeaning: z.string(),
    itContext: z.string().optional(),
});

type CsvVocab = z.infer<typeof csvVocabSchema>;

export async function importFromCsvAction(prevState: { success: boolean; message: string; }, formData: FormData) {
  const file = formData.get('csvFile') as File | null;

  if (!file) {
    return { success: false, message: 'No file uploaded.' };
  }

  if (file.type !== 'text/csv') {
    return { success: false, message: 'Invalid file type. Please upload a CSV file.' };
  }

  const fileText = await file.text();

  return new Promise((resolve) => {
    Papa.parse<CsvVocab>(fileText, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const validatedData = z.array(csvVocabSchema).safeParse(results.data);
          
          if (!validatedData.success) {
            console.error("CSV validation error:", validatedData.error);
            resolve({ success: false, message: 'CSV data is invalid. Check columns and content.' });
            return;
          }

          if (validatedData.data.length === 0) {
            resolve({ success: false, message: 'CSV file is empty or contains no valid data.' });
            return;
          }

          const count = await addManyVocabulary(validatedData.data);
          revalidatePath('/admin');
          revalidatePath('/');
          resolve({ success: true, message: `Successfully imported ${count} records.` });
        } catch (error) {
          console.error("Import error:", error);
          resolve({ success: false, message: 'Failed to import records from CSV.' });
        }
      },
      error: (error) => {
        console.error("PapaParse error:", error);
        resolve({ success: false, message: 'Failed to parse CSV file.' });
      },
    });
  });
}
