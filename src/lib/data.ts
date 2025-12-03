// This is a mock database. In a real application, you would use a proper database.
import type { Vocabulary } from './types';
import { randomUUID } from 'crypto';

let vocabulary: Vocabulary[] = [
  {
    id: '1',
    kanji: '開発',
    hiragana: 'かいはつ',
    hanViet: 'Khai Phát',
    vietnameseMeaning: 'Phát triển',
    itContext: 'Thường dùng trong "software development" (ソフトウェア開発) - phát triển phần mềm.',
    createdAt: new Date('2023-10-27T10:00:00Z').toISOString(),
  },
  {
    id: '2',
    kanji: '環境',
    hiragana: 'かんきょう',
    hanViet: 'Hoàn Cảnh',
    vietnameseMeaning: 'Môi trường',
    itContext: 'Chỉ môi trường phát triển (development environment - 開発環境), môi trường production (本番環境).',
    createdAt: new Date('2023-10-27T10:05:00Z').toISOString(),
  },
  {
    id: '3',
    kanji: '変数',
    hiragana: 'へんすう',
    hanViet: 'Biến Số',
    vietnameseMeaning: 'Biến số',
    itContext: 'Dùng để chỉ các biến trong lập trình (programming variable).',
    createdAt: new Date('2023-10-27T10:10:00Z').toISOString(),
  },
  {
    id: '4',
    kanji: '関数',
    hiragana: 'かんすう',
    hanViet: 'Hàm Số',
    vietnameseMeaning: 'Hàm, function',
    itContext: 'Chỉ các function trong lập trình.',
    createdAt: new Date('2023-10-27T10:15:00Z').toISOString(),
  },
  {
    id: '5',
    kanji: '配列',
    hiragana: 'はいれつ',
    hanViet: 'Bài Liệt',
    vietnameseMeaning: 'Mảng',
    itContext: 'Chỉ array trong các cấu trúc dữ liệu.',
    createdAt: new Date('2023-10-27T10:20:00Z').toISOString(),
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getVocabulary(): Promise<Vocabulary[]> {
  await delay(100);
  return vocabulary.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getVocabularyById(id: string): Promise<Vocabulary | undefined> {
  await delay(100);
  return vocabulary.find(v => v.id === id);
}

export async function addVocabulary(
  data: Omit<Vocabulary, 'id' | 'createdAt'>
): Promise<Vocabulary> {
  await delay(100);
  const newVocab: Vocabulary = {
    ...data,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  vocabulary.unshift(newVocab);
  return newVocab;
}

export async function updateVocabulary(
  id: string,
  data: Partial<Omit<Vocabulary, 'id' | 'createdAt'>>
): Promise<Vocabulary | null> {
  await delay(100);
  const index = vocabulary.findIndex(v => v.id === id);
  if (index === -1) {
    return null;
  }
  vocabulary[index] = { ...vocabulary[index], ...data };
  return vocabulary[index];
}

export async function deleteVocabulary(id: string): Promise<boolean> {
  await delay(100);
  const initialLength = vocabulary.length;
  vocabulary = vocabulary.filter(v => v.id !== id);
  return vocabulary.length < initialLength;
}

export async function addManyVocabulary(data: Omit<Vocabulary, 'id' | 'createdAt'>[]): Promise<number> {
  await delay(500);
  const newVocabs = data.map(item => ({
    ...item,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  }));
  vocabulary.unshift(...newVocabs);
  return newVocabs.length;
}
