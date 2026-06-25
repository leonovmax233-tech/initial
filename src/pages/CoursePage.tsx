"use client";

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ENGLISH_COURSE, POLISH_COURSE, PYTHON_COURSE } from '../lib/course-data';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ChevronRight, BookOpen, PlayCircle, Star } from 'lucide-react';

const CoursePage = () => {
  const { subject } = useParams();
  const navigate = useNavigate();

  const getCourseData = () => {
    if (subject === 'English') return ENGLISH_COURSE;
    if (subject === 'Polish') return POLISH_COURSE;
    if (subject === 'Python') return PYTHON_COURSE;
    return [];
  };

  const courseData = getCourseData();

  return (
    <div className="max-w-5xl mx-auto p-8">
      <header className="mb-12">
        <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">{subject} COURSE</h1>
        <p className="text-slate-500 text-lg mt-2">Оберіть тему та почніть навчання за структурованою програмою.</p>
      </header>

      <div className="space-y-12">
        {courseData.map((level) => (
          <div key={level.level}>
            <h2 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Star className="text-yellow-500 fill-yellow-500" /> {level.level}
            </h2>
            <div className="space-y-8">
              {level.topics.map((topic) => (
                <div key={topic.id} className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-700 px-2">{topic.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topic.lessons.map((lesson) => (
                      <Card 
                        key={lesson.id} 
                        className="p-6 hover:shadow-xl transition-all border-slate-200 rounded-3xl group cursor-pointer bg-white"
                        onClick={() => navigate(`/course/${subject}/lesson/${lesson.id}`)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                              <BookOpen className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900">{lesson.title}</h4>
                              <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mt-1">Урок</p>
                            </div>
                          </div>
                          <ChevronRight className="text-slate-300 group-hover:text-primary transition-colors" />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursePage;