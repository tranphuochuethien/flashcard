'use client';

import { Vocabulary } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FlashcardProps {
  card: Vocabulary;
  isFlipped: boolean;
}

export function Flashcard({ card, isFlipped }: FlashcardProps) {
  return (
    <div
      className="group w-full max-w-xl rounded-lg [perspective:1000px] min-h-80"
      aria-live="polite"
    >
      <div
        className={cn(
            "relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]",
            isFlipped && "[transform:rotateY(180deg)]"
        )}
      >
        {/* Front of the card */}
        <div className="absolute w-full h-full rounded-lg border bg-card text-card-foreground shadow-sm [backface-visibility:hidden]">
          <div className="flex h-full flex-col items-center justify-center text-center p-6">
              <p className="text-5xl font-bold font-headline md:text-7xl">{card.kanji}</p>
              <p className="mt-4 text-2xl text-muted-foreground">{card.hiragana}</p>
          </div>
        </div>

        {/* Back of the card */}
        <div className="absolute w-full h-full rounded-lg border bg-card text-card-foreground shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="flex h-full flex-col p-6">
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <p className="text-3xl font-bold font-headline md:text-5xl">{card.vietnameseMeaning}</p>
              <p className="mt-2 text-xl text-muted-foreground">{card.hanViet}</p>
            </div>
            {card.itContext && (
              <div className="mt-4 flex-shrink-0 w-full">
                  <div className="text-left text-sm text-accent-foreground max-h-32 overflow-y-auto rounded-md border bg-accent/50 p-4">
                      <p className="font-bold mb-2">IT Context:</p>
                      <p className="whitespace-pre-wrap">{card.itContext}</p>
                  </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
