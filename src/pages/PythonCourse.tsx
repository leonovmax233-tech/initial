"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Code, Play, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const PYTHON_TOPICS = [
  {
    id: 'vars',
    title: 'Змінні та типи даних',
    content: 'В Python змінні створюються автоматично при присвоєнні значення. Основні типи: int, float, str, bool.',
    code: 'name = "LinguaFlow"\nage = 1\nis_active = True',
    task: 'Який тип даних у значення 3.14?',
    options: ['int', 'float', 'str', 'bool'],
    correct: 'float'
  },
  {
    id: 'loops',
    title: 'Цикли for та while',
    content: 'Цикли дозволяють виконувати код багато разів. for використовується для ітерації, while - поки умова істинна.',
    code: 'for i in range(5):\n    print(i)',
    task: 'Скільки разів виконається range(3)?',
    options: ['2', '3', '4', '5'],
    correct: '3'
  }
];

const PythonCourse = () => {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);

  const topic = PYTHON_TOPICS[currentIdx];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-8">
          <ArrowLeft className="mr-2 w-4 h-4" /> До панелі
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h1 className="text-4xl font-black text-slate-900">{topic.title}</h1>
            <p className="text-lg text-slate-600 leading-relaxed">{topic.content}</p>
            <div className="bg-slate-900 rounded-2xl p-6 font-mono text-indigo-300 shadow-2xl">
              <pre>{topic.code}</pre>
            </div>
          </div>

          <Card className="p-8 rounded-3xl shadow-xl border-none bg-white">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Code className="text-primary" /> Практичне завдання
            </h3>
            <p className="text-slate-700 mb-6">{topic.task}</p>
            <div className="space-y-3">
              {topic.options.map(opt => (
                <Button
                  key={opt}
                  variant={answer === opt ? (opt === topic.correct ? "default" : "destructive") : "outline"}
                  className="w-full py-6 justify-start px-6 rounded-xl"
                  onClick={() => setAnswer(opt)}
                >
                  {opt}
                </Button>
              ))}
            </div>
            {answer === topic.correct && (
              <Button 
                className="w-full mt-8 bg-green-600 hover:bg-green-700"
                onClick={() => {
                  if (currentIdx < PYTHON_TOPICS.length - 1) {
                    setCurrentIdx(currentIdx + 1);
                    setAnswer(null);
                  } else {
                    navigate('/');
                  }
                }}
              >
                Наступна тема <Play className="ml-2 w-4 h-4" />
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PythonCourse;