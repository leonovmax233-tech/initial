"use client";

import React, { useState } from 'react';
import { GrammarExercise } from '../../types/learning';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react';

interface GrammarModeProps {
  exercises: GrammarExercise[];
  onFinish: () => void;
}

const GrammarMode: React.FC<GrammarModeProps> = ({ exercises, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showTip, setShowTip] = useState(false);

  const current = exercises[currentIndex];

  const handleSelect = (option: string) => {
    setSelected(option);
    setTimeout(() => {
      if (currentIndex < exercises.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelected(null);
        setShowTip(false);
      } else {
        onFinish();
      }
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8 rounded-3xl shadow-xl border-2 border-slate-100">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            {current.sentence.replace('___', '_______')}
          </h2>
          <Button variant="ghost" size="sm" onClick={() => setShowTip(!showTip)} className="text-indigo-600">
            <Lightbulb className="w-4 h-4 mr-2" /> Підказка
          </Button>
          {showTip && <p className="mt-4 text-sm text-slate-500 italic">{current.explanation}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {current.options.map((opt) => (
            <Button
              key={opt}
              variant={selected === opt ? (opt === current.correctAnswer ? "default" : "destructive") : "outline"}
              className="py-6 text-lg rounded-2xl"
              onClick={() => handleSelect(opt)}
              disabled={!!selected}
            >
              {opt}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default GrammarMode;