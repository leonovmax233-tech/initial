"use client";

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ENGLISH_COURSE, POLISH_COURSE, PYTHON_COURSE } from '../lib/course-data';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, BookOpen, Play, CheckCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useLearningStore } from '../store/useLearningStore';

const LessonPage = () => {
  const { subject, lessonId } = useParams();
  const navigate = useNavigate();
  const addSet = useLearningStore((state) => state.addSet);

  const allCourses = [...ENGLISH_COURSE, ...POLISH_COURSE, ...PYTHON_COURSE];
  let lesson: any = null;
  
  allCourses.forEach(level => {
    level.topics.forEach(topic => {
      const found = topic.lessons.find(l => l.id === lessonId);
      if (found) lesson = found;
    });
  });

  if (!lesson) return <div className="p-20 text-center">Урок не знайдено</div>;

  const startPractice = () => {
    const newSet = {
      id: uuidv4(),
      title: `Практика: ${lesson.title}`,
      description: `Набір слів з уроку ${lesson.title}`,
      subject: subject as any,
      words: lesson.vocabulary,
      createdAt: Date.now(),
    };
    addSet(newSet);
    navigate(`/set/${newSet.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8">
        <ArrowLeft className="mr-2 w-4 h-4" /> Назад
      </Button>

      <div className="space-y-8">
        <header>
          <h1 className="text-4xl font-black text-slate-900 mb-4">{lesson.title}</h1>
          <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
            <BookOpen className="w-4 h-4" /> Теорія
          </div>
        </header>

        <Card className="p-8 rounded-3xl shadow-xl border-none bg-white">
          <h3 className="text-xl font-bold mb-4">Пояснення</h3>
          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            {lesson.explanation}
          </p>
          
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-500 w-5 h-5" /> Ключові слова
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lesson.vocabulary.map((word: any) => (
                <div key={word.id} className="flex justify-between p-3 bg-white rounded-xl shadow-sm">
                  <span className="font-bold">{word.original}</span>
                  <span className="text-slate-500">{word.translation}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Button onClick={startPractice} className="w-full py-8 text-xl font-black rounded-3xl shadow-xl shadow-primary/20">
          <Play className="mr-2 w-6 h-6 fill-current" /> ПОЧАТИ ПРАКТИКУ
        </Button>
      </div>
    </div>
  );
};

export default LessonPage;