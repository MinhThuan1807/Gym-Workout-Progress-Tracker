'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { 
    TrendingUp, TrendingDown, Dumbbell, Target, Scale, 
    Lightbulb, Calendar, CheckCircle2, Plus,
    ArrowRight, Minus
} from "lucide-react";
import { Suspense, useMemo } from "react";
import { SkeletonDashboard } from "@/components/skeleton/SkeletonDashboard";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// ===== TYPES =====
interface MetricEntry {
  id: string;
  date: string;
  metricType: string;
  value: number;
}

interface WorkoutSession {
  id: string;
  startTime: string;
  endTime?: string;
  planName?: string;
  exerciseCount: number;
  duration?: number;
}

interface Goal {
  id: string;
  name: string;
  status: 'active' | 'achieved' | 'abandoned';
  currentValue: number;
  targetValue: number;
  unit: string;
  achievedDate?: string;
}

interface WorkoutPlanDay {
  day: string;
  exercises: string[];
}

type ActivityItem = {
  id: string;
  type: 'workout' | 'metric' | 'goal';
  date: string;
  description: string;
  icon: any;
  color: string;
  details?: string;
};
// ===== MOCK DATA =====

// Weight data for last 30 days
const weightMetrics: MetricEntry[] = [
  { id: '1', date: '2025-10-07', metricType: 'weight', value: 82.0 },
  { id: '2', date: '2025-10-10', metricType: 'weight', value: 81.7 },
  { id: '3', date: '2025-10-14', metricType: 'weight', value: 81.4 },
  { id: '4', date: '2025-10-17', metricType: 'weight', value: 81.2 },
  { id: '5', date: '2025-10-21', metricType: 'weight', value: 81.0 },
  { id: '6', date: '2025-10-24', metricType: 'weight', value: 80.7 },
  { id: '7', date: '2025-10-28', metricType: 'weight', value: 80.4 },
  { id: '8', date: '2025-10-31', metricType: 'weight', value: 80.2 },
  { id: '9', date: '2025-11-03', metricType: 'weight', value: 80.0 },
  { id: '10', date: '2025-11-04', metricType: 'weight', value: 79.8 },
];

// Workout sessions for last 4 weeks
const workoutSessions: WorkoutSession[] = [
  { id: 's1', startTime: '2025-10-07T10:00:00', endTime: '2025-10-07T11:15:00', planName: 'Push Day', exerciseCount: 5, duration: 75 },
  { id: 's2', startTime: '2025-10-09T14:00:00', endTime: '2025-10-09T15:20:00', exerciseCount: 6, duration: 80 },
  { id: 's3', startTime: '2025-10-11T10:30:00', endTime: '2025-10-11T11:45:00', planName: 'Leg Day', exerciseCount: 4, duration: 75 },
  { id: 's4', startTime: '2025-10-14T09:00:00', endTime: '2025-10-14T10:30:00', planName: 'Pull Day', exerciseCount: 6, duration: 90 },
  { id: 's5', startTime: '2025-10-16T15:00:00', endTime: '2025-10-16T16:15:00', exerciseCount: 5, duration: 75 },
  { id: 's6', startTime: '2025-10-18T10:00:00', endTime: '2025-10-18T11:20:00', planName: 'Push Day', exerciseCount: 5, duration: 80 },
  { id: 's7', startTime: '2025-10-21T14:00:00', endTime: '2025-10-21T15:10:00', exerciseCount: 4, duration: 70 },
  { id: 's8', startTime: '2025-10-23T10:30:00', endTime: '2025-10-23T11:45:00', planName: 'Leg Day', exerciseCount: 5, duration: 75 },
  { id: 's9', startTime: '2025-10-25T09:00:00', endTime: '2025-10-25T10:30:00', planName: 'Pull Day', exerciseCount: 6, duration: 90 },
  { id: 's10', startTime: '2025-10-28T15:00:00', endTime: '2025-10-28T16:20:00', exerciseCount: 5, duration: 80 },
  { id: 's11', startTime: '2025-10-30T10:00:00', endTime: '2025-10-30T11:15:00', planName: 'Push Day', exerciseCount: 5, duration: 75 },
  { id: 's12', startTime: '2025-11-01T14:00:00', endTime: '2025-11-01T15:10:00', exerciseCount: 4, duration: 70 },
  { id: 's13', startTime: '2025-11-03T10:30:00', endTime: '2025-11-03T11:50:00', planName: 'Leg Day', exerciseCount: 6, duration: 80 },
  { id: 's14', startTime: '2025-11-04T09:00:00', endTime: '2025-11-04T10:20:00', planName: 'Pull Day', exerciseCount: 5, duration: 80 },
];

