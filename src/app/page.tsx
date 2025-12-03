import { getVocabulary } from '@/lib/data';
import FlashcardPlayer from '@/components/flashcard-player';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function Home() {
  const vocabulary = await getVocabulary();

  if (vocabulary.length === 0) {
    return (
      <div className="container mx-auto flex h-[calc(100vh-4rem)] items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Welcome to Nihongo Flash!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>You don't have any vocabulary words yet.</p>
            <p>Go to the admin panel to add some words and start learning.</p>
            <Button asChild>
              <Link href="/admin">Go to Admin Panel</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex h-[calc(100vh-4rem)] items-center justify-center p-4">
      <FlashcardPlayer vocabulary={vocabulary} />
    </div>
  );
}
