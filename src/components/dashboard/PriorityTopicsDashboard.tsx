import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Flame, Rocket, ArrowRight } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { ENGLISH_COURSE, POLISH_COURSE, PYTHON_COURSE } from '../../lib/course-data';
import { getTrackProgress, isPriorityTopic, PRIORITY_BADGES } from '../../lib/priority';
import { CourseLevel, Subject, Topic } from '../../types/learning';
import { useLearningStore } from '../../store/useLearningStore';
import SpacedRepetitionPrompt from './SpacedRepetitionPrompt';

const SUBJECT_META: Record<Subject, { label: string; track: string; path: string; icon: React.ElementType; color: string }> = {
  English: { label: '⭐ ESSENTIAL ENGLISH', track: 'ESSENTIAL', path: '/course/English', icon: Star, color: 'text-amber-500' },
  Polish: { label: '⭐ ESSENTIAL POLISH', track: 'ESSENTIAL', path: '/course/Polish', icon: Star, color: 'text-emerald-500' },
  Python: { label: '🔥 CORE PYTHON', track: 'CORE', path: '/course/Python', icon: Flame, color: 'text-orange-500' },
};

const COURSE_BY_SUBJECT: Record<Subject, CourseLevel[]> = {
  English: ENGLISH_COURSE,
  Polish: POLISH_COURSE,
  Python: PYTHON_COURSE,
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

function SubjectSection({
  subject,
  completedLessonIds,
  nextTopicId,
}: {
  subject: Subject;
  completedLessonIds: Set<string>;
  nextTopicId?: string;
}) {
  const courses = COURSE_BY_SUBJECT[subject];
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

  const progress = getTrackProgress(courses, completedLessonIds);

  return (
    <Card className="p-6 rounded-3xl border-slate-200 bg-white">
      <div className="flex items-center justify-between mb-3">
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

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
          <span>{meta.track} TRACK</span>
          <span>{progress.completed}/{progress.total} • {progress.percent}%</span>
        </div>
        <Progress value={progress.percent} className="h-1.5" />
      </div>

      <div className="space-y-2">
        {unique.map((topic) => {
          const isNext = topic.id === nextTopicId;
          return (
            <Link
              key={topic.id}
              to={`${meta.path}`}
              className={`flex items-center justify-between p-3 rounded-2xl transition-colors group ${
                isNext ? 'bg-primary/5 ring-2 ring-primary/40' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex flex-col gap-1">
                <span className="font-bold text-slate-800 group-hover:text-primary transition-colors flex items-center gap-2">
                  {topic.title}
                  {isNext && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-primary text-white">
                      ▶ Наступний крок
                    </span>
                  )}
                </span>
                <span className="text-xs text-slate-500">{topic.lessons.length} lessons</span>
              </div>
              <Badge topic={topic} />
            </Link>
          );
        })}
      </div>
    </Card>
  );
}

const PriorityTopicsDashboard: React.FC = () => {
  const { lessonProgress, getRecommendation } = useLearningStore();
  const completedLessonIds = new Set(
    lessonProgress.filter((lp) => lp.completed).map((lp) => lp.lessonId)
  );
  const nextTopicId = getRecommendation().recommendedTopicId;

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-black text-slate-900 mb-2">📊 Most Important Topics</h2>
      <p className="text-slate-500 mb-6">Focus on what matters most for practical use.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SubjectSection subject="Python" completedLessonIds={completedLessonIds} nextTopicId={nextTopicId} />
        <SubjectSection subject="English" completedLessonIds={completedLessonIds} nextTopicId={nextTopicId} />
        <SubjectSection subject="Polish" completedLessonIds={completedLessonIds} nextTopicId={nextTopicId} />
      </div>
      <SpacedRepetitionPrompt />
    </div>
  );
};

export default PriorityTopicsDashboard;
