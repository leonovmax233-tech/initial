import React, { useState } from 'react';
import { BookOpen, Code as Code2, CircleCheck as CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { Topic } from '../../types/learning';

const TopicTheory: React.FC<{ topic: Topic }> = ({ topic }) => {
  const [tab, setTab] = useState<'theory' | 'practice'>('theory');
  const [open, setOpen] = useState(false);

  const theory = topic.theory;
  const practiceTasks = topic.practiceTasks ?? [];

  if (!theory && practiceTasks.length === 0) return null;

  return (
    <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <span className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Theory & Practice
        </span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {open && (
        <div className="px-4 pb-4">
          <div className="flex gap-1 mb-4 border-b border-slate-200">
            <button
              onClick={() => setTab('theory')}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
                tab === 'theory'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              📘 Theory
            </button>
            <button
              onClick={() => setTab('practice')}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
                tab === 'practice'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Code2 className="w-4 h-4" />
              💻 Practice
            </button>
          </div>

          {tab === 'theory' && theory && (
            <div className="space-y-4">
              <p className="text-sm text-slate-700 leading-relaxed">{theory.explanation}</p>
              {theory.rules.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Key Rules</h5>
                  <ul className="space-y-1.5">
                    {theory.rules.map((rule, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {theory.examples.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    {topic.subject === 'Python' ? 'Code Examples' : 'Example Sentences'}
                  </h5>
                  <div className="space-y-2">
                    {theory.examples.map((ex, i) => (
                      <div key={i} className="rounded-xl bg-white border border-slate-200 p-3">
                        {topic.subject === 'Python' ? (
                          <>
                            <pre className="text-sm font-mono text-slate-800 whitespace-pre-wrap">{ex.original}</pre>
                            <p className="text-xs text-slate-500 mt-1">→ {ex.translation}</p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-medium text-slate-800">{ex.original}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{ex.translation}</p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'practice' && (
            <div className="space-y-2">
              {practiceTasks.length > 0 ? (
                <>
                  <p className="text-xs text-slate-500 mb-2">
                    {practiceTasks.length} practical tasks — click a lesson below to start practicing.
                  </p>
                  <ol className="space-y-1.5">
                    {practiceTasks.map((task, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="font-bold text-primary shrink-0">{i + 1}.</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ol>
                </>
              ) : (
                <p className="text-sm text-slate-500">
                  {topic.lessons.length} interactive exercises available below.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TopicTheory;
