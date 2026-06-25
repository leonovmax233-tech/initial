"use client";

import React, { useState, useEffect } from 'react';
import { Word } from '../../types/learning';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Mic, MicOff, Check, X, Volume2 } from 'lucide-react';
import { showSuccess, showError } from '../../utils/toast';

interface SpeakingModeProps {
  words: Word[];
  onResult: (wordId: string, correct: boolean) => void;
  onFinish: () => void;
}

const SpeakingMode: React.FC<SpeakingModeProps> = ({ words, onResult, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const currentWord = words[currentIndex];

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showError("Ваш браузер не підтримує розпізнавання мови.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript.toLowerCase();
      setTranscript(result);
      const isCorrect = result.includes(currentWord.original.toLowerCase());
      
      setStatus(isCorrect ? 'correct' : 'wrong');
      onResult(currentWord.id, isCorrect);

      setTimeout(() => {
        if (currentIndex < words.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setTranscript('');
          setStatus('idle');
        } else {
          onFinish();
        }
      }, 2000);
    };

    recognition.start();
  };

  return (
    <div className="max-w-xl mx-auto text-center">
      <Card className="p-10 rounded-3xl shadow-xl border-2 border-slate-100">
        <p className="text-sm text-muted-foreground mb-4">Вимовте це слово:</p>
        <h2 className="text-4xl font-bold text-primary mb-8">{currentWord.original}</h2>
        
        <div className="flex flex-col items-center gap-6">
          <Button
            size="lg"
            className={`w-24 h-24 rounded-full shadow-lg transition-all ${
              isListening ? 'bg-red-500 animate-pulse' : 'bg-primary'
            }`}
            onClick={startListening}
            disabled={isListening || status !== 'idle'}
          >
            {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
          </Button>

          <div className="h-12">
            {transcript && (
              <p className="text-lg font-medium text-slate-600 italic">
                Ви сказали: "{transcript}"
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {status === 'correct' && (
              <div className="flex items-center text-green-600 font-bold">
                <Check className="mr-2" /> Чудова вимова!
              </div>
            )}
            {status === 'wrong' && (
              <div className="flex items-center text-red-600 font-bold">
                <X className="mr-2" /> Спробуйте ще раз
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SpeakingMode;