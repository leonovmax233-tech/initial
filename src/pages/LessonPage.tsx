"use client";

import React from 'react';
import { useParams } from 'react-router-dom';
import { ENGLISH_COURSE, POLISH_COURSE, PYTHON_COURSE } from '../lib/course-data';
import { findLesson } from '../lib/learning-engine';
import LessonFlow from '../components/learning/LessonFlow';

const LessonPage = () => {
  const { subject, lessonId } = useParams();

  const lesson = lessonId ? findLesson(lessonId) : undefined;

  if (!lesson) return <div className="p-20 text-center">Урок не знайдено</div>;

  return <LessonFlow lesson={lesson} subject={subject ?? lesson.subject} />;
};

export default LessonPage;
