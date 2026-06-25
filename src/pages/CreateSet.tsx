"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Sparkles, Save, ArrowLeft, Info } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useLearningStore } from '../store/useLearningStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card } from '../components/ui/card';
import { AIService } from '../lib/ai-service';
import { showSuccess, showError } from '../utils/toast';

const CreateSet = () => {
  const navigate = useNavigate();
  const addSet = useLearningStore((state) => state.addSet);
  const [title, setTitle] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleBulkParse = () => {
    if (!title.trim()) {
      showError('Будь ласка, введіть назву набору');
      return;
    }

    const lines = bulkText.split('\n');
    const words = lines
      .map((line) => {
        const parts = line.split('-').map((p) => p.trim());
        if (parts.length < 2) return null;
        return {
          id: uuidv4(),
          original: parts[0],
          translation: parts[1],
          difficulty: 1,
          masteryLevel: 0,
          wrongCount: 0,
          example: `Example sentence for ${parts[0]}.`,
        };
      })
      .filter(Boolean) as any[];

    if (words.length === 0) {
      showError('Не знайдено жодного слова. Використовуйте формат: слово - переклад');
      return;
    }

    const newSet = {
      id: uuidv4(),
      title: title,
      description: `Набір з ${words.length} слів`,
      sourceLanguage: 'English' as any,
      targetLanguage: 'Ukrainian' as any,
      words,
      createdAt: Date.now(),
    };

    addSet(newSet);
    showSuccess(`Створено набір: ${words.length} слів!`);
    navigate('/');
  };

  const handleAIGenerate = async () => {
    if (!title) {
      showError('Введіть тему в полі назви (наприклад, "Travel")');
      return;
    }
    setIsGenerating(true);
    try {
      const aiWords = await AIService.generateSetFromTopic(title);
      const words = aiWords.map(w => ({
        ...w,
        id: uuidv4(),
        difficulty: 1,
        masteryLevel: 0,
        wrongCount: 0,
      }));
      
      const newSet = {
        id: uuidv4(),
        title: `AI: ${title}`,
        description: `Згенеровано AI для теми ${title}`,
        sourceLanguage: 'English' as any,
        targetLanguage: 'Ukrainian' as any,
        words: words as any,
        createdAt: Date.now(),
      };
      
      addSet(newSet);
      showSuccess('AI згенерував новий набір для вас!');
      navigate('/');
    } catch (err) {
      showError('Помилка генерації');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pb-20">
      <div className="flex items-center justify-between mb-10">
        <Button variant="ghost" onClick={() => navigate('/')} className="rounded-full">
          <ArrowLeft className="mr-2 w-4 h-4" /> Назад
        </Button>
        <h1 className="text-3xl font-black">Новий набір</h1>
        <div className="w-20"></div>
      </div>

      <div className="space-y-8">
        <Card className="p-8 rounded-3xl shadow-lg border-none">
          <label className="block text-sm font-bold text-slate-700 mb-3">Назва або тема</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Наприклад: Подорожі, Бізнес, IT терміни..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg py-6 px-6 rounded-2xl border-2 focus:border-primary"
            />
            <Button 
              onClick={handleAIGenerate} 
              disabled={isGenerating}
              className="bg-indigo-600 hover:bg-indigo-700 py-6 px-8 rounded-2xl shadow-lg shadow-indigo-200"
            >
              <Sparkles className="mr-2 w-5 h-5" />
              {isGenerating ? 'Генеруємо...' : 'AI Генерація'}
            </Button>
          </div>
        </Card>

        <Card className="p-8 rounded-3xl shadow-lg border-none">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <label className="block text-sm font-bold text-slate-700">Масовий імпорт</label>
              <div className="group relative">
                <Info className="w-4 h-4 text-slate-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  Вставте список слів. Кожне слово з нового рядка у форматі: слово - переклад
                </div>
              </div>
            </div>
            <span className="text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full">Формат: слово - переклад</span>
          </div>
          <Textarea
            placeholder="apple - яблуко&#10;house - будинок&#10;go to school - ходити до школи"
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            className="min-h-[350px] font-mono text-base p-6 rounded-2xl border-2 focus:border-primary bg-slate-50/50"
          />
          <Button onClick={handleBulkParse} className="w-full mt-8 py-8 text-xl font-black rounded-2xl shadow-xl shadow-primary/20">
            <Save className="mr-2 w-6 h-6" /> Створити навчальний набір
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default CreateSet;