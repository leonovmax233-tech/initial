"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Play,
  CheckSquare,
  RotateCcw,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import { Lesson, LessonPhase } from '../../types/learning';
import { useLearningStore } from '../../store/useLearningStore';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import PracticeExerciseMode from './PracticeExerciseMode';
import GrammarMode from './GrammarMode';
import CodeMode from './CodeMode';
import SessionSummary from './SessionSummary';
import { filterExercisesByDifficulty } from '../../lib/learning-engine';
import { showSuccess } from '../../utils/toast';

const PHASES: { id: LessonPhase; label: string; icon: React.ElementType }[] = [
  { id: 'theory', label: 'Теорія', icon: BookOpen },
  { id: 'practice', label: 'Практика', icon: Play },
  { id: 'quiz', label: 'Тест', icon: CheckSquare },
  { id: 'review', label: 'Огляд', icon: RotateCcw },
];

interface LessonFlowProps {
  lesson: Lesson;
  subject: string;
}

const LessonFlow: React.FC<LessonFlowProps> = ({ lesson, subject }) => {
  const navigate = useNavigate();
  const {
    stats,
    addSet,
    addXP,
    recordLessonResult,
    completeLessonPhase,
    markLessonComplete,
    clearSessionMistakes,
    getRecommendation,
    sessionMistakes,
  } = useLearningStore();

  const [phase, setPhase] = useState<LessonPhase>('theory');
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionWrong, setSessionWrong] = useState(0);

  const adaptiveDiff = stats.adaptiveDifficulty;
  const practiceExercises = filterExercisesByDifficulty(
    lesson.practiceExercises,
    adaptiveDiff
  );
  const quizQuestions = filterExercisesByDifficulty(
    lesson.quizQuestions,
    adaptiveDiff
  );

  const handleExerciseResult = (
    exerciseId: string,
    correct: boolean,
    userAnswer: string,
    exercise: { question: string; correctAnswer: string; explanation: string }
  ) => {
    if (correct) {
      setSessionCorrect((c) => c + 1);
      addXP(15);
    } else {
      setSessionWrong((w) => w + 1);
      addXP(5);
      recordLessonResult(
        lesson.id,
        lesson.subject,
        lesson.topicId,
        lesson.level,
        false,
        {
          questionId: exerciseId,
          question: exercise.question,
          userAnswer,
          correctAnswer: exercise.correctAnswer,
          explanation: exercise.explanation,
        }
      );
    }
    if (correct) {
      recordLessonResult(
        lesson.id,
        lesson.subject,
        lesson.topicId,
        lesson.level,
        true
      );
    }
  };

  const finishPhase = (nextPhase: LessonPhase) => {
    completeLessonPhase(
      lesson.id,
      lesson.subject,
      lesson.topicId,
      lesson.level,
      phase
    );
    if (nextPhase === 'complete') {
      markLessonComplete(lesson.id);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      showSuccess('Урок завершено!');

      const newSet = {
        id: uuidv4(),
        title: `Практика: ${lesson.title}`,
        description: `Набір слів з уроку ${lesson.title}`,
        subject: lesson.subject,
        lessonId: lesson.id,
        topicId: lesson.topicId,
        words: lesson.vocabulary.map((w) => ({ ...w, masteryLevel: 0, wrongCount: 0 })),
        createdAt: Date.now(),
      };
      addSet(newSet);
    }
    setPhase(nextPhase);
  };

  const phaseIndex = PHASES.findIndex((p) => p.id === phase);

  if (phase === 'complete') {
    return (
      <SessionSummary
        recommendation={getRecommendation()}
        mistakes={sessionMistakes}
        stats={stats}
        lessonTitle={lesson.title}
        onClose={() => navigate(`/course/${subject}`)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 w-4 h-4" /> Назад
      </Button>

      <header className="mb-8">
        <h1 className="text-4xl font-black text-slate-900 mb-4">{lesson.title}</h1>
        <div className="flex gap-2 flex-wrap">
          {PHASES.map((p, i) => (
            <div
              key={p.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                phase === p.id
                  ? 'bg-primary text-white'
                  : i < phaseIndex
                    ? 'bg-green-100 text-green-700'
                    : 'bg-slate-100 text-slate-400'
              }`}
            >
              <p.icon className="w-4 h-4" />
              {p.label}
            </div>
          ))}
        </div>
      </header>

      {phase === 'theory' && (
        <div className="space-y-6">
          <Card className="p-8 rounded-3xl shadow-xl border-none bg-white">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="text-primary w-5 h-5" /> Пояснення
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              {lesson.theory.explanation}
            </p>

            <div className="mb-6">
              <h4 className="font-bold mb-3">Правила</h4>
              <ul className="space-y-2">
                {lesson.theory.rules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-6">
              <h4 className="font-bold mb-4">Приклади</h4>
              {lesson.theory.examples.map((ex, i) => (
                <div key={i} className="flex justify-between p-3 bg-white rounded-xl shadow-sm mb-2">
                  <span className="font-bold">{ex.original}</span>
                  <span className="text-slate-500">{ex.translation}</span>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h4 className="font-bold mb-4">Ключові слова</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lesson.vocabulary.map((word) => (
                  <div key={word.id} className="flex justify-between p-3 bg-white rounded-xl shadow-sm">
                    <span className="font-bold">{word.original}</span>
                    <span className="text-slate-500">{word.translation}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Button
            onClick={() => finishPhase('practice')}
            className="w-full py-8 text-xl font-black rounded-3xl shadow-xl shadow-primary/20"
          >
            <Play className="mr-2 w-6 h-6 fill-current" /> ПЕРЕЙТИ ДО ПРАКТИКИ
          </Button>
        </div>
      )}

      {phase === 'practice' && (
        <div>
          {lesson.subject === 'Python' && lesson.codeExercises && lesson.codeExercises.length > 0 ? (
            <CodeMode
              exercises={lesson.codeExercises}
              onResult={(id, correct) => {
                const ex = lesson.codeExercises!.find((e) => e.id === id)!;
                handleExerciseResult(id, correct, '', {
                  question: ex.title,
                  correctAnswer: ex.expectedOutput,
                  explanation: ex.explanation,
                });
              }}
              onFinish={() => finishPhase('quiz')}
            />
          ) : lesson.grammarExercises.length > 0 ? (
            <GrammarMode
              exercises={lesson.grammarExercises}
              adaptiveDifficulty={adaptiveDiff}
              onResult={(id, correct, userAnswer) => {
                const ex = lesson.grammarExercises.find((e) => e.id === id)!;
                handleExerciseResult(id, correct, userAnswer, {
                  question: ex.sentence,
                  correctAnswer: ex.correctAnswer,
                  explanation: ex.explanation,
                });
              }}
              onFinish={() => finishPhase('quiz')}
            />
          ) : (
            <PracticeExerciseMode
              exercises={practiceExercises}
              adaptiveDifficulty={adaptiveDiff}
              onResult={(id, correct, userAnswer) => {
                const ex = lesson.practiceExercises.find((e) => e.id === id)!;
                handleExerciseResult(id, correct, userAnswer, ex);
              }}
              onFinish={() => finishPhase('quiz')}
            />
          )}
        </div>
      )}

      {phase === 'quiz' && (
        <div>
          <PracticeExerciseMode
            exercises={quizQuestions}
            adaptiveDifficulty={adaptiveDiff}
            onResult={(id, correct, userAnswer) => {
              const ex = lesson.quizQuestions.find((e) => e.id === id)!;
              handleExerciseResult(id, correct, userAnswer, ex);
            }}
            onFinish={() => finishPhase('review')}
          />
        </div>
      )}

      {phase === 'review' && (
        <div className="space-y-6">
          <Card className="p-8 rounded-3xl shadow-xl border-none bg-white">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <RotateCcw className="text-primary w-5 h-5" /> Огляд уроку
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-green-50 rounded-2xl text-center">
                <p className="text-3xl font-black text-green-600">{sessionCorrect}</p>
                <p className="text-sm text-green-700">Правильних</p>
              </div>
              <div className="p-4 bg-red-50 rounded-2xl text-center">
                <p className="text-3xl font-black text-red-600">{sessionWrong}</p>
                <p className="text-sm text-red-700">Помилок</p>
              </div>
            </div>

            {sessionMistakes.length > 0 ? (
              <div className="space-y-4">
                <h4 className="font-bold">Ваші помилки та пояснення:</h4>
                {sessionMistakes.map((m, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl">
                    <p className="font-bold">{m.question}</p>
                    <p className="text-red-600 text-sm">Ви: {m.userAnswer}</p>
                    <p className="text-green-600 text-sm">Правильно: {m.correctAnswer}</p>
                    <p className="text-slate-500 text-sm mt-2">{m.explanation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-green-600 font-bold text-center py-8">
                Жодних помилок! Відмінна робота!
              </p>
            )}
          </Card>

          <Button
            onClick={() => {
              clearSessionMistakes();
              finishPhase('complete');
            }}
            className="w-full py-8 text-xl font-black rounded-3xl shadow-xl shadow-primary/20"
          >
            <CheckSquare className="mr-2 w-6 h-6" /> ЗАВЕРШИТИ УРОК
          </Button>
        </div>
      )}
    </div>
  );
};

export default LessonFlow;
