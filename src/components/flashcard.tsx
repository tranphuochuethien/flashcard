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
      className={cn(
        'group w-full max-w-xl rounded-lg border bg-card text-card-foreground shadow-sm [perspective:1000px] min-h-80',
        { 'flipped': isFlipped }
      )}
      aria-live="polite"
    >
      <div
        className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d]"
        style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Front of the card */}
        <div className="absolute flex h-full w-full flex-col items-center justify-center p-6 [backface-visibility:hidden]">
          <div className="text-center">
            <p className="text-5xl font-bold font-headline md:text-7xl">{card.kanji}</p>
            <p className="mt-4 text-2xl text-muted-foreground">{card.hiragana}</p>
          </div>
          <span className="absolute bottom-4 text-xs text-muted-foreground">
            Japanese
          </span>
        </div>

        {/* Back of the card */}
        <div className="absolute flex h-full w-full flex-col p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
           {/* Main content area */}
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-3xl font-bold font-headline md:text-5xl">{card.vietnameseMeaning}</p>
            <p className="mt-2 text-xl text-muted-foreground">{card.hanViet}</p>
          </div>
          
          {/* IT Context area */}
          {card.itContext && (
            <div className="mt-4 flex-shrink-0">
                <div className="text-left text-sm text-accent-foreground max-h-32 overflow-y-auto rounded-md border bg-accent/50 p-4">
                    <p className="font-bold mb-2">IT Context:</p>
                    <p className="whitespace-pre-wrap">{card.itContext}</p>
                </div>
            </div>
          )}

          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
            Vietnamese
          </span>
        </div>
      </div>
    </div>
  );
}
