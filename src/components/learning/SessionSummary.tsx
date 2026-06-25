"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import {
  BrainCircuit,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  Trophy,
  Target,
} from 'lucide-react';
import { NextStepRecommendation, SessionMistake, UserStats } from '../../types/learning';
import { buildSessionReview } from '../../lib/learning-engine';

interface SessionSummaryProps {
  recommendation: NextStepRecommendation;
  mistakes: SessionMistake[];
  stats: UserStats;
  onClose: () => void;
  lessonTitle?: string;
}

const SessionSummary: React.FC<SessionSummaryProps> = ({
  recommendation,
  mistakes,
  stats,
  onClose,
  lessonTitle,
}) => {
  const navigate = useNavigate();
  const review = buildSessionReview(mistakes);

  const handleNextLesson = () => {
    if (recommendation.recommendedSubject && recommendation.recommendedLessonId) {
      navigate(
        `/course/${recommendation.recommendedSubject}/lesson/${recommendation.recommendedLessonId}`
      );
    } else {
      onClose();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="p-8 rounded-3xl shadow-xl border-none bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-8 h-8" />
          <h2 className="text-2xl font-black">Сесію завершено!</h2>
        </div>
        {lessonTitle && (
          <p className="text-indigo-100 mb-2">Урок: {lessonTitle}</p>
        )}
        <p className="text-lg font-bold">{review.summary}</p>
      </Card>

      <Card className="p-6 rounded-3xl border-2 border-indigo-100">
        <div className="flex items-center gap-3 mb-4">
          <BrainCircuit className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-bold">Наступний крок</h3>
        </div>
        <p className="text-slate-700 text-lg mb-4">{recommendation.message}</p>
        {recommendation.priority === 'high' && (
          <div className="flex items-center gap-2 text-amber-600 text-sm font-bold mb-4">
            <AlertTriangle className="w-4 h-4" /> Рекомендовано повторення
          </div>
        )}
        <Button onClick={handleNextLesson} className="w-full py-6 rounded-2xl">
          Продовжити навчання <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </Card>

      {(recommendation.weakTopics.length > 0 || recommendation.weakWords.length > 0) && (
        <Card className="p-6 rounded-3xl border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-red-500" />
            <h3 className="text-lg font-bold">Слабкі місця</h3>
          </div>
          {recommendation.weakTopics.length > 0 && (
            <div className="mb-3">
              <p className="text-sm text-slate-500 mb-2">Теми для повторення:</p>
              <div className="flex flex-wrap gap-2">
                {recommendation.weakTopics.slice(0, 5).map((t) => (
                  <span key={t} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
          {recommendation.repetitionItems.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <RotateCcw className="w-4 h-4" />
              {recommendation.repetitionItems.length} елементів потребують повторення
            </div>
          )}
        </Card>
      )}

      {mistakes.length > 0 && (
        <Card className="p-6 rounded-3xl border-slate-200">
          <h3 className="text-lg font-bold mb-4">Огляд помилок</h3>
          <div className="space-y-4">
            {mistakes.map((m, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-2xl">
                <p className="font-bold text-slate-900">{m.question}</p>
                <p className="text-red-600 text-sm mt-1">Ваша відповідь: {m.userAnswer}</p>
                <p className="text-green-600 text-sm">Правильно: {m.correctAnswer}</p>
                <p className="text-slate-500 text-sm mt-2">{m.explanation}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-6 rounded-3xl border-slate-200">
        <h3 className="text-lg font-bold mb-4">Прогрес навичок</h3>
        <div className="space-y-3">
          {Object.entries(stats.skillProgress).map(([skill, value]) => (
            <div key={skill}>
              <div className="flex justify-between text-sm mb-1">
                <span className="capitalize font-medium">{skill}</span>
                <span>{value}%</span>
              </div>
              <Progress value={value} className="h-2" />
            </div>
          ))}
        </div>
      </Card>

      <Button variant="outline" onClick={onClose} className="w-full py-4 rounded-2xl">
        Повернутися до меню
      </Button>
    </div>
  );
};

export default SessionSummary;
