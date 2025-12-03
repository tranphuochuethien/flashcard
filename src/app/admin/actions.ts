'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { addVocabulary, deleteVocabulary, updateVocabulary, addManyVocabulary } from '@/lib/data';
import { enhanceItContextNote, EnhanceItContextNoteInput } from '@/ai/flows/ai-note-enhancement';
import type { Vocabulary } from '@/lib/types';

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
  id: string,
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


export async function deleteVocabularyAction(id: string) {
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

export async function importFromCsvAction(formData: FormData) {
  const file = formData.get('csvFile') as File | null;

  if (!file) {
    return { success: false, message: 'No file uploaded.' };
  }
  
  // In a real application, you would parse the CSV file here
  // and insert the data into your database.
  // We will simulate this with a few sample entries.
  console.log("Simulating CSV import for file:", file.name);

  // Example placeholder logic:
  const sampleData: Omit<Vocabulary, 'id' | 'createdAt'>[] = [
    {
      kanji: "認証",
      hiragana: "にんしょう",
      hanViet: "Nhận Chứng",
      vietnameseMeaning: "Xác thực, chứng thực",
      itContext: "Authentication, e.g., ユーザー認証 (user authentication)."
    },
    {
      kanji: "承認",
      hiragana: "しょうにん",
      hanViet: "Thừa Nhận",
      vietnameseMeaning: "Phê duyệt, cho phép",
      itContext: "Authorization, e.g., アクセス承認 (access authorization)."
    }
  ];

  try {
    const count = await addManyVocabulary(sampleData);
    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true, message: `Successfully imported ${count} records (simulated).` };
  } catch (error) {
    return { success: false, message: 'Failed to import records.' };
  }
}