// Goals
const goals: Goal[] = [
  { id: 'g1', name: 'Reach 75kg', status: 'active', currentValue: 79.8, targetValue: 75, unit: 'kg' },
  { id: 'g2', name: 'Body Fat 12%', status: 'active', currentValue: 15.8, targetValue: 12, unit: '%' },
  { id: 'g3', name: 'Bench 100kg', status: 'active', currentValue: 92, targetValue: 100, unit: 'kg' },
  { id: 'g4', name: 'Train 5x/week', status: 'active', currentValue: 4.2, targetValue: 5, unit: 'sessions' },
  { id: 'g5', name: 'Deadlift 150kg', status: 'achieved', currentValue: 150, targetValue: 150, unit: 'kg', achievedDate: '2025-10-30' },
];

// Weekly schedule from plan
const weeklyPlan: WorkoutPlanDay[] = [
  { day: 'Monday', exercises: ['Bench Press', 'Shoulder Press', 'Tricep Dips'] },
  { day: 'Tuesday', exercises: ['Pull-ups', 'Deadlift', 'Rows'] },
  { day: 'Wednesday', exercises: [] }, // Rest
  { day: 'Thursday', exercises: ['Squat', 'Lunges', 'Leg Press'] },
  { day: 'Friday', exercises: ['Push-ups', 'Dips', 'Cable Flyes'] },
  { day: 'Saturday', exercises: [] }, // Rest
  { day: 'Sunday', exercises: [] }, // Rest
];


