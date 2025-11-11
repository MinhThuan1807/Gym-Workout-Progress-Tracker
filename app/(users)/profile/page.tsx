'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Trophy, Flame, Target, TrendingUp, Edit, Plus, Scale, Percent, 
  Calendar, Dumbbell, Activity, Heart, Zap, CheckCircle2, X, 
  Lock, Camera, MoreVertical, Clock
} from "lucide-react";
import { LucideIcon } from 'lucide-react';

import { useMemo, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
type GoalType = 'weight' | 'bodyFat' | 'sessionsWeek' | 'oneRepMax' | 'strength' | 'endurance' | 'flexibility';
type GoalStatus = 'active' | 'achieved' | 'abandoned';

// ===== GOAL TYPE CONFIGS =====
const goalTypeConfigs: Record<GoalType, { icon: LucideIcon; label: string; unit: string; color: string; higherIsBetter: boolean }> = {
  weight: { icon: Scale, label: 'Weight Goal', unit: 'kg', color: '#10b981', higherIsBetter: false },
  bodyFat: { icon: Percent, label: 'Body Fat %', unit: '%', color: '#f59e0b', higherIsBetter: false },
  sessionsWeek: { icon: Calendar, label: 'Sessions/Week', unit: 'sessions', color: '#3b82f6', higherIsBetter: true },
  oneRepMax: { icon: Dumbbell, label: 'One Rep Max', unit: 'kg', color: '#8b5cf6', higherIsBetter: true },
  strength: { icon: Activity, label: 'Strength', unit: 'points', color: '#ec4899', higherIsBetter: true },
  endurance: { icon: Heart, label: 'Endurance', unit: 'min', color: '#14b8a6', higherIsBetter: true },
  flexibility: { icon: Zap, label: 'Flexibility', unit: 'cm', color: '#f97316', higherIsBetter: true },
};
//========= Mock Data ==========
const mockProfile: UserProfile = {
  displayName: 'John Doe',
  email: 'john.doe@email.com',
  gender: 'male',
  dob: '1996-05-15',
  heightCm: 178,
  weightKg: 79.8,
  avatarUrl: 'https://images.unsplash.com/photo-1711006366881-5076ba350008?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjB3b3Jrb3V0JTIwcGVyc29ufGVufDF8fHx8MTc1OTQ5Mjk1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  role: 'Pro Member'
};
const mockGoals: Goal[] = [
  {
    _id: 'goal-1',
    type: 'weight',
    name: 'Reach Target Weight',
    startValue: 84,
    currentValue: 79.8,
    targetValue: 75,
    unit: 'kg',
    status: 'active',
    startDate: '2025-09-01',
    targetDate: '2025-12-31',
    notes: 'Aiming for slow, sustainable weight loss'
  },
  {
    _id: 'goal-2',
    type: 'bodyFat',
    name: 'Body Fat Reduction',
    startValue: 18,
    currentValue: 15.8,
    targetValue: 12,
    unit: '%',
    status: 'active',
    startDate: '2025-09-01',
    targetDate: '2025-12-31'
  },
  {
    _id: 'goal-3',
    type: 'oneRepMax',
    name: 'Bench Press 100kg',
    startValue: 80,
    currentValue: 92,
    targetValue: 100,
    unit: 'kg',
    status: 'active',
    startDate: '2025-10-01',
    targetDate: '2025-12-01',
    linkedExerciseId: 2,
    linkedExerciseName: 'Bench Press'
  },
  {
    _id: 'goal-4',
    type: 'sessionsWeek',
    name: 'Train 5x Per Week',
    currentValue: 4.2,
    targetValue: 5,
    unit: 'sessions',
    status: 'active',
    startDate: '2025-11-01'
  },
  {
    _id: 'goal-5',
    type: 'strength',
    name: 'Deadlift 150kg',
    startValue: 120,
    currentValue: 150,
    targetValue: 150,
    unit: 'kg',
    status: 'achieved',
    startDate: '2025-08-01',
    targetDate: '2025-10-31',
    linkedExerciseId: 3,
    linkedExerciseName: 'Deadlift'
  }
];
const mockAchievements: Achievement[] = [
  { _id: 'ach-1', name: 'First Workout', description: 'Complete your first training session', icon: '🎯', unlocked: true, color: '#10b981' },
  { _id: 'ach-2', name: '10 Workouts', description: 'Complete 10 training sessions', icon: '💪', unlocked: true, color: '#3b82f6' },
  { _id: 'ach-3', name: '50 Workouts', description: 'Complete 50 training sessions', icon: '🔥', unlocked: true, color: '#f59e0b' },
  { _id: 'ach-4', name: '100 Workouts', description: 'Complete 100 training sessions', icon: '🏆', unlocked: true, color: '#fbbf24' },
  { _id: 'ach-5', name: '7 Day Streak', description: 'Train for 7 consecutive days', icon: '⚡', unlocked: true, color: '#f97316' },
  { _id: 'ach-6', name: '30 Day Streak', description: 'Train for 30 consecutive days', icon: '🌟', unlocked: false, progress: 12, requirement: 30, color: '#8b5cf6' },
  { _id: 'ach-7', name: 'First Goal', description: 'Achieve your first fitness goal', icon: '🎖️', unlocked: true, color: '#ec4899' },
  { _id: 'ach-8', name: '10,000kg Volume', description: 'Lift 10,000kg total volume', icon: '💎', unlocked: true, color: '#14b8a6' },
  { _id: 'ach-9', name: '50,000kg Volume', description: 'Lift 50,000kg total volume', icon: '👑', unlocked: false, progress: 28500, requirement: 50000, color: '#6366f1' },
  { _id: 'ach-10', name: 'Bodyweight Bench', description: 'Bench press your bodyweight', icon: '🦾', unlocked: true, color: '#10b981' },
  { _id: 'ach-11', name: '1.5x Bodyweight Bench', description: 'Bench press 1.5x your bodyweight', icon: '🚀', unlocked: false, progress: 92, requirement: 120, color: '#f59e0b' },
  { _id: 'ach-12', name: 'Elite Lifter', description: 'Join the 1000lb club (Squat+Bench+Deadlift)', icon: '⭐', unlocked: false, progress: 780, requirement: 1000, color: '#fbbf24' },
];
const quickStats = {
  totalWorkouts: 124,
  currentStreak: 12,
  goalsAchieved: 3,
  totalGoals: 5,
  totalVolume: 28500
};

export default function ProfilePage() {
    const [profile] = useState<UserProfile>(mockProfile);
    const [goals, setGoals] = useState<Goal[]>(mockGoals);
    const [achievements] = useState<Achievement[]>(mockAchievements);
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [selectedGoalType, setSelectedGoalType] = useState<GoalType>('weight');

    const activeGoals = useMemo(() => goals.filter(g => g.status === 'active'), [goals]);
    const achievedGoals = useMemo(() => goals.filter(g => g.status === 'achieved'), [goals]);
    const unlockedAchievements = useMemo(() => achievements.filter(a => a.unlocked), [achievements]);

    const calculateProgress = (goal: Goal) => {
        const config = goalTypeConfigs[goal.type as GoalType];
        const start = goal.startValue || goal.currentValue;
        const range = Math.abs(goal.targetValue - start);
        const progress = Math.abs(goal.currentValue - start);
        
        if (range === 0) return 100;
            return Math.min(100, Math.max(0, (progress / range) * 100));
    };

    const getProgressColor = (percentage: number) => {
        if (percentage < 33) return '#ef4444'; // red
        if (percentage < 66) return '#f59e0b'; // yellow/orange
        return '#10b981'; // green
    };

    const getDaysRemaining = (targetDate?: string) => {
        if (!targetDate) return null;
        const now = new Date();
        const target = new Date(targetDate);
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

 return (
    <div className="space-y-6">
      {/* HERO SECTION */}
      <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[#10b981] to-[#3b82f6] opacity-10" />
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              {/* Large Avatar with Edit Overlay */}
              <div className="relative group">
                <Avatar className="w-[120px] h-[120px] border-4 border-white shadow-lg">
                  <AvatarImage src={profile.avatarUrl} />
                  <AvatarFallback className="text-2xl">
                    {profile.displayName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Name, Email, Role */}
              <div>
                <h1 className="text-3xl text-[#111827] mb-1">{profile.displayName}</h1>
                <p className="text-[#6b7280] mb-2">{profile.email}</p>
                <Badge className="bg-[#10b981] text-white rounded-lg px-3 py-1">
                  {profile.role}
                </Badge>
              </div>
            </div>

            {/* Edit Profile Button */}
            <Button 
              variant="outline" 
              className="rounded-xl border-[#e5e7eb]"
              onClick={() => setIsEditProfileOpen(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN - Personal Info + Goals */}
        <div className="lg:col-span-2 space-y-6">
          {/* PERSONAL INFO FORM */}
          <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-[#111827] pt-3">Personal Information</CardTitle>
              <p className="text-sm text-[#6b7280]">Manage your profile details</p>
            </CardHeader>
            <CardContent className="space-y-4 pb-3">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#111827]">Display Name</Label>
                  <Input 
                    defaultValue={profile.displayName} 
                    className="rounded-xl border-[#e5e7eb]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#111827]">Gender</Label>
                  <Select defaultValue={profile.gender}>
                    <SelectTrigger className="rounded-xl border-[#e5e7eb]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#111827]">Date of Birth</Label>
                  <Input 
                    type="date"
                    defaultValue={profile.dob} 
                    className="rounded-xl border-[#e5e7eb]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#111827]">Height (cm)</Label>
                  <Input 
                    type="number"
                    defaultValue={profile.heightCm} 
                    className="rounded-xl border-[#e5e7eb]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#111827]">Weight (kg)</Label>
                  <Input 
                    type="number"
                    step="0.1"
                    defaultValue={profile.weightKg} 
                    className="rounded-xl border-[#e5e7eb]"
                  />
                </div>
              </div>
              <Button className="w-full rounded-xl bg-[#10b981] hover:bg-[#059669]">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* GOALS SECTION */}
          <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#111827] pt-3">Active Goals</CardTitle>
                  <p className="text-sm text-[#6b7280]">Track your fitness objectives</p>
                </div>
                <Button 
                  className="rounded-xl bg-[#10b981] hover:bg-[#059669]"
                  onClick={() => setIsGoalModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Goal
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {activeGoals.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {activeGoals.map((goal) => {
                    const config = goalTypeConfigs[goal.type as GoalType];
                    const Icon = config.icon;
                    const progress = calculateProgress(goal);
                    const progressColor = getProgressColor(progress);
                    const daysRemaining = getDaysRemaining(goal.targetDate);

                    return (
                      <Card key={goal._id} className="rounded-xl border-[#e5e7eb] bg-[#f9fafb] hover:shadow-md transition-shadow">
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

                          {/* Progress Ring/Bar */}
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
                              style={{ 
                                backgroundColor: '#e5e7eb',
                              }}
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
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Target className="w-16 h-16 mx-auto text-[#6b7280] mb-4" />
                  <p className="text-[#6b7280]">No active goals yet</p>
                  <Button 
                    className="mt-4 rounded-xl bg-[#10b981] hover:bg-[#059669]"
                    onClick={() => setIsGoalModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Goal
                  </Button>
                </div>
              )}

              {/* Achieved Goals Section */}
              {achievedGoals.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h4 className="text-sm text-[#6b7280] mb-3">Achieved Goals ({achievedGoals.length})</h4>
                    <div className="space-y-2 pb-3">
                      {achievedGoals.map((goal) => {
                        const config = goalTypeConfigs[goal.type as GoalType];
                        const Icon = config.icon;
                        
                        return (
                          <div key={goal._id} className="flex items-center gap-3 p-3 rounded-xl bg-[#fbbf24]/10 border border-[#fbbf24]/20">
                            <div className="w-8 h-8 rounded-lg bg-[#fbbf24]/20 flex items-center justify-center">
                              <Icon className="w-4 h-4 text-[#fbbf24]" />
                            </div>
                            <div className="flex-1">
                              <h5 className="text-sm text-[#111827]">{goal.name}</h5>
                              <p className="text-xs text-[#6b7280]">
                                Achieved {goal.targetValue} {goal.unit}
                              </p>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-[#fbbf24]" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN - Quick Stats + Achievements */}
        <div className="space-y-6">
          {/* QUICK STATS */}
          <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-[#111827] pt-3">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 pb-3">
                {/* Total Workouts */}
                <Card className="rounded-xl border-[#e5e7eb] bg-[#10b981]/5">
                  <CardContent className="p-4 text-center ">
                    <Trophy className="w-8 h-8 mx-auto text-[#10b981] mb-2" />
                    <p className="text-2xl text-[#111827]">{quickStats.totalWorkouts}</p>
                    <p className="text-xs text-[#6b7280]">Total Workouts</p>
                  </CardContent>
                </Card>

                {/* Current Streak */}
                <Card className="rounded-xl border-[#e5e7eb] bg-[#f59e0b]/5">
                  <CardContent className="p-4 text-center ">
                    <Flame className="w-8 h-8 mx-auto text-[#f59e0b] mb-2" />
                    <p className="text-2xl text-[#111827]">{quickStats.currentStreak}</p>
                    <p className="text-xs text-[#6b7280]">Day Streak</p>
                  </CardContent>
                </Card>

                {/* Goals Achieved */}
                <Card className="rounded-xl border-[#e5e7eb] bg-[#3b82f6]/5">
                  <CardContent className="p-4 text-center">
                    <Target className="w-8 h-8 mx-auto text-[#3b82f6] mb-2" />
                    <p className="text-2xl text-[#111827]">
                      {quickStats.goalsAchieved}/{quickStats.totalGoals}
                    </p>
                    <p className="text-xs text-[#6b7280]">Goals Achieved</p>
                  </CardContent>
                </Card>

                {/* Total Volume */}
                <Card className="rounded-xl border-[#e5e7eb] bg-[#8b5cf6]/5">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-8 h-8 mx-auto text-[#8b5cf6] mb-2" />
                    <p className="text-2xl text-[#111827]">{(quickStats.totalVolume / 1000).toFixed(1)}k</p>
                    <p className="text-xs text-[#6b7280]">Volume (kg)</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* ACHIEVEMENTS */}
          <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-[#111827] pt-3">Achievements</CardTitle>
              <p className="text-sm text-[#6b7280]">
                {unlockedAchievements.length}/{achievements.length} unlocked
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement._id}
                    className={`relative group cursor-pointer transition-all duration-300 ${
                      achievement.unlocked 
                        ? 'hover:scale-105' 
                        : 'grayscale opacity-50'
                    }`}
                  >
                    {/* Hexagon Badge */}
                    <div 
                      className={`relative w-full aspect-square rounded-2xl flex flex-col items-center justify-center p-3 ${
                        achievement.unlocked 
                          ? 'bg-gradient-to-br shadow-lg' 
                          : 'bg-[#e5e7eb]'
                      }`}
                      style={
                        achievement.unlocked 
                          ? { 
                              backgroundImage: `linear-gradient(135deg, ${achievement.color}20, ${achievement.color}40)`,
                              boxShadow: achievement.unlocked ? `0 4px 20px ${achievement.color}40` : 'none'
                            }
                          : {}
                      }
                    >
                      <div className="text-3xl mb-1">{achievement.icon}</div>
                      <p className="text-xs text-center text-[#111827] leading-tight">
                        {achievement.name}
                      </p>
                      
                      {/* Lock Icon for Locked Achievements */}
                      {!achievement.unlocked && (
                        <div className="absolute top-2 right-2">
                          <Lock className="w-4 h-4 text-[#6b7280]" />
                        </div>
                      )}

                      {/* Glow Effect for Unlocked */}
                      {achievement.unlocked && (
                        <div 
                          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ 
                            boxShadow: `0 0 30px ${achievement.color}80`,
                            animation: 'pulse 2s infinite'
                          }}
                        />
                      )}
                    </div>

                    {/* Progress Bar for Locked Achievements */}
                    {!achievement.unlocked && achievement.progress !== undefined && achievement.requirement && (
                      <div className="mt-2">
                        <Progress 
                          value={(achievement.progress / achievement.requirement) * 100} 
                          className="h-1"
                        />
                        <p className="text-xs text-[#6b7280] text-center mt-1">
                          {achievement.progress}/{achievement.requirement}
                        </p>
                      </div>
                    )}

                    {/* Hover Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {achievement.description}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/90" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CREATE GOAL MODAL */}
      <Dialog open={isGoalModalOpen} onOpenChange={setIsGoalModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#111827]">Create New Goal</DialogTitle>
            <DialogDescription className="text-[#6b7280]">
              Set a new fitness objective to track your progress
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Goal Type Selector */}
            <div className="space-y-2">
              <Label className="text-[#111827]">Goal Type</Label>
              <Select value={selectedGoalType} onValueChange={(value) => setSelectedGoalType(value as GoalType)}>
                <SelectTrigger className="rounded-xl border-[#e5e7eb]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(goalTypeConfigs).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" style={{ color: config.color }} />
                          <span>{config.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Goal Name */}
            <div className="space-y-2">
              <Label className="text-[#111827]">Goal Name</Label>
              <Input 
                placeholder="e.g., Reach 75kg"
                className="rounded-xl border-[#e5e7eb]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Start Value */}
              <div className="space-y-2">
                <Label className="text-[#111827]">
                  Start Value (Optional)
                  <span className="text-[#6b7280] ml-2">({goalTypeConfigs[selectedGoalType].unit})</span>
                </Label>
                <Input 
                  type="number"
                  step="0.1"
                  placeholder="Auto-filled"
                  className="rounded-xl border-[#e5e7eb]"
                />
              </div>

              {/* Target Value */}
              <div className="space-y-2">
                <Label className="text-[#111827]">
                  Target Value
                  <span className="text-[#6b7280] ml-2">({goalTypeConfigs[selectedGoalType].unit})</span>
                </Label>
                <Input 
                  type="number"
                  step="0.1"
                  placeholder="Enter target"
                  className="rounded-xl border-[#e5e7eb]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="space-y-2">
                <Label className="text-[#111827]">Start Date</Label>
                <Input 
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="rounded-xl border-[#e5e7eb]"
                />
              </div>

              {/* Target Date */}
              <div className="space-y-2">
                <Label className="text-[#111827]">Target Date (Optional)</Label>
                <Input 
                  type="date"
                  className="rounded-xl border-[#e5e7eb]"
                />
              </div>
            </div>

            {/* Link to Exercise (for strength/1RM goals) */}
            {(selectedGoalType === 'oneRepMax' || selectedGoalType === 'strength') && (
              <div className="space-y-2">
                <Label className="text-[#111827]">Link to Exercise</Label>
                <Select>
                  <SelectTrigger className="rounded-xl border-[#e5e7eb]">
                    <SelectValue placeholder="Select exercise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Barbell Squat</SelectItem>
                    <SelectItem value="2">Bench Press</SelectItem>
                    <SelectItem value="3">Deadlift</SelectItem>
                    <SelectItem value="4">Pull-Up</SelectItem>
                    <SelectItem value="8">Dumbbell Shoulder Press</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label className="text-[#111827]">Notes (Optional)</Label>
              <Textarea 
                placeholder="Add any additional details about this goal..."
                className="rounded-xl border-[#e5e7eb] min-h-[100px]"
              />
            </div>

            {/* Save Button */}
            <div className="flex gap-3 pt-4 border-t border-[#e5e7eb]">
              <Button 
                className="flex-1 bg-[#10b981] hover:bg-[#059669] rounded-xl"
                onClick={() => setIsGoalModalOpen(false)}
              >
                <Target className="w-4 h-4 mr-2" />
                Create Goal
              </Button>
              <Button 
                variant="ghost" 
                className="rounded-xl"
                onClick={() => setIsGoalModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* EDIT PROFILE MODAL */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="max-w-2xl bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#111827]">Edit Profile</DialogTitle>
            <DialogDescription className="text-[#6b7280]">
              Update your personal information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#111827]">Display Name</Label>
                <Input 
                  defaultValue={profile.displayName}
                  className="rounded-xl border-[#e5e7eb]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#111827]">Email</Label>
                <Input 
                  type="email"
                  defaultValue={profile.email}
                  className="rounded-xl border-[#e5e7eb]"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-[#e5e7eb]">
              <Button 
                className="flex-1 bg-[#10b981] hover:bg-[#059669] rounded-xl"
                onClick={() => setIsEditProfileOpen(false)}
              >
                Save Changes
              </Button>
              <Button 
                variant="ghost" 
                className="rounded-xl"
                onClick={() => setIsEditProfileOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
