import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Flame, Rocket, ArrowRight } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ENGLISH_COURSE, POLISH_COURSE, PYTHON_COURSE } from '../../lib/course-data';
import { isPriorityTopic, PRIORITY_BADGES } from '../../lib/priority';
import { Subject, Topic } from '../../types/learning';

const SUBJECT_META: Record<Subject, { label: string; path: string; icon: React.ElementType; color: string }> = {
  English: { label: '⭐ ESSENTIAL ENGLISH', path: '/course/English', icon: Star, color: 'text-amber-500' },
  Polish: { label: '⭐ ESSENTIAL POLISH', path: '/course/Polish', icon: Star, color: 'text-emerald-500' },
  Python: { label: '🔥 CORE PYTHON', path: '/course/Python', icon: Flame, color: 'text-orange-500' },
};

function Badge({ topic }: { topic: Topic }) {
  const badge = topic.priority ? PRIORITY_BADGES[topic.priority] : null;
  if (!badge || !badge.label) return null;
  const Icon = badge.variant === 'fire' ? Flame : badge.variant === 'rocket' ? Rocket : Star;
  const color =
    topic.priority === 'core'
      ? 'bg-orange-100 text-orange-700'
      : topic.priority === 'essential'
        ? 'bg-amber-100 text-amber-700'
        : 'bg-red-100 text-red-700';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${color}`}>
      <Icon className="w-3 h-3" />
      {badge.label}
    </span>
  );
}

function SubjectSection({ subject }: { subject: Subject }) {
  const courses = subject === 'English' ? ENGLISH_COURSE : subject === 'Polish' ? POLISH_COURSE : PYTHON_COURSE;
  const meta = SUBJECT_META[subject];
  const priorityTopics: Topic[] = [];
  courses.forEach((level) => {
    level.topics.forEach((t) => {
      if (isPriorityTopic(t)) priorityTopics.push(t);
    });
  });
  // Dedupe by id (topics repeat across levels)
  const seen = new Set<string>();
  const unique = priorityTopics.filter((t) => {
    if (seen.has(t.id)) return false;
    seen.add(t.id);
    return true;
  }).slice(0, 12);

  if (unique.length === 0) return null;

  return (
    <Card className="p-6 rounded-3xl border-slate-200 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <meta.icon className={`w-5 h-5 ${meta.color}`} />
          <h3 className="text-lg font-bold text-slate-900">{meta.label}</h3>
        </div>
        <Link to={meta.path}>
          <Button variant="ghost" size="sm" className="rounded-xl">
            All <ArrowRight className="ml-1 w-3 h-3" />
          </Button>
        </Link>
      </div>
      <div className="space-y-2">
        {unique.map((topic) => (
          <Link
            key={topic.id}
            to={`${meta.path}`}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors group"
          >
            <div className="flex flex-col gap-1">
              <span className="font-bold text-slate-800 group-hover:text-primary transition-colors">{topic.title}</span>
              <span className="text-xs text-slate-500">{topic.lessons.length} lessons</span>
            </div>
            <Badge topic={topic} />
          </Link>
        ))}
      </div>
    </Card>
  );
}

const PriorityTopicsDashboard: React.FC = () => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-black text-slate-900 mb-2">📊 Most Important Topics</h2>
      <p className="text-slate-500 mb-6">Focus on what matters most for practical use.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SubjectSection subject="Python" />
        <SubjectSection subject="English" />
        <SubjectSection subject="Polish" />
      </div>
    </div>
  );
};

export default PriorityTopicsDashboard;
