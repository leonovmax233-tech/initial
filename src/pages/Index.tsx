"use client";

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, BookOpen, Play, Trash2, Search, TrendingUp } from 'lucide-react';
import { useLearningStore } from '../store/useLearningStore';
import StatsOverview from '../components/dashboard/StatsOverview';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  const navigate = useNavigate();
  const { sets, stats, deleteSet, updateStreak } = useLearningStore();
  const [searchQuery, setSearchQuery] = React.useState('');

  useEffect(() => {
    updateStreak();
  }, []);

  const filteredSets = sets.filter(set => 
    set.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">LinguaFlow</h1>
            <p className="text-slate-500 text-lg mt-2">Ваш персональний AI-репетитор для вивчення мов.</p>
          </div>
          <Link to="/create">
            <Button size="lg" className="rounded-2xl px-10 py-7 text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
              <Plus className="mr-2 w-6 h-6" /> Створити набір
            </Button>
          </Link>
        </header>

        <StatsOverview stats={stats as any} />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <BookOpen className="text-primary" /> Ваша бібліотека
          </h2>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input 
              placeholder="Пошук набору..." 
              className="pl-12 py-6 rounded-2xl bg-white border-slate-200 shadow-sm focus:ring-2 focus:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredSets.length === 0 ? (
          <Card className="p-20 text-center border-dashed border-2 bg-white/50 rounded-3xl">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <TrendingUp className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Поки що тут порожньо</h3>
              <p className="text-slate-500 text-lg mb-10">Створіть свій перший набір слів або скористайтеся AI-генератором, щоб почати навчання.</p>
              <Link to="/create">
                <Button variant="outline" className="rounded-2xl px-8 py-6 text-lg border-2">Створити перший набір</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSets.map((set) => (
              <Card key={set.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-slate-200 rounded-3xl bg-white">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-black rounded-full uppercase tracking-widest">
                      {set.words.length} Слів
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      onClick={(e) => { e.preventDefault(); deleteSet(set.id); }}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-primary transition-colors">{set.title}</h3>
                  <p className="text-slate-500 leading-relaxed mb-8 line-clamp-2">
                    {set.description || `Вивчайте ${set.targetLanguage} ефективно за допомогою розумних повторень.`}
                  </p>
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 rounded-2xl py-6 text-lg font-bold shadow-lg shadow-primary/10" 
                      onClick={() => navigate(`/set/${set.id}`)}
                    >
                      <Play className="mr-2 w-5 h-5 fill-current" /> Вчити
                    </Button>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100">
                  <div 
                    className="h-full bg-primary transition-all duration-1000 ease-out" 
                    style={{ width: `${(set.words.filter(w => w.masteryLevel > 3).length / set.words.length) * 100}%` }}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;