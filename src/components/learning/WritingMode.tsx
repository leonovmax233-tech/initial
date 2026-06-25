"use client";

import React, { useState } from 'react';
import { Word } from '../../types/learning';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { motion } from 'framer-motion';
import { Send, Check, X, ArrowRight, HelpCircle, Lightbulb } from 'lucide-react';

interface WritingModeProps {
  words: Word[];
  onResult: (wordId: string, correct: boolean) => void;
  onFinish: () => void;
  adaptiveDifficulty?: number;
}

const WritingMode: React.FC<WritingModeProps> = ({
  words,
  onResult,
  onFinish,
  adaptiveDifficulty = 2,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [helpStep, setHelpStep] = useState(-1);

  const currentWord = words[currentIndex];

  const steps = [
    currentWord.example ?? 'Подумайте про контекст цього слова',
    `Переклад починається на "${currentWord.translation[0]}"`,
    `Повна відповідь: ${currentWord.translation}`,
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'idle' || !input.trim()) return;

    const isCorrect =
      input.trim().toLowerCase() === currentWord.translation.toLowerCase();
    setStatus(isCorrect ? 'correct' : 'wrong');
    onResult(currentWord.id, isCorrect);
  };

  const handleDontKnow = () => {
    if (helpStep < steps.length - 1) {
      setHelpStep((s) => s + 1);
    }
  };

  const nextWord = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setInput('');
      setStatus('idle');
      setHelpStep(-1);
    } else {
      onFinish();
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <Card className="p-8 rounded-3xl shadow-xl border-2 border-slate-100">
        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground mb-2">
            Напишіть переклад ({currentIndex + 1}/{words.length})
          </p>
          {adaptiveDifficulty <= 2 && (
            <p className="text-xs text-amber-600 font-bold mb-2">Підказки доступні</p>
          )}
          <h2 className="text-3xl font-bold text-slate-900">{currentWord.original}</h2>
        </div>

        {helpStep >= 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-amber-50 rounded-xl flex gap-2"
          >
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-slate-700">{steps[helpStep]}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Введіть відповідь..."
              className={`text-xl py-8 px-6 rounded-2xl border-2 transition-all ${
                status === 'correct'
                  ? 'border-green-500 bg-green-50'
                  : status === 'wrong'
                    ? 'border-red-500 bg-red-50'
                    : 'border-slate-200'
              }`}
              autoFocus
              disabled={status !== 'idle'}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {status === 'correct' && <Check className="text-green-600 w-8 h-8" />}
              {status === 'wrong' && <X className="text-red-600 w-8 h-8" />}
            </div>
          </div>

          {status === 'wrong' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-slate-100 rounded-xl text-center"
            >
              <p className="text-sm text-slate-500">Правильна відповідь:</p>
              <p className="text-xl font-bold text-slate-900">{currentWord.translation}</p>
            </motion.div>
          )}

          {status === 'idle' ? (
            <>
              <Button type="submit" className="w-full py-6 rounded-2xl text-lg">
                Перевірити <Send className="ml-2 w-5 h-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={handleDontKnow}
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                {helpStep === -1 ? 'Не знаю' : `Підказка ${helpStep + 1}/${steps.length}`}
              </Button>
            </>
          ) : (
            <Button onClick={nextWord} className="w-full py-6 rounded-2xl text-lg bg-slate-900">
              Далі <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          )}
        </form>
      </Card>
    </div>
  );
};

export default WritingMode;
