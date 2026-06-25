"use client";

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, BookOpen, Play, Code, BrainCircuit, Sparkles } from 'lucide-react';
import { useLearningStore } from '../store/useLearningStore';
import StatsOverview from '../components/dashboard/StatsOverview';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { AIService } from '../lib/ai-service';

const Index = () => {
  const navigate = useNavigate();
  const { sets, stats, updateStreak } = useLearningStore();

  useEffect(() => {
    updateStreak();
  }, []);

  const aiRecommendation = AIService.recommendNextStep(stats);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-10">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-black text-slate-900">LinguaFlow</h1>
            <p className="text-slate-500 mt-2">Ваша екосистема знань.</p>
          </div>
          <div className="flex gap-4">
            <Link to="/python">
              <Button variant="outline" className="rounded-2xl border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                <Code className="mr-2 w-5 h-5" /> Курс Python
              </Button>
            </Link>
            <Link to="/create">
              <Button className="rounded-2xl shadow-lg shadow-primary/20">
                <Plus className="mr-2 w-5 h-5" /> Створити набір
              </Button>
            </Link>
          </div>
        </header>

        <StatsOverview stats={stats as any} />

        <Card className="mb-12 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-none rounded-3xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <BrainCircuit className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                Порада від AI Тьютора <Sparkles className="w-4 h-4" />
              </h3>
              <p className="text-indigo-100 mt-1">{aiRecommendation}</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sets.map((set) => (
            <Card key={set.id} className="p-8 rounded-3xl hover:shadow-2xl transition-all border-slate-200 bg-white group">
              <div className="flex justify-between mb-6">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase">
                  {set.words.length} Слів
                </span>
                <span className="text-slate-400 text-xs">{set.subject}</span>
              </div>
              <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors">{set.title}</h3>
              <Button className="w-full rounded-2xl py-6" onClick={() => navigate(`/set/${set.id}`)}>
                <Play className="mr-2 w-5 h-5 fill-current" /> Почати вчити
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;