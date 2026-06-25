import { CourseLevel, Priority, PriorityBadge, Subject, Topic } from '../types/learning';

export const PRIORITY_BADGES: Record<Priority, PriorityBadge> = {
  core: { label: 'CORE TOPIC', variant: 'fire' },
  essential: { label: 'ESSENTIAL', variant: 'star' },
  high: { label: 'HIGH PRIORITY', variant: 'fire' },
  standard: { label: '', variant: 'star' },
};

export const PRIORITY_ORDER: Priority[] = ['core', 'essential', 'high', 'standard'];

export function priorityRank(p?: Priority): number {
  switch (p) {
    case 'core': return 0;
    case 'essential': return 1;
    case 'high': return 2;
    default: return 3;
  }
}

export function isPriorityTopic(topic: Topic): boolean {
  return topic.priority === 'core' || topic.priority === 'essential' || topic.priority === 'high';
}

export function getPriorityTopics(topics: Topic[]): Topic[] {
  return topics.filter(isPriorityTopic);
}

export function sortTopicsByPriority(topics: Topic[]): Topic[] {
  return [...topics].sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));
}

export const PRIORITY_LABELS: Record<Subject, string> = {
  English: '⭐ ESSENTIAL ENGLISH',
  Polish: '⭐ ESSENTIAL POLISH',
  Python: '🔥 CORE PYTHON (MOST IMPORTANT)',
};

export function getPriorityBadge(topic: Topic): PriorityBadge | null {
  if (!topic.priority || topic.priority === 'standard') return null;
  return PRIORITY_BADGES[topic.priority];
}

export interface TrackProgress {
  completed: number;
  total: number;
  percent: number;
}

// Progress across CORE / ESSENTIAL (priority) topics of a single course.
export function getTrackProgress(
  course: CourseLevel[],
  completedLessonIds: Set<string>
): TrackProgress {
  let total = 0;
  let completed = 0;
  course.forEach((level) => {
    level.topics.forEach((topic) => {
      if (!isPriorityTopic(topic)) return;
      topic.lessons.forEach((lesson) => {
        total += 1;
        if (completedLessonIds.has(lesson.id)) completed += 1;
      });
    });
  });
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percent };
}
