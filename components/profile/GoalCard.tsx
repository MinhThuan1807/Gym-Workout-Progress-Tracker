import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, CheckCircle2, X, MoreVertical, Clock } from "lucide-react";
import { Scale, Percent, Calendar, Dumbbell, Activity, Heart, Zap } from "lucide-react";
import { LucideIcon } from 'lucide-react';
export const goalTypeConfigs: Record<GoalType, { icon: LucideIcon; label: string; unit: string; color: string; higherIsBetter: boolean }> = {
  weight: { icon: Scale, label: 'Weight Goal', unit: 'kg', color: '#10b981', higherIsBetter: false },
  bodyFat: { icon: Percent, label: 'Body Fat %', unit: '%', color: '#f59e0b', higherIsBetter: false },
  sessionsWeek: { icon: Calendar, label: 'Sessions/Week', unit: 'sessions', color: '#3b82f6', higherIsBetter: true },
  oneRepMax: { icon: Dumbbell, label: 'One Rep Max', unit: 'kg', color: '#8b5cf6', higherIsBetter: true },
  strength: { icon: Activity, label: 'Strength', unit: 'points', color: '#ec4899', higherIsBetter: true },
  endurance: { icon: Heart, label: 'Endurance', unit: 'min', color: '#14b8a6', higherIsBetter: true },
  flexibility: { icon: Zap, label: 'Flexibility', unit: 'cm', color: '#f97316', higherIsBetter: true },
};
interface GoalCardProps {
  goal: Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
  const config = goalTypeConfigs[goal.type as GoalType];
  const Icon = config.icon;
  
  const calculateProgress = () => {
    const start = goal.startValue || goal.currentValue;
    const range = Math.abs(goal.targetValue - start);
    const progress = Math.abs(goal.currentValue - start);
    
    if (range === 0) return 100;
    return Math.min(100, Math.max(0, (progress / range) * 100));
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 33) return '#ef4444';
    if (percentage < 66) return '#f59e0b';
    return '#10b981';
  };

  const getDaysRemaining = () => {
    if (!goal.targetDate) return null;
    const now = new Date();
    const target = new Date(goal.targetDate);
    const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getStatusBadgeColor = (status: GoalStatus) => {
    switch(status) {
      case 'active': return 'bg-[#3b82f6] text-white';
      case 'achieved': return 'bg-[#fbbf24] text-white';
      case 'abandoned': return 'bg-[#6b7280] text-white';
    }
  };

  const progress = calculateProgress();
  const progressColor = getProgressColor(progress);
  const daysRemaining = getDaysRemaining();

  return (
    <Card className="rounded-xl border-[#e5e7eb] bg-[#f9fafb] hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${config.color}20` }}
            >
              <Icon className="w-5 h-5" style={{ color: config.color }} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-[#111827]">{goal.name}</h4>
              <p className="text-xs text-[#6b7280]">{config.label}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark Achieved
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-500">
                <X className="w-4 h-4 mr-2" />
                Abandon
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-[#6b7280]">
            <span>
              {goal.startValue && `${goal.startValue} ${goal.unit} →`} {goal.currentValue} {goal.unit}
            </span>
            <span className="text-[#111827]">
              Target: {goal.targetValue} {goal.unit}
            </span>
          </div>
          <Progress 
            value={progress} 
            className="h-2"
            style={{ backgroundColor: '#e5e7eb' }}
          />
          <div className="flex justify-between items-center">
            <span 
              className="text-sm"
              style={{ color: progressColor }}
            >
              {progress.toFixed(0)}% complete
            </span>
            {daysRemaining !== null && (
              <div className="flex items-center gap-1 text-xs text-[#6b7280]">
                <Clock className="w-3 h-3" />
                {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
              </div>
            )}
          </div>
        </div>

        {/* Linked Exercise */}
        {goal.linkedExerciseName && (
          <Badge variant="outline" className="rounded-lg text-xs border-[#e5e7eb]">
            <Dumbbell className="w-3 h-3 mr-1" />
            {goal.linkedExerciseName}
          </Badge>
        )}

        {/* Status Badge */}
        <Badge className={`${getStatusBadgeColor(goal.status)} rounded-lg text-xs capitalize`}>
          {goal.status}
        </Badge>
      </CardContent>
    </Card>
  );
}