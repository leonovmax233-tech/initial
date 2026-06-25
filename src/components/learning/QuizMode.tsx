"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Word } from '../../types/learning';
import { Button } from '../ui/button';
import { CheckCircle2, XCircle, HelpCircle, Lightbulb } from 'lucide-react';
import { filterExercisesByDifficulty } from '../../lib/learning-engine';

interface QuizModeProps {
  words: Word[];
  onResult: (wordId: string, correct: boolean) => void;
  onFinish: () => void;
  adaptiveDifficulty?: number;
}

const QuizMode: React.FC<QuizModeProps> = ({
  words,
  onResult,
  onFinish,
  adaptiveDifficulty = 2,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);

  const sortedWords = filterExercisesByDifficulty(
    words.map((w) => ({ ...w, difficulty: 5 - w.masteryLevel || 2 })),
    adaptiveDifficulty
  );
  const currentWord = sortedWords[currentIndex] ?? words[currentIndex];

  useEffect(() => {
    if (currentWord) {
      const otherWords = words.filter((w) => w.id !== currentWord.id);
      const shuffledOthers = [...otherWords].sort(() => 0.5 - Math.random());
      const distractors = shuffledOthers.slice(0, 3).map((w) => w.translation);
      const allOptions = [...distractors, currentWord.translation].sort(
        () => 0.5 - Math.random()
      );
      setOptions(allOptions);
      setSelectedOption(null);
      setShowHint(false);
      setHintLevel(0);
    }
  }, [currentIndex, currentWord, words]);

  const handleSelect = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);
    const correct = option === currentWord.translation;
    onResult(currentWord.id, correct);

    setTimeout(() => {
      if (currentIndex < words.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        onFinish();
      }
    }, 1500);
  };

  const handleDontKnow = () => {
    if (hintLevel === 0) {
      setShowHint(true);
      setHintLevel(1);
    } else if (hintLevel === 1 && currentWord.example) {
      setHintLevel(2);
    } else {
      setHintLevel(3);
    }
  };

  const hints = [
    currentWord.example ? `Приклад: ${currentWord.example}` : 'Подумайте про контекст слова',
    `Переклад починається на "${currentWord.translation[0]}"`,
    `Правильна відповідь: ${currentWord.translation}`,
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Оберіть переклад ({currentIndex + 1}/{words.length})
        </span>
        {adaptiveDifficulty <= 2 && (
          <p className="text-xs text-amber-600 mt-1 font-bold">Режим з підказками</p>
        )}
        <h2 className="text-4xl font-bold mt-2 text-slate-900">{currentWord.original}</h2>
      </div>

      {showHint && hintLevel > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-amber-50 rounded-2xl flex gap-2"
        >
          <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-slate-700">{hints[Math.min(hintLevel - 1, hints.length - 1)]}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isAnswerCorrect = option === currentWord.translation;

          let variant: 'outline' | 'default' | 'destructive' | 'secondary' = 'outline';
          if (isSelected) {
            variant = isAnswerCorrect ? 'default' : 'destructive';
          } else if (selectedOption && isAnswerCorrect) {
            variant = 'secondary';
          }

          return (
            <motion.div
              key={idx}
              whileHover={{ scale: selectedOption ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={variant}
                className={`w-full py-8 text-lg justify-between px-6 rounded-2xl border-2 ${
                  isSelected && isAnswerCorrect
                    ? 'bg-green-600 hover:bg-green-600 border-green-700'
                    : ''
                }`}
                onClick={() => handleSelect(option)}
                disabled={!!selectedOption}
              >
                {option}
                {isSelected &&
                  (isAnswerCorrect ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <XCircle className="w-6 h-6" />
                  ))}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {!selectedOption && (
        <Button variant="ghost" className="w-full mt-4" onClick={handleDontKnow}>
          <HelpCircle className="w-4 h-4 mr-2" />
          {hintLevel === 0 ? 'Не знаю' : `Підказка ${hintLevel}/${hints.length}`}
        </Button>
      )}
    </div>
  );
};

export default QuizMode;
