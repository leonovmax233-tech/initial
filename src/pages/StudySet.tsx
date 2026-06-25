"use client";

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Layers, CheckSquare, PenTool, Headphones, Mic, BrainCircuit, BookOpen, Grid3X3 } from 'lucide-react';
import { useLearningStore } from '../store/useLearningStore';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import FlashcardDeck from '../components/learning/FlashcardDeck';
import QuizMode from '../components/learning/QuizMode';
import WritingMode from '../components/learning/WritingMode';
import ListeningMode from '../components/learning/ListeningMode';
import SpeakingMode from '../components/learning/SpeakingMode';
import AITutorMode from '../components/learning/AITutorMode';
import MatchGame from '../components/learning/MatchGame';
import SessionSummary from '../components/learning/SessionSummary';
import { showSuccess } from '../utils/toast';
import confetti from 'canvas-confetti';
import { LearningMode } from '../types/learning';

const StudySet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    sets,
    stats,
    recordResult,
    addXP,
    clearSessionMistakes,
    getRecommendation,
    sessionMistakes,
  } = useLearningStore();
  const set = sets.find((s) => s.id === id);

  const [mode, setMode] = useState<LearningMode>('overview');
  const [showSummary, setShowSummary] = useState(false);

  if (!set) return <div className="p-20 text-center">Набір не знайдено</div>;

  const handleResult = (wordId: string, correct: boolean, skill?: 'vocabulary' | 'writing' | 'listening' | 'grammar') => {
    recordResult(set.id, wordId, correct, skill ?? 'vocabulary');
    addXP(correct ? 15 : 5);
  };

  const handleFinish = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
    showSuccess('Чудова робота! Сесію завершено.');
    setShowSummary(true);
    setMode('overview');
  };

  const handleCloseSummary = () => {
    clearSessionMistakes();
    setShowSummary(false);
  };

  const modes = [
    { id: 'flashcards', name: 'Картки', icon: Layers, color: 'bg-blue-500', desc: 'Класичне запам\'ятовування' },
    { id: 'quiz', name: 'Тест', icon: CheckSquare, color: 'bg-green-500', desc: 'Вибір правильної відповіді' },
    { id: 'writing', name: 'Письмо', icon: PenTool, color: 'bg-orange-500', desc: 'Тренування правопису' },
    { id: 'listening', name: 'Аудіювання', icon: Headphones, color: 'bg-purple-500', desc: 'Сприйняття на слух' },
    { id: 'speaking', name: 'Вимова', icon: Mic, color: 'bg-red-500', desc: 'Тренування мовлення' },
    { id: 'match', name: 'Пairs', icon: Grid3X3, color: 'bg-teal-500', desc: 'Гра на зіставлення' },
    { id: 'ai-tutor', name: 'AI Тьютор', icon: BrainCircuit, color: 'bg-indigo-500', desc: 'Пояснення та поради' },
  ];

  if (showSummary) {
    return (
      <div className="min-h-screen bg-slate-50/50 pb-20 pt-10">
        <div className="max-w-6xl mx-auto p-6">
          <SessionSummary
            recommendation={getRecommendation()}
            mistakes={sessionMistakes}
            stats={stats}
            onClose={handleCloseSummary}
            lessonTitle={set.title}
          />
        </div>
      </div>
    );
  }

  const renderMode = () => {
    const adaptiveDiff = stats.adaptiveDifficulty;
    switch (mode) {
      case 'flashcards':
        return (
          <div className="py-10">
            <FlashcardDeck
              words={set.words}
              onResult={(wordId, correct) => handleResult(wordId, correct)}
              onFinish={handleFinish}
              adaptiveDifficulty={adaptiveDiff}
            />
          </div>
        );
      case 'quiz':
        return (
          <div className="py-10">
            <QuizMode
              words={set.words}
              onResult={(wordId, correct) => handleResult(wordId, correct, 'vocabulary')}
              onFinish={handleFinish}
              adaptiveDifficulty={adaptiveDiff}
            />
          </div>
        );
      case 'writing':
        return (
          <div className="py-10">
            <WritingMode
              words={set.words}
              onResult={(wordId, correct) => handleResult(wordId, correct, 'writing')}
              onFinish={handleFinish}
              adaptiveDifficulty={adaptiveDiff}
            />
          </div>
        );
      case 'listening':
        return (
          <div className="py-10">
            <ListeningMode
              words={set.words}
              onResult={(wordId, correct) => handleResult(wordId, correct, 'listening')}
              onFinish={handleFinish}
            />
          </div>
        );
      case 'speaking':
        return (
          <div className="py-10">
            <SpeakingMode
              words={set.words}
              onResult={(wordId, correct) => handleResult(wordId, correct)}
              onFinish={handleFinish}
            />
          </div>
        );
      case 'match':
        return (
          <div className="py-10">
            <MatchGame words={set.words} onFinish={handleFinish} />
          </div>
        );
      case 'ai-tutor':
        return (
          <div className="py-10">
            <AITutorMode word={set.words[0]} lessonContext={set.title} />
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {modes.map((m) => (
              <Card
                key={m.id}
                className="p-6 flex flex-col items-center text-center gap-4 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all border-slate-200 rounded-3xl group"
                onClick={() => setMode(m.id as LearningMode)}
              >
                <div className={`p-5 rounded-2xl text-white ${m.color} shadow-lg group-hover:scale-110 transition-transform`}>
                  <m.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{m.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{m.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => (mode === 'overview' ? navigate('/') : setMode('overview'))}
            className="rounded-full"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />{' '}
            {mode === 'overview' ? 'До панелі' : 'Назад до вибору'}
          </Button>
          {mode === 'overview' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100">
              <span className="text-sm font-bold text-primary">{set.words.length} слів</span>
            </div>
          )}
        </div>

        {mode === 'overview' && (
          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 mb-2">{set.title}</h1>
            <p className="text-slate-500 text-lg">Виберіть режим, щоб почати тренування</p>
            {set.lessonId && (
              <Button
                variant="outline"
                className="mt-4 rounded-2xl"
                onClick={() =>
                  navigate(`/course/${set.subject}/lesson/${set.lessonId}`)
                }
              >
                <BookOpen className="mr-2 w-4 h-4" /> Повернутися до уроку
              </Button>
            )}
          </div>
        )}

        {renderMode()}

        {mode === 'overview' && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Список слів</h2>
            <div className="grid grid-cols-1 gap-3">
              {set.words.map((word) => (
                <Card
                  key={word.id}
                  className="p-5 flex items-center justify-between border-slate-200 hover:border-primary/30 transition-colors rounded-2xl"
                >
                  <div className="flex-1">
                    <p className="text-lg font-bold text-slate-900">{word.original}</p>
                  </div>
                  <div className="w-px h-6 bg-slate-100 mx-6" />
                  <div className="flex-1">
                    <p className="text-lg text-slate-600">{word.translation}</p>
                  </div>
                  <div className="flex items-center gap-1.5 ml-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full ${i < word.masteryLevel ? 'bg-green-500' : 'bg-slate-200'}`}
                      />
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudySet;
