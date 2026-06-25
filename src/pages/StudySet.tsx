"use client";

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Layers, CheckSquare, PenTool, Headphones, Mic, BrainCircuit } from 'lucide-react';
import { useLearningStore } from '../store/useLearningStore';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import Flashcard from '../components/learning/Flashcard';
import { showSuccess } from '../utils/toast';
import confetti from 'canvas-confetti';

const StudySet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sets, updateWordProgress, addXP } = useLearningStore();
  const set = sets.find((s) => s.id === id);

  const [mode, setMode] = useState<'overview' | 'flashcards'>('overview');
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!set) return <div>Set not found</div>;

  const handleResult = (correct: boolean) => {
    updateWordProgress(set.id, set.words[currentIndex].id, correct);
    addXP(correct ? 20 : 5);

    if (currentIndex < set.words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      showSuccess('Session complete! Great job!');
      setMode('overview');
      setCurrentIndex(0);
    }
  };

  const modes = [
    { id: 'flashcards', name: 'Flashcards', icon: Layers, color: 'bg-blue-500' },
    { id: 'quiz', name: 'Quiz', icon: CheckSquare, color: 'bg-green-500' },
    { id: 'writing', name: 'Writing', icon: PenTool, color: 'bg-orange-500' },
    { id: 'listening', name: 'Listening', icon: Headphones, color: 'bg-purple-500' },
    { id: 'speaking', name: 'Speaking', icon: Mic, color: 'bg-red-500' },
    { id: 'ai', name: 'AI Tutor', icon: BrainCircuit, color: 'bg-indigo-500' },
  ];

  if (mode === 'flashcards') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-12">
          <Button variant="ghost" onClick={() => setMode('overview')}>
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Set
          </Button>
          <div className="text-sm font-bold text-muted-foreground">
            {currentIndex + 1} / {set.words.length}
          </div>
        </div>
        <Flashcard word={set.words[currentIndex]} onResult={handleResult} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
        <ArrowLeft className="mr-2 w-4 h-4" /> Back to Dashboard
      </Button>

      <div className="mb-10">
        <h1 className="text-4xl font-black mb-2">{set.title}</h1>
        <p className="text-slate-500">{set.words.length} terms • {set.sourceLanguage} to {set.targetLanguage}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {modes.map((m) => (
          <Card 
            key={m.id} 
            className="p-4 flex flex-col items-center justify-center gap-3 cursor-pointer hover:scale-105 transition-transform border-slate-200"
            onClick={() => m.id === 'flashcards' ? setMode('flashcards') : null}
          >
            <div className={`p-3 rounded-2xl text-white ${m.color}`}>
              <m.icon className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold">{m.name}</span>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-6">Terms in this set</h2>
      <div className="space-y-3">
        {set.words.map((word) => (
          <Card key={word.id} className="p-6 flex items-center justify-between border-slate-200 hover:border-primary/30 transition-colors">
            <div className="flex-1">
              <p className="text-lg font-bold text-slate-900">{word.original}</p>
            </div>
            <div className="w-px h-8 bg-slate-100 mx-8" />
            <div className="flex-1">
              <p className="text-lg text-slate-600">{word.translation}</p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full ${i < word.masteryLevel ? 'bg-green-500' : 'bg-slate-200'}`} 
                />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudySet;