"use client";

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ENGLISH_COURSE, PYTHON_COURSE } from '../lib/course-data';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ChevronRight, BookOpen, PlayCircle, Star } from 'lucide-react';

const CoursePage = () => {
  const { subject } = useParams();
  const navigate = useNavigate();

  const renderEnglish = () => (
    <div className="space-y-12">
      {ENGLISH_COURSE.map((level) => (
        <div key={level.level}>
          <h2 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <Star className="text-yellow-500 fill-yellow-500" /> Level {level.level}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {level.topics.map((topic) => (
              <Card key={topic.id} className="p-6 hover:shadow-xl transition-all border-slate-200 rounded-3xl group cursor-pointer" onClick={() => navigate(`/set/${topic.id}`)}>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <ChevronRight />
                  </Button>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{topic.title}</h3>
                <p className="text-slate-500 text-sm mb-6">{topic.description}</p>
                <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
                  <PlayCircle className="w-4 h-4" /> Почати тему
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderPython = () => (
    <div className="space-y-8">
      <h2 className="text-3xl font-black text-slate-900 mb-6">Python: Beginner to Junior</h2>
      <div className="grid grid-cols-1 gap-4">
        {PYTHON_COURSE.map((topic, idx) => (
          <Card key={topic.id} className="p-6 flex items-center justify-between border-slate-200 rounded-3xl hover:border-primary transition-colors cursor-pointer" onClick={() => navigate(`/set/${topic.id}`)}>
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl">
                {idx + 1}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{topic.title}</h3>
                <p className="text-slate-500">{topic.description}</p>
              </div>
            </div>
            <Button className="rounded-2xl px-8">ВЧИТИ</Button>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-8">
      <header className="mb-12">
        <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">{subject} COURSE</h1>
        <p className="text-slate-500 text-lg mt-2">Оберіть тему та почніть навчання за структурованою програмою.</p>
      </header>

      {subject === 'English' && renderEnglish()}
      {subject === 'Python' && renderPython()}
      {subject === 'Polish' && <div className="p-20 text-center text-slate-400 font-bold">Курс польської мови в розробці...</div>}
    </div>
  );
};

export default CoursePage;