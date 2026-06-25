"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Word } from '../../types/learning';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QuizModeProps {
  words: Word[];
  onResult: (wordId: string, correct: boolean) => void;
  onFinish: () => void;
}

const QuizMode: React.FC<QuizModeProps> = ({ words, onResult, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentWord = words[currentIndex];

  useEffect(() => {
    if (currentWord) {
      const otherWords = words.filter(w => w.id !== currentWord.id);
      const shuffledOthers = [...otherWords].sort(() => 0.5 - Math.random());
      const distractors = shuffledOthers.slice(0, 3).map(w => w.translation);
      const allOptions = [...distractors, currentWord.translation].sort(() => 0.5 - Math.random());
      setOptions(allOptions);
      setSelectedOption(null);
      setIsCorrect(null);
    }
  }, [currentIndex, currentWord, words]);

  const handleSelect = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);
    const correct = option === currentWord.translation;
    setIsCorrect(correct);
    onResult(currentWord.id, correct);

    setTimeout(() => {
      if (currentIndex < words.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        onFinish();
      }
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Оберіть переклад</span>
        <h2 className="text-4xl font-bold mt-2 text-slate-900">{currentWord.original}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isAnswerCorrect = option === currentWord.translation;
          
          let variant = "outline";
          if (isSelected) {
            variant = isAnswerCorrect ? "default" : "destructive";
          } else if (selectedOption && isAnswerCorrect) {
            variant = "secondary";
          }

          return (
            <motion.div key={idx} whileHover={{ scale: selectedOption ? 1 : 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant={variant as any}
                className={`w-full py-8 text-lg justify-between px-6 rounded-2xl border-2 ${
                  isSelected && isAnswerCorrect ? 'bg-green-600 hover:bg-green-600 border-green-700' : ''
                }`}
                onClick={() => handleSelect(option)}
                disabled={!!selectedOption}
              >
                {option}
                {isSelected && (isAnswerCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />)}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizMode;