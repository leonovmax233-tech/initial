"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PracticeExercise } from '../../types/learning';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { CheckCircle2, XCircle, HelpCircle, Lightbulb, BookOpen } from 'lucide-react';
import { AIService } from '../../lib/ai-service';

interface PracticeExerciseModeProps {
  exercises: PracticeExercise[];
  onResult: (exerciseId: string, correct: boolean, userAnswer: string) => void;
  onFinish: () => void;
  adaptiveDifficulty?: number;
}

const PracticeExerciseMode: React.FC<PracticeExerciseModeProps> = ({
  exercises,
  onResult,
  onFinish,
  adaptiveDifficulty = 2,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'answered'>('idle');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [helpStep, setHelpStep] = useState(-1);
  const [showFullAnswer, setShowFullAnswer] = useState(false);

  const current = exercises[currentIndex];
  if (!current) return null;

  const checkAnswer = (answer: string) => {
    const correct =
      answer.trim().toLowerCase() === current.correctAnswer.toLowerCase();
    setIsCorrect(correct);
    setStatus('answered');
    onResult(current.id, correct, answer);
  };

  const handleSelect = (option: string) => {
    if (status !== 'idle') return;
    setSelectedOption(option);
    checkAnswer(option);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'idle' || !input.trim()) return;
    checkAnswer(input);
  };

  const handleDontKnow = () => {
    if (helpStep < (current.stepByStep?.length ?? 0) - 1) {
      setHelpStep((s) => s + 1);
    } else if (!showFullAnswer) {
      setShowFullAnswer(true);
    }
  };

  const nextExercise = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((i) => i + 1);
      setInput('');
      setSelectedOption(null);
      setStatus('idle');
      setIsCorrect(null);
      setHelpStep(-1);
      setShowFullAnswer(false);
    } else {
      onFinish();
    }
  };

  const showHintByDefault = adaptiveDifficulty <= 2 && helpStep === -1;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Вправa {currentIndex + 1} / {exercises.length}
        </span>
        {adaptiveDifficulty <= 2 && (
          <span className="text-xs px-3 py-1 bg-amber-100 text-amber-700 rounded-full font-bold">
            Підказки активні
          </span>
        )}
      </div>

      <Card className="p-8 rounded-3xl shadow-xl border-2 border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
          {current.question}
        </h2>

        <AnimatePresence>
          {(helpStep >= 0 || showHintByDefault) && helpStep >= 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-amber-50 rounded-2xl border border-amber-100"
            >
              <div className="flex gap-2 items-start">
                <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-slate-700">{AIService.getHint(current, helpStep)}</p>
              </div>
            </motion.div>
          )}
          {showFullAnswer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-green-50 rounded-2xl border border-green-100"
            >
              <div className="flex gap-2 items-start">
                <BookOpen className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-green-800">Правильна відповідь:</p>
                  <p className="text-xl font-black text-green-900">{current.correctAnswer}</p>
                  <p className="text-sm text-green-700 mt-2">{current.explanation}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {current.type === 'multiple-choice' && current.options ? (
          <div className="grid grid-cols-1 gap-3">
            {current.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isAnswer = option === current.correctAnswer;
              let variant: 'outline' | 'default' | 'destructive' | 'secondary' = 'outline';
              if (isSelected) variant = isAnswer ? 'default' : 'destructive';
              else if (status === 'answered' && isAnswer) variant = 'secondary';

              return (
                <Button
                  key={idx}
                  variant={variant}
                  className={`w-full py-6 text-lg justify-between px-6 rounded-2xl border-2 ${
                    isSelected && isAnswer ? 'bg-green-600 hover:bg-green-600 border-green-700' : ''
                  }`}
                  onClick={() => handleSelect(option)}
                  disabled={status !== 'idle'}
                >
                  {option}
                  {isSelected &&
                    (isAnswer ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    ))}
                </Button>
              );
            })}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Введіть відповідь..."
              className="text-xl py-8 px-6 rounded-2xl border-2"
              disabled={status !== 'idle'}
              autoFocus
            />
            {status === 'idle' && (
              <Button type="submit" className="w-full py-6 rounded-2xl text-lg">
                Перевірити
              </Button>
            )}
          </form>
        )}

        {status === 'idle' && (
          <Button
            variant="ghost"
            className="w-full mt-4 text-slate-500 hover:text-primary"
            onClick={handleDontKnow}
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            {helpStep === -1
              ? 'Не знаю'
              : showFullAnswer
                ? 'Показано відповідь'
                : `Підказка ${helpStep + 1}/${current.stepByStep?.length ?? 1}`}
          </Button>
        )}

        {status === 'answered' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            {!isCorrect && (
              <div className="p-4 bg-red-50 rounded-2xl text-center">
                <p className="text-red-700">{AIService.explainMistake(current, selectedOption ?? input)}</p>
              </div>
            )}
            {isCorrect && (
              <div className="p-4 bg-green-50 rounded-2xl text-center text-green-700 font-bold">
                Правильно!
              </div>
            )}
            <Button onClick={nextExercise} className="w-full py-6 rounded-2xl text-lg">
              {currentIndex < exercises.length - 1 ? 'Далі' : 'Завершити'}
            </Button>
          </motion.div>
        )}
      </Card>
    </div>
  );
};

export default PracticeExerciseMode;