const Dashboard = () => {

// Calculate current week sessions
  const thisWeekSessions = useMemo(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1); // Monday
    weekStart.setHours(0, 0, 0, 0);
    
    return workoutSessions.filter(s => new Date(s.startTime) >= weekStart);
  }, []);

  // Calculate last week sessions
  const lastWeekSessions = useMemo(() => {
    const now = new Date();
    const lastWeekStart = new Date(now);
    lastWeekStart.setDate(now.getDate() - now.getDay() + 1 - 7);
    lastWeekStart.setHours(0, 0, 0, 0);
    const lastWeekEnd = new Date(lastWeekStart);
    lastWeekEnd.setDate(lastWeekStart.getDate() + 7);
    
    return workoutSessions.filter(s => {
      const sessionDate = new Date(s.startTime);
      return sessionDate >= lastWeekStart && sessionDate < lastWeekEnd;
    });
  }, []);

  // Get latest weight
  const latestWeight = useMemo(() => {
    return weightMetrics[weightMetrics.length - 1]?.value || 0;
  }, []);

  // Get weight from last month
  const lastMonthWeight = useMemo(() => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const entry = weightMetrics.find(m => new Date(m.date) <= oneMonthAgo);
    return entry?.value || weightMetrics[0]?.value || 0;
  }, []);

  // Calculate weight trend
  const weightTrend = useMemo(() => {
    return latestWeight - lastMonthWeight;
  }, [latestWeight, lastMonthWeight]);

  // Get sparkline data (last 7 days)
  const sparklineData = useMemo(() => {
    return weightMetrics.slice(-7).map(m => ({
      date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: m.value
    }));
  }, []);

  // Active goals
  const activeGoals = useMemo(() => goals.filter(g => g.status === 'active'), []);

  // Goals achieved this month
  const goalsAchievedThisMonth = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return goals.filter(g => 
      g.status === 'achieved' && 
      g.achievedDate && 
      new Date(g.achievedDate) >= monthStart
    ).length;
  }, []);

  // Weekly goal (from goals or default to 5)
  const weeklyGoal = useMemo(() => {
    const sessionGoal = goals.find(g => g.unit === 'sessions' && g.status === 'active');
    return sessionGoal?.targetValue || 5;
  }, []);

  // Weight chart data (last 30 days)
  const weightChartData = useMemo(() => {
    return weightMetrics.map(m => ({
      date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: m.value
    }));
  }, []);

  // Workout frequency data (last 4 weeks)
  const workoutFrequencyData = useMemo(() => {
    const now = new Date();
    const weeks = [3, 2, 1, 0].map(weeksAgo => {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay() + 1 - (weeksAgo * 7));
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const sessionsInWeek = workoutSessions.filter(s => {
        const sessionDate = new Date(s.startTime);
        return sessionDate >= weekStart && sessionDate < weekEnd;
      });

      return {
        week: `Week ${4 - weeksAgo}`,
        sessions: sessionsInWeek.length
      };
    });
    return weeks;
  }, []);

  // Recent activity feed
  const recentActivity = useMemo(() => {
    const activities: ActivityItem[] = [];

    // Add workout sessions
    workoutSessions.slice(-5).forEach(s => {
      activities.push({
        id: s.id,
        type: 'workout',
        date: s.startTime,
        description: s.planName ? `Completed ${s.planName}` : 'Completed workout',
        icon: Dumbbell,
        color: '#10b981',
        details: `${s.exerciseCount} exercises • ${s.duration} min`
      });
    });

    // Add recent metrics
    weightMetrics.slice(-3).forEach(m => {
      activities.push({
        id: m.id,
        type: 'metric',
        date: m.date,
        description: 'Logged weight',
        icon: Scale,
        color: '#3b82f6',
        details: `${m.value} kg`
      });
    });

    // Add achieved goals
    const achievedGoal = goals.find(g => g.status === 'achieved' && g.achievedDate);
    if (achievedGoal) {
      activities.push({
        id: achievedGoal.id,
        type: 'goal',
        date: achievedGoal.achievedDate!,
        description: `Achieved: ${achievedGoal.name}`,
        icon: Target,
        color: '#fbbf24',
        details: `${achievedGoal.targetValue} ${achievedGoal.unit}`
      });
    }

    // Sort by date DESC
    return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);
  }, []);

  // Format time ago
  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  // Get current week days with workout status
  const weekDays = useMemo(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1); // Monday
    
    return weeklyPlan.map((plan, index) => {
      const dayDate = new Date(weekStart);
      dayDate.setDate(weekStart.getDate() + index);
      
      const hasSession = workoutSessions.some(s => {
        const sessionDate = new Date(s.startTime);
        return sessionDate.toDateString() === dayDate.toDateString();
      });

      const isPlanned = plan.exercises.length > 0;
      const isToday = dayDate.toDateString() === now.toDateString();
      const isPast = dayDate < now && !isToday;
      const isFuture = dayDate > now;

      return {
        day: plan.day,
        date: dayDate,
        isPlanned,
        hasSession,
        isToday,
        isPast,
        isFuture,
        exercises: plan.exercises
      };
    });
  }, []);

  // Generate insights
  const insights = useMemo(() => {
    const insights = [];

    // Workout consistency
    const consistency = (thisWeekSessions.length / weeklyGoal) * 100;
    if (consistency >= 100) {
      insights.push("🎯 Excellent! You've hit your weekly workout goal!");
    } else if (consistency >= 80) {
      insights.push("💪 Great progress! You're almost at your weekly goal.");
    } else {
      insights.push(`📈 ${weeklyGoal - thisWeekSessions.length} more workouts to reach your weekly goal.`);
    }

    // Weight progress
    if (weightTrend < 0) {
      insights.push(`✅ You've lost ${Math.abs(weightTrend).toFixed(1)}kg this month. Keep it up!`);
    } else if (weightTrend > 0) {
      insights.push(`📊 You've gained ${weightTrend.toFixed(1)}kg this month.`);
    }

    // Rest day pattern
    const restDays = weekDays.filter(d => !d.isPlanned && d.isPast && !d.hasSession).length;
    if (restDays < 2) {
      insights.push("⚠️ Consider taking more rest days for recovery.");
    }

    // Goal progress
    const activeGoalsCount = activeGoals.length;
    if (goalsAchievedThisMonth > 0) {
      insights.push(`🏆 You achieved ${goalsAchievedThisMonth} goal(s) this month!`);
    }
    if (activeGoalsCount > 5) {
      insights.push("💡 Focus on fewer goals for better results.");
    }

    return insights;
  }, [thisWeekSessions, weeklyGoal, weightTrend, weekDays, activeGoals, goalsAchievedThisMonth]);
  
  return (
   <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-[#111827]">Dashboard</h1>
        <p className="text-[#6b7280]">Welcome back! Here's your fitness overview.</p>
      </div>

      {/* TOP STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 - Current Weight */}
        <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-[#6b7280]">Current Weight</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-[#10b981]/10 flex items-center justify-center">
              <Scale className="w-5 h-5 text-[#10b981]" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl text-[#111827]">{latestWeight.toFixed(1)} kg</div>
            <div className="flex items-center gap-2">
              {weightTrend < 0 ? (
                <TrendingDown className="w-4 h-4 text-[#10b981]" />
              ) : (
                <TrendingUp className="w-4 h-4 text-[#ef4444]" />
              )}
              <span className={`text-sm ${weightTrend < 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                {weightTrend < 0 ? '' : '+'}{weightTrend.toFixed(1)} kg from last month
              </span>
            </div>
            {/* Sparkline */}
            <div className="h-12">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData}>
                  <defs>
                    <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    fill="url(#weightGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Card 2 - Workouts This Week */}
        <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-[#6b7280]">Workouts This Week</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-[#3b82f6]" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl text-[#111827]">{thisWeekSessions.length}</div>
            <div className="flex items-center gap-2">
              {thisWeekSessions.length >= lastWeekSessions.length ? (
                <TrendingUp className="w-4 h-4 text-[#10b981]" />
              ) : (
                <TrendingDown className="w-4 h-4 text-[#ef4444]" />
              )}
              <span className={`text-sm ${
                thisWeekSessions.length >= lastWeekSessions.length ? 'text-[#10b981]' : 'text-[#ef4444]'
              }`}>
                {thisWeekSessions.length >= lastWeekSessions.length ? '+' : ''}
                {thisWeekSessions.length - lastWeekSessions.length} from last week
              </span>
            </div>
            {/* Circular Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-[#6b7280]">
                <span>Weekly Goal</span>
                <span>{thisWeekSessions.length}/{weeklyGoal}</span>
              </div>
              <Progress 
                value={(thisWeekSessions.length / weeklyGoal) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Card 3 - Active Goals */}
        <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-[#6b7280]">Active Goals</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-[#fbbf24]/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-[#fbbf24]" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl text-[#111827]">{activeGoals.length}</div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
              <span className="text-sm text-[#10b981]">
                {goalsAchievedThisMonth} achieved this month
              </span>
            </div>
            {/* Quick stats */}
            <div className="pt-2 space-y-1">
              {activeGoals.slice(0, 2).map(goal => {
                const progress = (goal.currentValue / goal.targetValue) * 100;
                return (
                  <div key={goal.id} className="flex items-center justify-between text-xs">
                    <span className="text-[#6b7280] truncate flex-1">{goal.name}</span>
                    <span className="text-[#111827] ml-2">{progress.toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left - Weight Progress */}
        <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-[#111827]">Weight Progress</CardTitle>
            <p className="text-sm text-[#6b7280]">Last 30 days</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weightChartData}>
                <defs>
                  <linearGradient id="weightAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  domain={['dataMin - 1', 'dataMax + 1']}
                  label={{ 
                    value: 'kg', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fill: '#6b7280' }
                  }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    padding: '8px 12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#10b981" 
                  fill="url(#weightAreaGradient)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Right - Workout Frequency */}
        <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-[#111827]">Workout Frequency</CardTitle>
            <p className="text-sm text-[#6b7280]">Last 4 weeks</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={workoutFrequencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="week" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  label={{ 
                    value: 'sessions', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fill: '#6b7280' }
                  }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    padding: '8px 12px'
                  }}
                />
                <Bar 
                  dataKey="sessions" 
                  fill="#3b82f6" 
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* RECENT ACTIVITY & INSIGHTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - 2/3 width */}
        <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[#111827]">Recent Activity</CardTitle>
                <p className="text-sm text-[#6b7280]">Your latest fitness activities</p>
              </div>
              <Button variant="ghost" size="sm" className="rounded-xl text-[#3b82f6]">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${activity.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: activity.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm text-[#111827]">{activity.description}</p>
                          {activity.details && (
                            <p className="text-xs text-[#6b7280] mt-1">{activity.details}</p>
                          )}
                        </div>
                        <span className="text-xs text-[#6b7280] whitespace-nowrap">
                          {timeAgo(activity.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Insights Card - 1/3 width */}
        <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-gradient-to-br from-[#fbbf24]/10 to-[#f59e0b]/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#fbbf24]/20 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-[#fbbf24]" />
              </div>
              <CardTitle className="text-[#111827]">Insights</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="p-3 bg-white/80 rounded-xl">
                <p className="text-sm text-[#111827]">{insight}</p>
              </div>
            ))}
            <Separator />
            <Button variant="ghost" size="sm" className="w-full rounded-xl text-[#3b82f6]">
              View Detailed Analytics
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* WEEKLY SCHEDULE PREVIEW */}
      <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#111827]">This Week's Schedule</CardTitle>
              <p className="text-sm text-[#6b7280]">Planned and completed workouts</p>
            </div>
            <Button size="sm" className="rounded-xl bg-[#10b981] hover:bg-[#059669]">
              <Plus className="w-4 h-4 mr-2" />
              Log Workout
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {weekDays.map((dayInfo, index) => (
              <Card 
                key={index}
                className={`rounded-xl cursor-pointer transition-all hover:shadow-md ${
                  dayInfo.isToday 
                    ? 'border-2 border-[#3b82f6] bg-[#3b82f6]/5' 
                    : dayInfo.hasSession
                    ? 'border-[#10b981] bg-[#10b981]/5'
                    : dayInfo.isPlanned && dayInfo.isFuture
                    ? 'border-[#3b82f6]/30 bg-[#3b82f6]/5'
                    : 'border-[#e5e7eb] bg-[#f9fafb]'
                }`}
              >
                <CardContent className="p-4 text-center space-y-2">
                  <div className="text-xs text-[#6b7280]">
                    {dayInfo.day.substring(0, 3)}
                  </div>
                  <div className="text-xl text-[#111827]">
                    {dayInfo.date.getDate()}
                  </div>
                  {dayInfo.hasSession ? (
                    <div className="flex flex-col items-center gap-1">
                      <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                      <Badge className="bg-[#10b981] text-white text-xs px-2 py-0.5">
                        Done
                      </Badge>
                    </div>
                  ) : dayInfo.isPlanned ? (
                    <div className="flex flex-col items-center gap-1">
                      <Calendar className="w-5 h-5 text-[#3b82f6]" />
                      <Badge variant="outline" className="text-xs px-2 py-0.5 border-[#3b82f6] text-[#3b82f6]">
                        Planned
                      </Badge>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Minus className="w-5 h-5 text-[#6b7280]" />
                      <Badge variant="outline" className="text-xs px-2 py-0.5 border-[#6b7280] text-[#6b7280]">
                        Rest
                      </Badge>
                    </div>
                  )}
                  {dayInfo.isToday && (
                    <div className="absolute top-1 right-1">
                      <div className="w-2 h-2 bg-[#3b82f6] rounded-full animate-pulse" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default Dashboard;