"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Sparkles, Trash2, Save } from 'lucide-react';
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
        };
      })
      .filter(Boolean) as any[];

    if (words.length === 0) {
      showError('No valid words found. Use format: word - translation');
      return;
    }

    const newSet = {
      id: uuidv4(),
      title: title || 'Untitled Set',
      description: '',
      sourceLanguage: 'English' as any,
      targetLanguage: 'Ukrainian' as any,
      words,
      createdAt: Date.now(),
    };

    addSet(newSet);
    showSuccess(`Created set with ${words.length} words!`);
    navigate('/');
  };

  const handleAIGenerate = async () => {
    if (!title) {
      showError('Please enter a topic in the title field first');
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
      }));
      
      const newSet = {
        id: uuidv4(),
        title: `AI: ${title}`,
        description: `Generated vocabulary for ${title}`,
        sourceLanguage: 'English' as any,
        targetLanguage: 'Ukrainian' as any,
        words: words as any,
        createdAt: Date.now(),
      };
      
      addSet(newSet);
      showSuccess('AI generated a new set for you!');
      navigate('/');
    } catch (err) {
      showError('Failed to generate set');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Create New Set</h1>
        <Button variant="outline" onClick={() => navigate('/')}>Cancel</Button>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <label className="block text-sm font-medium mb-2">Set Title or Topic</label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Travel Essentials or Business English"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg"
            />
            <Button 
              onClick={handleAIGenerate} 
              disabled={isGenerating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Sparkles className="mr-2 w-4 h-4" />
              {isGenerating ? 'Generating...' : 'AI Generate'}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium">Bulk Import</label>
            <span className="text-xs text-muted-foreground">Format: word - translation (one per line)</span>
          </div>
          <Textarea
            placeholder="apple - яблуко&#10;house - будинок&#10;go to school - ходити до школи"
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            className="min-h-[300px] font-mono text-sm"
          />
          <Button onClick={handleBulkParse} className="w-full mt-6 py-6 text-lg">
            <Save className="mr-2 w-5 h-5" /> Create Study Set
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default CreateSet;