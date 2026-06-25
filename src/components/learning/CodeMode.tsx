"use client";

import React, { useState } from 'react';
import { CodeExercise } from '../../types/learning';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { HelpCircle, Lightbulb, BookOpen, Check, X, Play } from 'lucide-react';

interface CodeModeProps {
  exercises: CodeExercise[];
  onResult: (exerciseId: string, correct: boolean) => void;
  onFinish: () => void;
}

const CodeMode: React.FC<CodeModeProps> = ({ exercises, onResult, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'checked'>('idle');
  const [helpStep, setHelpStep] = useState(-1);
  const [showSolution, setShowSolution] = useState(false);

  const current = exercises[currentIndex];
  if (!current) return null;

  React.useEffect(() => {
    setCode(current.starterCode);
    setOutput(null);
    setStatus('idle');
    setHelpStep(-1);
    setShowSolution(false);
  }, [currentIndex, current.starterCode]);

  const runCode = () => {
    try {
      const logs: string[] = [];
      const mockPrint = (...args: unknown[]) => logs.push(args.join(' '));
      const fn = new Function('print', code.replace(/print\(/g, 'print('));
      fn(mockPrint);
      const result = logs.join('\n') || '(no output)';
      setOutput(result);
      const correct =
        result.trim().toLowerCase() === current.expectedOutput.trim().toLowerCase() ||
        code.trim().includes(current.solution.trim());
      setStatus('checked');
      onResult(current.id, correct);
    } catch {
      setOutput('Error: перевірте синтаксис');
      setStatus('checked');
      onResult(current.id, false);
    }
  };

  const handleDontKnow = () => {
    if (helpStep < current.stepByStep.length - 1) {
      setHelpStep((s) => s + 1);
    } else {
      setShowSolution(true);
    }
  };

  const next = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onFinish();
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-widest">
        Завдання {currentIndex + 1} / {exercises.length}
      </div>

      <Card className="p-8 rounded-3xl shadow-xl border-2 border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{current.title}</h2>
        <p className="text-slate-600 mb-6">{current.description}</p>

        {helpStep >= 0 && (
          <div className="mb-4 p-4 bg-amber-50 rounded-2xl flex gap-2">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-slate-700">{current.stepByStep[helpStep]}</p>
          </div>
        )}

        {showSolution && (
          <div className="mb-4 p-4 bg-green-50 rounded-2xl">
            <BookOpen className="w-5 h-5 text-green-600 mb-2" />
            <pre className="text-sm font-mono bg-white p-4 rounded-xl">{current.solution}</pre>
            <p className="text-sm text-green-700 mt-2">Очікуваний результат: {current.expectedOutput}</p>
          </div>
        )}

        <div className="mb-4">
          <label className="text-sm font-bold text-slate-500 mb-2 block">Код</label>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-mono text-sm min-h-[200px] rounded-2xl border-2 bg-slate-900 text-green-400"
            disabled={status === 'checked'}
          />
        </div>

        {output && (
          <div className="mb-4 p-4 bg-slate-100 rounded-2xl font-mono text-sm">
            <span className="text-slate-500">Output: </span>{output}
          </div>
        )}

        {status === 'idle' && (
          <div className="flex gap-3">
            <Button onClick={runCode} className="flex-1 py-6 rounded-2xl">
              <Play className="w-4 h-4 mr-2" /> Запустити
            </Button>
            <Button variant="ghost" onClick={handleDontKnow} className="py-6 rounded-2xl">
              <HelpCircle className="w-4 h-4 mr-2" /> Не знаю
            </Button>
          </div>
        )}

        {status === 'checked' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 justify-center">
              {output?.toLowerCase().includes(current.expectedOutput.toLowerCase()) ? (
                <><Check className="text-green-600 w-6 h-6" /><span className="text-green-700 font-bold">Чудово!</span></>
              ) : (
                <><X className="text-red-600 w-6 h-6" /><span className="text-red-700">Спробуйте ще. Очікувано: {current.expectedOutput}</span></>
              )}
            </div>
            <p className="text-sm text-slate-500 text-center">{current.explanation}</p>
            <Button onClick={next} className="w-full py-6 rounded-2xl">
              {currentIndex < exercises.length - 1 ? 'Наступне завдання' : 'Завершити'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CodeMode;
