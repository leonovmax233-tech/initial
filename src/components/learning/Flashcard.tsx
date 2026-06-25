"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Lightbulb, Check, X } from 'lucide-react';
import { Word } from '../../types/learning';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface FlashcardProps {
  word: Word;
  onResult: (correct: boolean) => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ word, onResult }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full max-w-md mx-auto perspective-1000 h-[400px]">
      <motion.div
        className="relative w-full h-full transition-all duration-500 preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front Side */}
        <Card className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 bg-white shadow-xl border-2 border-primary/10 rounded-3xl">
          <span className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-widest">Term</span>
          <h2 className="text-4xl font-bold text-primary text-center mb-6">{word.original}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); speak(word.original); }}
            className="rounded-full hover:bg-primary/5"
          >
            <Volume2 className="w-6 h-6 text-primary" />
          </Button>
          <p className="mt-8 text-sm text-muted-foreground animate-pulse">Tap to flip</p>
        </Card>

        {/* Back Side */}
        <Card className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 bg-primary text-primary-foreground shadow-xl rounded-3xl rotate-y-180">
          <span className="text-sm font-medium opacity-70 mb-4 uppercase tracking-widest">Translation</span>
          <h2 className="text-4xl font-bold text-center mb-4">{word.translation}</h2>
          {word.pronunciation && <p className="text-lg opacity-80 mb-4">{word.pronunciation}</p>}
          {word.example && (
            <div className="bg-white/10 p-4 rounded-xl mt-4 max-w-xs">
              <p className="text-sm italic text-center">"{word.example}"</p>
            </div>
          )}
        </Card>
      </motion.div>

      <div className="flex justify-center gap-4 mt-8">
        <Button
          variant="outline"
          size="lg"
          onClick={() => onResult(false)}
          className="rounded-full px-8 border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <X className="mr-2 w-5 h-5" /> Still learning
        </Button>
        <Button
          variant="default"
          size="lg"
          onClick={() => onResult(true)}
          className="rounded-full px-8 bg-green-600 hover:bg-green-700"
        >
          <Check className="mr-2 w-5 h-5" /> I know this
        </Button>
      </div>
    </div>
  );
};

export default Flashcard;