"use client";

import React, { useState, useEffect } from 'react';
import { Word } from '../../types/learning';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';

interface MatchGameProps {
  words: Word[];
  onFinish: () => void;
}

const MatchGame: React.FC<MatchGameProps> = ({ words, onFinish }) => {
  const [items, setItems] = useState<{id: string, text: string, type: 'orig' | 'trans'}[]>([]);
  const [selected, setSelected] = useState<{id: string, type: 'orig' | 'trans'} | null>(null);
  const [matched, setMatched] = useState<string[]>([]);

  useEffect(() => {
    const gameWords = words.slice(0, 6);
    const shuffled = [
      ...gameWords.map(w => ({ id: w.id, text: w.original, type: 'orig' as const })),
      ...gameWords.map(w => ({ id: w.id, text: w.translation, type: 'trans' as const }))
    ].sort(() => Math.random() - 0.5);
    setItems(shuffled);
  }, [words]);

  const handleClick = (item: {id: string, type: 'orig' | 'trans'}) => {
    if (matched.includes(item.id)) return;
    if (!selected) {
      setSelected(item);
      return;
    }
    if (selected.id === item.id && selected.type !== item.type) {
      setMatched([...matched, item.id]);
      setSelected(null);
      if (matched.length + 1 === items.length / 2) setTimeout(onFinish, 1000);
    } else {
      setSelected(item);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
      {items.map((item, idx) => (
        <motion.div
          key={`${item.id}-${item.type}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Card
            className={`p-6 h-32 flex items-center justify-center text-center cursor-pointer transition-all rounded-2xl border-2 ${
              matched.includes(item.id) ? 'opacity-0 pointer-events-none' :
              selected?.id === item.id && selected?.type === item.type ? 'border-primary bg-primary/5' : 'border-slate-200'
            }`}
            onClick={() => handleClick(item)}
          >
            <span className="font-bold text-slate-800">{item.text}</span>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default MatchGame;