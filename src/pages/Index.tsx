"use client";

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, BookOpen, Play, Trash2, Search } from 'lucide-react';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">LinguaFlow</h1>
            <p className="text-slate-500 mt-1">Master languages with AI-powered efficiency.</p>
          </div>
          <Link to="/create">
            <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20">
              <Plus className="mr-2 w-5 h-5" /> Create New Set
            </Button>
          </Link>
        </header>

        <StatsOverview stats={stats} />

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Your Library</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search sets..." 
              className="pl-10 rounded-full bg-white border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredSets.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2 bg-transparent">
            <div className="max-w-sm mx-auto">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No sets found</h3>
              <p className="text-slate-500 mb-8">Start your journey by creating your first vocabulary set or use our AI generator.</p>
              <Link to="/create">
                <Button variant="outline" className="rounded-full">Create your first set</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSets.map((set) => (
              <Card key={set.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-slate-200">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                      {set.words.length} Words
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deleteSet(set.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{set.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-6">
                    {set.description || `Learn ${set.targetLanguage} vocabulary efficiently.`}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 rounded-xl" 
                      onClick={() => navigate(`/set/${set.id}`)}
                    >
                      <Play className="mr-2 w-4 h-4" /> Study
                    </Button>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-slate-100">
                  <div 
                    className="h-full bg-primary transition-all duration-500" 
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