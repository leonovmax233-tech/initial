"use client";

import React, { useState } from 'react';
import { GrammarExercise } from '../../types/learning';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { CheckCircle2, XCircle, HelpCircle, Lightbulb, BookOpen } from 'lucide-react';
import { AIService } from '../../lib/ai-service';

interface GrammarModeProps {
  exercises: GrammarExercise[];
  onFinish: () => void;
  onResult?: (exerciseId: string, correct: boolean, userAnswer: string) => void;
  adaptiveDifficulty?: number;
}

const GrammarMode: React.FC<GrammarModeProps> = ({
  exercises,
  onFinish,
  onResult,
  adaptiveDifficulty = 2,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [helpStep, setHelpStep] = useState(-1);
  const [showFullAnswer, setShowFullAnswer] = useState(false);

  const current = exercises[currentIndex];
  if (!current) return null;

  const handleSelect = (option: string) => {
    if (selected) return;
    setSelected(option);
    const correct = option === current.correctAnswer;
    onResult?.(current.id, correct, option);
    setTimeout(() => {
      if (currentIndex < exercises.length - 1) {
        setCurrentIndex((i) => i + 1);
        setSelected(null);
        setHelpStep(-1);
        setShowFullAnswer(false);
      } else {
        onFinish();
      }
    }, 1500);
  };

  const handleDontKnow = () => {
    if (helpStep < current.stepByStep.length - 1) {
      setHelpStep((s) => s + 1);
    } else {
      setShowFullAnswer(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-widest">
        Граматика {currentIndex + 1} / {exercises.length}
        {adaptiveDifficulty <= 2 && (
          <span className="ml-2 text-amber-600">• Підказки активні</span>
        )}
      </div>

      <Card className="p-8 rounded-3xl shadow-xl border-2 border-slate-100">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            {current.sentence.replace('___', '_______')}
          </h2>

          {helpStep >= 0 && (
            <div className="mb-4 p-4 bg-amber-50 rounded-2xl text-left flex gap-2">
              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-slate-700">{AIService.getHint(current, helpStep)}</p>
            </div>
          )}

          {showFullAnswer && (
            <div className="mb-4 p-4 bg-green-50 rounded-2xl text-left flex gap-2">
              <BookOpen className="w-5 h-5 text-green-600 shrink-0" />
              <div>
                <p className="font-bold text-green-800">Відповідь: {current.correctAnswer}</p>
                <p className="text-sm text-green-700 mt-1">{current.explanation}</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {current.options.map((opt) => {
            const isSelected = selected === opt;
            const isAnswer = opt === current.correctAnswer;
            return (
              <Button
                key={opt}
                variant={
                  isSelected
                    ? isAnswer
                      ? 'default'
                      : 'destructive'
                    : selected && isAnswer
                      ? 'secondary'
                      : 'outline'
                }
                className={`py-6 text-lg rounded-2xl ${
                  isSelected && isAnswer ? 'bg-green-600 hover:bg-green-600' : ''
                }`}
                onClick={() => handleSelect(opt)}
                disabled={!!selected}
              >
                {opt}
                {isSelected &&
                  (isAnswer ? (
                    <CheckCircle2 className="w-5 h-5 ml-2" />
                  ) : (
                    <XCircle className="w-5 h-5 ml-2" />
                  ))}
              </Button>
            );
          })}
        </div>

        {!selected && (
          <Button
            variant="ghost"
            className="w-full mt-4 text-slate-500"
            onClick={handleDontKnow}
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            {showFullAnswer ? 'Відповідь показано' : 'Не знаю'}
          </Button>
        )}

        {selected && selected !== current.correctAnswer && (
          <p className="mt-4 text-center text-sm text-slate-500">{current.explanation}</p>
        )}
      </Card>
    </div>
  );
};

export default GrammarMode;
