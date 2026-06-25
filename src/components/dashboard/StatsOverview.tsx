import React from 'react';
import { Trophy, Flame, Target, BookOpen } from 'lucide-react';
import { UserStats } from '../../types/learning';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';

interface StatsOverviewProps {
  stats: UserStats;
  completedLessons?: number;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, completedLessons = 0 }) => {
  const accuracy = stats.accuracy ?? (
    stats.totalAnswers > 0
      ? Math.round((stats.correctAnswers / stats.totalAnswers) * 100)
      : 100
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="p-6 flex items-center gap-4 bg-gradient-to-br from-orange-50 to-white border-orange-100">
        <div className="p-3 bg-orange-500 rounded-2xl text-white">
          <Flame className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground font-medium">Streak</p>
          <h3 className="text-2xl font-bold">{stats.streak} Days</h3>
        </div>
      </Card>

      <Card className="p-6 flex items-center gap-4 bg-gradient-to-br from-blue-50 to-white border-blue-100">
        <div className="p-3 bg-blue-500 rounded-2xl text-white">
          <Trophy className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground font-medium">Level {stats.level}</p>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-bold">{stats.xp % 1000}</h3>
            <span className="text-xs text-muted-foreground">/ 1000 XP</span>
          </div>
          <Progress value={(stats.xp % 1000) / 10} className="h-1.5 mt-2" />
        </div>
      </Card>

      <Card className="p-6 flex items-center gap-4 bg-gradient-to-br from-green-50 to-white border-green-100">
        <div className="p-3 bg-green-500 rounded-2xl text-white">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground font-medium">Lessons Done</p>
          <h3 className="text-2xl font-bold">{completedLessons}</h3>
        </div>
      </Card>

      <Card className="p-6 flex items-center gap-4 bg-gradient-to-br from-purple-50 to-white border-purple-100">
        <div className="p-3 bg-purple-500 rounded-2xl text-white">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground font-medium">Accuracy</p>
          <h3 className="text-2xl font-bold">{accuracy}%</h3>
        </div>
      </Card>
    </div>
  );
};

export default StatsOverview;
