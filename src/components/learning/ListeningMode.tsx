"use client";

import React, { useState } from 'react';
import { Word } from '../../types/learning';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Volume2, Play, Check, X } from 'lucide-react';

interface ListeningModeProps {
  words: Word[];
  onResult: (wordId: string, correct: boolean) => void;
  onFinish: () => void;
}

const ListeningMode: React.FC<ListeningModeProps> = ({ words, onResult, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const currentWord = words[currentIndex];

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(currentWord.original);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleSelect = (wordId: string) => {
    if (selectedId) return;
    setSelectedId(wordId);
    const correct = wordId === currentWord.id;
    onResult(currentWord.id, correct);

    setTimeout(() => {
      if (currentIndex < words.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedId(null);
      } else {
        onFinish();
      }
    }, 1500);
  };

  // Generate options
  const options = React.useMemo(() => {
    const others = words.filter(w => w.id !== currentWord.id).sort(() => 0.5 - Math.random()).slice(0, 3);
    return [...others, currentWord].sort(() => 0.5 - Math.random());
  }, [currentIndex, words]);

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-12">
        <Button 
          size="lg" 
          className="w-32 h-32 rounded-full shadow-2xl bg-primary hover:scale-105 transition-transform"
          onClick={speak}
        >
          <Volume2 className="w-16 h-16" />
        </Button>
        <p className="mt-4 text-slate-500 font-medium">Натисніть, щоб прослухати</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((opt) => (
          <Button
            key={opt.id}
            variant={selectedId === opt.id ? (opt.id === currentWord.id ? "default" : "destructive") : "outline"}
            className={`py-8 text-lg rounded-2xl border-2 ${
              selectedId && opt.id === currentWord.id ? 'bg-green-600 border-green-700' : ''
            }`}
            onClick={() => handleSelect(opt.id)}
            disabled={!!selectedId}
          >
            {opt.translation}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ListeningMode;