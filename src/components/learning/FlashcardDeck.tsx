"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Shuffle, RotateCcw, Volume2 } from 'lucide-react';
import { Word } from '../../types/learning';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface FlashcardDeckProps {
  words: Word[];
  onFinish: () => void;
}

const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ words, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState<'orig-trans' | 'trans-orig' | 'random'>('orig-trans');

  const currentWord = words[currentIndex];

  const nextCard = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      onFinish();
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="text-sm font-black text-slate-400 uppercase tracking-widest">
          Картка {currentIndex + 1} з {words.length}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setDirection('random')}>
            <Shuffle className="w-4 h-4 mr-2" /> Мікс
          </Button>
        </div>
      </div>

      <div className="h-[400px] perspective-1000 relative mb-10">
        <motion.div
          className="w-full h-full preserve-3d cursor-pointer"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front */}
          <Card className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-12 bg-white border-4 border-slate-100 rounded-[40px] shadow-2xl">
            <span className="text-xs font-black text-primary/40 uppercase tracking-[0.2em] mb-6">Оригінал</span>
            <h2 className="text-5xl font-black text-slate-900 text-center">{currentWord.original}</h2>
            <Button variant="ghost" size="icon" className="mt-8 rounded-full" onClick={(e) => { e.stopPropagation(); speak(currentWord.original); }}>
              <Volume2 className="w-6 h-6 text-primary" />
            </Button>
          </Card>

          {/* Back */}
          <Card className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-12 bg-primary text-white rounded-[40px] shadow-2xl rotate-y-180">
            <span className="text-xs font-black opacity-40 uppercase tracking-[0.2em] mb-6">Переклад</span>
            <h2 className="text-5xl font-black text-center">{currentWord.translation}</h2>
            {currentWord.example && (
              <p className="mt-8 text-lg text-center italic opacity-80 max-w-xs">"{currentWord.example}"</p>
            )}
          </Card>
        </motion.div>
      </div>

      <div className="flex items-center justify-center gap-6">
        <Button variant="outline" size="lg" className="w-20 h-20 rounded-full border-2" onClick={prevCard} disabled={currentIndex === 0}>
          <ChevronLeft className="w-8 h-8" />
        </Button>
        <Button size="lg" className="h-20 px-12 rounded-full text-xl font-black shadow-xl shadow-primary/20" onClick={nextCard}>
          {currentIndex === words.length - 1 ? 'ЗАВЕРШИТИ' : 'НАСТУПНА'}
        </Button>
        <Button variant="outline" size="lg" className="w-20 h-20 rounded-full border-2" onClick={nextCard} disabled={currentIndex === words.length - 1}>
          <ChevronRight className="w-8 h-8" />
        </Button>
      </div>
    </div>
  );
};

export default FlashcardDeck;