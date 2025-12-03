import 'server-only';
import { db } from './db';
import { vocabulary } from './db/schema';
import type { Vocabulary } from './types';
import { eq, desc } from 'drizzle-orm';

export async function getVocabulary(): Promise<Vocabulary[]> {
  const data = await db.select().from(vocabulary).orderBy(desc(vocabulary.createdAt));
  return data;
}

export async function getVocabularyById(id: number): Promise<Vocabulary | undefined> {
  const data = await db.select().from(vocabulary).where(eq(vocabulary.id, id));
  return data[0];
}

export async function addVocabulary(
  data: Omit<Vocabulary, 'id' | 'createdAt'>
): Promise<Vocabulary[]> {
   const result = await db.insert(vocabulary).values({
    ...data,
    createdAt: new Date().toISOString(),
  }).returning();
  return result;
}

export async function updateVocabulary(
  id: number,
  data: Partial<Omit<Vocabulary, 'id' | 'createdAt'>>
): Promise<Vocabulary[] | null> {
  const result = await db.update(vocabulary).set(data).where(eq(vocabulary.id, id)).returning();
  if (result.length === 0) {
    return null;
  }
  return result;
}

export async function deleteVocabulary(id: number): Promise<boolean> {
    const result = await db.delete(vocabulary).where(eq(vocabulary.id, id)).returning();
    return result.length > 0;
}

export async function addManyVocabulary(data: Omit<Vocabulary, 'id' | 'createdAt'>[]): Promise<number> {
    const newVocabs = data.map(item => ({
        ...item,
        createdAt: new Date().toISOString(),
    }));

    if (newVocabs.length === 0) return 0;

    const result = await db.insert(vocabulary).values(newVocabs).returning();
    return result.length;
}