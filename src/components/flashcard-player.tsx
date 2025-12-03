'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Vocabulary } from '@/lib/types';
import { Flashcard } from './flashcard';
import { Button } from './ui/button';
import { ArrowLeft, ArrowRight, Shuffle, RotateCw } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: number[]) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

interface FlashcardPlayerProps {
  vocabulary: Vocabulary[];
}

export default function FlashcardPlayer({ vocabulary }: FlashcardPlayerProps) {
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setShuffledIndices(shuffleArray([...Array(vocabulary.length).keys()]));
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [vocabulary]);

  const handleShuffle = useCallback(() => {
    setShuffledIndices(shuffleArray([...Array(vocabulary.length).keys()]));
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [vocabulary.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % vocabulary.length);
    setIsFlipped(false);
  }, [vocabulary.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + vocabulary.length) % vocabulary.length);
    setIsFlipped(false);
  }, [vocabulary.length]);
  
  const handleFlip = () => setIsFlipped((prev) => !prev);

  const currentCard = useMemo(() => {
    if (shuffledIndices.length > 0) {
      const cardIndex = shuffledIndices[currentIndex];
      return vocabulary[cardIndex];
    }
    return null;
  }, [currentIndex, shuffledIndices, vocabulary]);

  if (!currentCard) {
    return <div>Loading cards...</div>;
  }

  return (
    <TooltipProvider>
    <div className="w-full max-w-3xl" onClick={handleFlip} role="button" tabIndex={0} onKeyDown={(e) => e.key === ' ' && handleFlip()}>
      <Flashcard card={currentCard} isFlipped={isFlipped} />
      <div className="mt-6 flex items-center justify-center space-x-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); handlePrev(); }}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Previous Card</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Previous Card</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); handleFlip(); }}>
              <RotateCw className="h-4 w-4" />
              <span className="sr-only">Flip Card</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Flip Card</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); handleShuffle(); }}>
              <Shuffle className="h-4 w-4" />
              <span className="sr-only">Shuffle Deck</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Shuffle Deck</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); handleNext(); }}>
              <ArrowRight className="h-4 w-4" />
              <span className="sr-only">Next Card</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Next Card</p>
          </TooltipContent>
        </Tooltip>
      </div>
       <div className="text-center mt-4 text-sm text-muted-foreground">
        Card {currentIndex + 1} of {vocabulary.length}
      </div>
    </div>
    </TooltipProvider>
  );
}
