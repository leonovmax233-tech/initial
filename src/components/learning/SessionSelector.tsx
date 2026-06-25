"use client";

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Settings2, Zap, Brain, Shuffle } from 'lucide-react';

interface SessionSelectorProps {
  onStart: (size: number, type: 'random' | 'weak' | 'manual') => void;
}

const SessionSelector: React.FC<SessionSelectorProps> = ({ onStart }) => {
  const [size, setSize] = useState(12);
  const [type, setType] = useState<'random' | 'weak' | 'manual'>('random');

  const sizes = [10, 12, 24, 50, 100];

  return (
    <Card className="p-8 rounded-3xl shadow-xl border-none bg-white max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
          <Settings2 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Налаштування сесії</h2>
          <p className="text-slate-500">Оберіть кількість слів та режим</p>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <label className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 block">Кількість слів</label>
          <div className="flex flex-wrap gap-3">
            {sizes.map((s) => (
              <Button
                key={s}
                variant={size === s ? "default" : "outline"}
                onClick={() => setSize(s)}
                className="rounded-xl px-6 py-6 text-lg font-bold"
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 block">Тип вибірки</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              variant={type === 'random' ? "default" : "outline"}
              onClick={() => setType('random')}
              className="h-24 flex-col gap-2 rounded-2xl"
            >
              <Shuffle className="w-5 h-5" />
              Випадкові
            </Button>
            <Button
              variant={type === 'weak' ? "default" : "outline"}
              onClick={() => setType('weak')}
              className="h-24 flex-col gap-2 rounded-2xl"
            >
              <Brain className="w-5 h-5" />
              Слабкі слова
            </Button>
            <Button
              variant={type === 'manual' ? "default" : "outline"}
              onClick={() => setType('manual')}
              className="h-24 flex-col gap-2 rounded-2xl"
            >
              <Zap className="w-5 h-5" />
              Всі підряд
            </Button>
          </div>
        </div>

        <Button 
          className="w-full py-8 text-xl font-black rounded-2xl shadow-xl shadow-primary/20"
          onClick={() => onStart(size, type)}
        >
          ПОЧАТИ НАВЧАННЯ
        </Button>
      </div>
    </Card>
  );
};

export default SessionSelector;