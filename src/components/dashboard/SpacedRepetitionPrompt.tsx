import React from 'react';
import { useNavigate } from 'react-router-dom';
import { History, RotateCcw } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useLearningStore } from '../../store/useLearningStore';
import { getSpacedRepetitionDue } from '../../lib/learning-engine';

const INTERVAL_COLORS: Record<string, string> = {
  '3 дні': 'bg-amber-100 text-amber-700',
  '1 тиждень': 'bg-orange-100 text-orange-700',
  '1 місяць': 'bg-red-100 text-red-700',
};

const SpacedRepetitionPrompt: React.FC = () => {
  const navigate = useNavigate();
  const { lessonProgress } = useLearningStore();
  const due = getSpacedRepetitionDue(lessonProgress).slice(0, 6);

  if (due.length === 0) return null;

  return (
    <Card className="mt-8 p-6 rounded-3xl border-slate-200 bg-white">
      <div className="flex items-center gap-2 mb-2">
        <History className="w-5 h-5 text-indigo-500" />
        <h3 className="text-lg font-bold text-slate-900">🔁 Інтервальне повторення</h3>
      </div>
      <p className="text-slate-500 text-sm mb-4">
        Поверніться до ключових тем через 3 дні, 1 тиждень та 1 місяць, щоб закріпити їх у довгостроковій пам&apos;яті.
      </p>
      <div className="space-y-2">
        {due.map((item) => (
          <button
            key={item.lessonId}
            onClick={() => navigate(`/course/${item.subject}/lesson/${item.lessonId}`)}
            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors group text-left"
          >
            <div className="flex flex-col gap-1">
              <span className="font-bold text-slate-800 group-hover:text-primary transition-colors">{item.title}</span>
              <span className="text-xs text-slate-500">{item.subject}</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                  INTERVAL_COLORS[item.intervalLabel] ?? 'bg-slate-100 text-slate-600'
                }`}
              >
                {item.intervalLabel}
              </span>
              <Button variant="ghost" size="sm" className="rounded-xl">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default SpacedRepetitionPrompt;
