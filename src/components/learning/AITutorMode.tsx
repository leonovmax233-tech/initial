"use client";

import React, { useState, useEffect } from 'react';
import { Word } from '../../types/learning';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { BrainCircuit, Sparkles, Lightbulb, MessageSquare } from 'lucide-react';
import { AIService } from '../../lib/ai-service';

interface AITutorModeProps {
  word: Word;
  lessonContext?: string;
}

const AITutorMode: React.FC<AITutorModeProps> = ({ word, lessonContext }) => {
  const [explanation, setExplanation] = useState<string>('');
  const [grammarTip, setGrammarTip] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [extraExample, setExtraExample] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    const text = AIService.getExplanation(word);
    setExplanation(text);
    setGrammarTip(
      AIService.explainGrammar(word.topicId ?? lessonContext ?? 'general')
    );
    setExtraExample(
      word.example ??
        `"${word.original}" is commonly used in ${lessonContext ?? 'everyday'} contexts.`
    );
    setLoading(false);
  }, [word, lessonContext]);

  const generateMore = () => {
    setExtraExample(
      `Try using "${word.original}" (${word.translation}) in a sentence about your day today.`
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="overflow-hidden rounded-3xl border-none shadow-2xl">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <BrainCircuit className="w-8 h-8" />
            <h2 className="text-2xl font-bold">AI Репетитор</h2>
          </div>
          <p className="text-indigo-100">Пояснення для слова:</p>
          <h3 className="text-4xl font-black mt-1">{word.original}</h3>
        </div>

        <div className="p-8 bg-white space-y-6">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-3/4"></div>
              <div className="h-4 bg-slate-100 rounded w-full"></div>
              <div className="h-4 bg-slate-100 rounded w-5/6"></div>
            </div>
          ) : (
            <>
              <div className="flex gap-4">
                <div className="p-2 bg-amber-100 rounded-lg h-fit">
                  <Lightbulb className="text-amber-600 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Як запам'ятати</h4>
                  <p className="text-slate-600 leading-relaxed">{explanation}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-2 bg-purple-100 rounded-lg h-fit">
                  <BrainCircuit className="text-purple-600 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Граматика</h4>
                  <p className="text-slate-600 leading-relaxed">{grammarTip}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-2 bg-blue-100 rounded-lg h-fit">
                  <MessageSquare className="text-blue-600 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Приклад вживання</h4>
                  <p className="text-slate-600 italic">"{extraExample}"</p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <Button
                  className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700"
                  onClick={generateMore}
                >
                  <Sparkles className="mr-2 w-4 h-4" /> Згенерувати ще прикладів
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AITutorMode;
