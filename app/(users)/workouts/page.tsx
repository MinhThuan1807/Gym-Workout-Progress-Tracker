'use client'

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, ChevronRight, Dumbbell, Smile, Meh, Frown, Edit, Play, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GripVertical } from "lucide-react";
import { Clock, TrendingUp, Battery } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Image } from "@radix-ui/react-avatar";

// ===== MOCK DATA =====

const mockPlans: WorkoutPlan[] = [
  {
    id: "plan-1",
    name: "Push Pull Legs",
    goalHint: "Build muscle and strength with a 6-day split",
    isActive: true,
    startDate: "2025-11-01",
    endDate: "2025-12-31",
    weeklySchedule: {
      sunday: [],
      monday: [
        {
          id: "ex-1",
          exerciseId: 2,
          exerciseName: "Bench Press",
          exerciseThumbnail: "https://images.unsplash.com/photo-1651346847980-ab1c883e8cc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZW5jaCUyMHByZXNzJTIwZXhlcmNpc2V8ZW58MXx8fHwxNzYyNDk5MjUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          targetSets: 4,
          repsMin: 8,
          repsMax: 10,
          targetWeight: 80,
          restTime: 180,
          tempo: "3-1-1-0"
        },
        {
          id: "ex-2",
          exerciseId: 8,
          exerciseName: "Dumbbell Shoulder Press",
          exerciseThumbnail: "https://images.unsplash.com/photo-1580569688519-b3a259826ad4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG91bGRlciUyMHByZXNzJTIwZHVtYmJlbGxzfGVufDF8fHx8MTc2MjUzMjk4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          targetSets: 3,
          repsMin: 10,
          repsMax: 12,
          targetWeight: 25,
          restTime: 120
        }
      ],
      tuesday: [
        {
          id: "ex-3",
          exerciseId: 4,
          exerciseName: "Pull-Up",
          exerciseThumbnail: "https://images.unsplash.com/photo-1701826510552-aadcfa841065?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdWxsJTIwdXBzJTIwZXhlcmNpc2V8ZW58MXx8fHwxNzYyNDMzMDM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          targetSets: 4,
          repsMin: 6,
          repsMax: 8,
          restTime: 180
        },
        {
          id: "ex-4",
          exerciseId: 3,
          exerciseName: "Deadlift",
          exerciseThumbnail: "https://images.unsplash.com/photo-1686247167200-d74f0f24b5be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWFkbGlmdCUyMHdvcmtvdXR8ZW58MXx8fHwxNzYyNDYwODA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          targetSets: 3,
          repsMin: 5,
          repsMax: 5,
          targetWeight: 120,
          restTime: 240
        }
      ],
      wednesday: [],
      thursday: [
        {
          id: "ex-5",
          exerciseId: 1,
          exerciseName: "Barbell Squat",
          exerciseThumbnail: "https://images.unsplash.com/photo-1734668476747-8e46a86fb925?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBzcXVhdHRpbmclMjBneW18ZW58MXx8fHwxNzYyNTMyOTgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          targetSets: 5,
          repsMin: 8,
          repsMax: 10,
          targetWeight: 100,
          restTime: 180
        },
        {
          id: "ex-6",
          exerciseId: 9,
          exerciseName: "Walking Lunges",
          exerciseThumbnail: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdW5nZXMlMjBleGVyY2lzZXxlbnwxfHx8fDE3NjI1MDc0MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          targetSets: 3,
          repsMin: 12,
          repsMax: 15,
          targetWeight: 20,
          restTime: 90
        }
      ],
      friday: [
        {
          id: "ex-7",
          exerciseId: 7,
          exerciseName: "Push-Up",
          exerciseThumbnail: "https://images.unsplash.com/photo-1514512364185-4c2b0985be01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdXNodXBzJTIwY2FsaXN0aGVuaWNzfGVufDF8fHx8MTc2MjUzMjk4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          targetSets: 3,
          repsMin: 15,
          repsMax: 20,
          restTime: 60
        }
      ],
      saturday: []
    }
  },
  {
    id: "plan-2",
    name: "Full Body Strength",
    goalHint: "3-day full body routine for beginners",
    isActive: false,
    weeklySchedule: {
      sunday: [],
      monday: [
        {
          id: "ex-8",
          exerciseId: 1,
          exerciseName: "Barbell Squat",
          exerciseThumbnail: "https://images.unsplash.com/photo-1734668476747-8e46a86fb925?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBzcXVhdHRpbmclMjBneW18ZW58MXx8fHwxNzYyNTMyOTgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          targetSets: 3,
          repsMin: 8,
          repsMax: 12,
          targetWeight: 60
        }
      ],
      tuesday: [],
      wednesday: [
        {
          id: "ex-9",
          exerciseId: 2,
          exerciseName: "Bench Press",
          exerciseThumbnail: "https://images.unsplash.com/photo-1651346847980-ab1c883e8cc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZW5jaCUyMHByZXNzJTIwZXhlcmNpc2V8ZW58MXx8fHwxNzYyNDk5MjUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          targetSets: 3,
          repsMin: 8,
          repsMax: 12,
          targetWeight: 50
        }
      ],
      thursday: [],
      friday: [
        {
          id: "ex-10",
          exerciseId: 3,
          exerciseName: "Deadlift",
          exerciseThumbnail: "https://images.unsplash.com/photo-1686247167200-d74f0f24b5be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWFkbGlmdCUyMHdvcmtvdXR8ZW58MXx8fHwxNzYyNDYwODA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          targetSets: 3,
          repsMin: 5,
          repsMax: 8,
          targetWeight: 80
        }
      ],
      saturday: []
    }
  }
];

const mockSessions: WorkoutSession[] = [
  {
    id: "session-1",
    startTime: "2025-11-04T10:00:00",
    endTime: "2025-11-04T11:15:00",
    planId: "plan-1",
    planName: "Push Pull Legs",
    exercises: [
      {
        exerciseId: 2,
        exerciseName: "Bench Press",
        sets: [
          { setNumber: 1, reps: 10, weight: 60, rpe: 6, isWarmup: true },
          { setNumber: 2, reps: 8, weight: 80, rpe: 8, isWarmup: false },
          { setNumber: 3, reps: 8, weight: 80, rpe: 8, isWarmup: false },
          { setNumber: 4, reps: 9, weight: 80, rpe: 7, isWarmup: false },
        ]
      },
      {
        exerciseId: 8,
        exerciseName: "Dumbbell Shoulder Press",
        sets: [
          { setNumber: 1, reps: 12, weight: 25, rpe: 7, isWarmup: false },
          { setNumber: 2, reps: 11, weight: 25, rpe: 8, isWarmup: false },
          { setNumber: 3, reps: 10, weight: 25, rpe: 9, isWarmup: false },
        ]
      }
    ],
    mood: 'happy',
    energyLevel: 8,
    notes: "Great session! Felt strong on bench press."
  },
  {
    id: "session-2",
    startTime: "2025-11-02T14:30:00",
    endTime: "2025-11-02T15:45:00",
    planId: "plan-1",
    planName: "Push Pull Legs",
    exercises: [
      {
        exerciseId: 1,
        exerciseName: "Barbell Squat",
        sets: [
          { setNumber: 1, reps: 10, weight: 80, rpe: 6, isWarmup: true },
          { setNumber: 2, reps: 10, weight: 100, rpe: 7, isWarmup: false },
          { setNumber: 3, reps: 9, weight: 100, rpe: 8, isWarmup: false },
          { setNumber: 4, reps: 8, weight: 100, rpe: 9, isWarmup: false },
        ]
      }
    ],
    mood: 'neutral',
    energyLevel: 6,
    notes: "Legs felt a bit tired but pushed through."
  }
];

const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const dayFullNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function WorkoutsPage() {
    const [activeTab, setActiveTab] = useState("plans");
    const [plans, setPlans] = useState<WorkoutPlan[]>(mockPlans);
    const [sessions, setSessions] = useState<WorkoutSession[]>(mockSessions);
    
    // Plan modal states
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null);
    const [selectedDay, setSelectedDay] = useState<typeof daysOfWeek[number]>('monday');
    
    // Session modal states
    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
    const [isSessionDetailOpen, setIsSessionDetailOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<WorkoutSession | null>(null);
    const [sessionTimer, setSessionTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerRunning) {
        interval = setInterval(() => {
            setSessionTimer(prev => prev + 1);
        }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const formatTimer = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const calculateDuration = (start: string, end?: string) => {
        if (!end) return "In progress";
        const startTime = new Date(start);
        const endTime = new Date(end);
        const diff = Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60); // minutes
        return `${diff} min`;
    };

    const calculateTotalVolume = (session: WorkoutSession) => {
        let total = 0;
        session.exercises.forEach(ex => {
        ex.sets.forEach(set => {
            if (!set.isWarmup) {
            total += set.reps * set.weight;
            }
        });
        });
        return total;
    };

    const getWorkoutDays = (plan: WorkoutPlan) => {
        return daysOfWeek.map(day => plan.weeklySchedule[day].length > 0);
    };

    const openCreatePlan = () => {
        setEditingPlan({
        id: `plan-${Date.now()}`,
        name: "",
        goalHint: "",
        isActive: true,
        weeklySchedule: {
            sunday: [],
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: []
        }
        });
        setSelectedDay('monday');
        setIsPlanModalOpen(true);
    };

    const openEditPlan = (plan: WorkoutPlan) => {
        setEditingPlan(plan);
        setSelectedDay('monday');
        setIsPlanModalOpen(true);
    };

    const startNewSession = () => {
        setSessionTimer(0);
        setIsTimerRunning(true);
        setIsSessionModalOpen(true);
    };

    const viewSessionDetail = (session: WorkoutSession) => {
        setSelectedSession(session);
        setIsSessionDetailOpen(true);
    };

    const getMoodIcon = (mood?: 'happy' | 'neutral' | 'sad') => {
        switch(mood) {
        case 'happy': return <Smile className="w-5 h-5 text-green-500" />;
        case 'neutral': return <Meh className="w-5 h-5 text-yellow-500" />;
        case 'sad': return <Frown className="w-5 h-5 text-red-500" />;
        default: return null;
        }
    };

  return (
  <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Workouts</h1>
        <p className="text-[#6b7280]">Manage your workout plans and training sessions</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 rounded-xl bg-[#e5e7eb]/50">
          <TabsTrigger value="plans" className="rounded-xl data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white">
            <Calendar className="w-4 h-4 mr-2" />
            Workout Plans
          </TabsTrigger>
          <TabsTrigger value="sessions" className="rounded-xl data-[state=active]:bg-[#10b981] data-[state=active]:text-white">
            <Dumbbell className="w-4 h-4 mr-2" />
            Sessions
          </TabsTrigger>
        </TabsList>

        {/* ===== TAB 1: WORKOUT PLANS ===== */}
        <TabsContent value="plans" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className="rounded-2xl border-[#e5e7eb] shadow-sm hover:shadow-md transition-shadow bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-[#111827] mb-1">{plan.name}</CardTitle>
                      <p className="text-sm text-[#6b7280]">{plan.goalHint}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={plan.isActive} />
                      <Badge className={plan.isActive ? "bg-[#3b82f6] text-white" : "bg-[#9ca3af] text-white"}>
                        {plan.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  {plan.startDate && plan.endDate && (
                    <div className="text-sm text-[#6b7280] mt-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{plan.startDate} — {plan.endDate}</span>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Weekly Schedule Preview */}
                  <div className="space-y-2">
                    <p className="text-xs text-[#6b7280]">Weekly Schedule</p>
                    <div className="flex gap-2 justify-between">
                      {getWorkoutDays(plan).map((hasWorkout, index) => (
                        <div
                          key={index}
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
                            hasWorkout 
                              ? 'bg-[#3b82f6] text-white' 
                              : 'bg-[#9ca3af]/20 text-[#9ca3af]'
                          }`}
                        >
                          {dayLabels[index]}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 rounded-xl border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white"
                      onClick={() => openEditPlan(plan)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Plan
                    </Button>
                    <Button 
                      className="flex-1 rounded-xl bg-[#10b981] hover:bg-[#059669]"
                      onClick={startNewSession}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Workout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAB - Create New Plan */}
          <div className="fixed bottom-8 right-8">
            <Button 
              size="lg"
              className="rounded-full w-14 h-14 shadow-lg bg-[#3b82f6] hover:bg-[#2563eb]"
              onClick={openCreatePlan}
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>
        </TabsContent>

        {/* ===== TAB 2: WORKOUT SESSIONS ===== */}
        <TabsContent value="sessions" className="space-y-6 mt-6">
          <div className="flex justify-end mb-4">
            <Button 
              className="rounded-xl bg-[#10b981] hover:bg-[#059669]"
              onClick={startNewSession}
            >
              <Plus className="w-4 h-4 mr-2" />
              Log New Session
            </Button>
          </div>

          {/* Session Timeline */}
          <div className="space-y-4">
            {sessions.map((session) => (
              <Card 
                key={session.id} 
                className="rounded-2xl border-[#e5e7eb] shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer"
                onClick={() => viewSessionDetail(session)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#10b981]/10 rounded-xl flex items-center justify-center">
                          <Dumbbell className="w-6 h-6 text-[#10b981]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-[#111827]">{new Date(session.startTime).toLocaleDateString()}</h3>
                            {session.mood && getMoodIcon(session.mood)}
                          </div>
                          <p className="text-sm text-[#6b7280]">
                            {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {session.endTime && ` - ${new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 flex-wrap">
                        <Badge className="bg-[#10b981]/10 text-[#10b981] rounded-lg">
                          <Clock className="w-3 h-3 mr-1" />
                          {calculateDuration(session.startTime, session.endTime)}
                        </Badge>
                        <Badge variant="outline" className="rounded-lg border-[#e5e7eb]">
                          {session.exercises.length} exercises
                        </Badge>
                        <Badge variant="outline" className="rounded-lg border-[#e5e7eb]">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {calculateTotalVolume(session).toLocaleString()} kg
                        </Badge>
                        {session.energyLevel && (
                          <Badge variant="outline" className="rounded-lg border-[#e5e7eb] flex items-center gap-1">
                            <Battery className="w-3 h-3" />
                            {session.energyLevel}/10
                          </Badge>
                        )}
                        {session.planName && (
                          <Badge className="bg-[#3b82f6]/10 text-[#3b82f6] rounded-lg">
                            {session.planName}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#6b7280]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {sessions.length === 0 && (
            <div className="text-center py-16 space-y-4">
              <div className="w-24 h-24 mx-auto bg-[#e5e7eb] rounded-full flex items-center justify-center">
                <Dumbbell className="w-12 h-12 text-[#6b7280]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl text-[#111827]">No workout sessions yet</h3>
                <p className="text-[#6b7280]">Start tracking your workouts to see your progress</p>
              </div>
              <Button 
                className="rounded-xl bg-[#10b981] hover:bg-[#059669]"
                onClick={startNewSession}
              >
                <Plus className="w-4 h-4 mr-2" />
                Log Your First Workout
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ===== CREATE/EDIT PLAN MODAL ===== */}
      <Dialog open={isPlanModalOpen} onOpenChange={setIsPlanModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl">
          {editingPlan && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="text-2xl text-[#111827]">
                  {editingPlan.name ? 'Edit' : 'Create'} Workout Plan
                </DialogTitle>
                <DialogDescription className="text-[#6b7280]">
                  Design your weekly training schedule
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#111827]">Plan Name</Label>
                    <Input 
                      placeholder="e.g., Push Pull Legs"
                      className="rounded-xl border-[#e5e7eb]"
                      defaultValue={editingPlan.name}
                    />
                  </div>
                  <div className="space-y-2 flex items-end">
                    <div className="flex items-center gap-2">
                      <Switch defaultChecked={editingPlan.isActive} />
                      <Label className="text-[#111827]">Active Plan</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#111827]">Goal Hint</Label>
                  <Textarea 
                    placeholder="What's the goal of this program?"
                    className="rounded-xl border-[#e5e7eb] min-h-[80px]"
                    defaultValue={editingPlan.goalHint}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#111827]">Start Date (Optional)</Label>
                    <Input 
                      type="date"
                      className="rounded-xl border-[#e5e7eb]"
                      defaultValue={editingPlan.startDate}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#111827]">End Date (Optional)</Label>
                    <Input 
                      type="date"
                      className="rounded-xl border-[#e5e7eb]"
                      defaultValue={editingPlan.endDate}
                    />
                  </div>
                </div>

                <Separator />

                {/* Weekly Schedule Builder */}
                <div className="space-y-4">
                  <h3 className="text-lg text-[#111827]">Weekly Schedule</h3>
                  
                  {/* Day Tabs */}
                  <Tabs value={selectedDay} onValueChange={(value) => setSelectedDay(value as typeof daysOfWeek[number])}>
                    <ScrollArea className="w-full">
                      <TabsList className="inline-flex bg-[#e5e7eb]/50 rounded-xl p-1">
                        {daysOfWeek.map((day, index) => (
                          <TabsTrigger 
                            key={day} 
                            value={day}
                            className="rounded-lg data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white"
                          >
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-xs">{dayFullNames[index]}</span>
                              {editingPlan.weeklySchedule[day].length > 0 && (
                                <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full" />
                              )}
                            </div>
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </ScrollArea>

                    {daysOfWeek.map((day) => (
                      <TabsContent key={day} value={day} className="mt-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-[#111827]">{dayFullNames[daysOfWeek.indexOf(day)]} Exercises</h4>
                          <Button size="sm" className="rounded-xl bg-[#3b82f6] hover:bg-[#2563eb]">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Exercise
                          </Button>
                        </div>

                        {editingPlan.weeklySchedule[day].length > 0 ? (
                          <div className="space-y-3">
                            {editingPlan.weeklySchedule[day].map((exercise, index) => (
                              <Card key={exercise.id} className="rounded-xl border-[#e5e7eb] bg-[#f9fafb]">
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-3">
                                    <div className="cursor-move mt-2">
                                      <GripVertical className="w-5 h-5 text-[#6b7280]" />
                                    </div>
                                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                      <Image 
                                        src={exercise.exerciseThumbnail}
                                        alt={exercise.exerciseName}
                                        width={400}
                                        height={300}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                      <h5 className="text-[#111827]">{exercise.exerciseName}</h5>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        <div className="space-y-1">
                                          <Label className="text-xs text-[#6b7280]">Sets</Label>
                                          <Input 
                                            type="number" 
                                            defaultValue={exercise.targetSets}
                                            className="rounded-lg h-9 text-sm"
                                          />
                                        </div>
                                        <div className="space-y-1">
                                          <Label className="text-xs text-[#6b7280]">Reps (min-max)</Label>
                                          <div className="flex gap-1">
                                            <Input 
                                              type="number" 
                                              defaultValue={exercise.repsMin}
                                              className="rounded-lg h-9 text-sm w-1/2"
                                            />
                                            <Input 
                                              type="number" 
                                              defaultValue={exercise.repsMax}
                                              className="rounded-lg h-9 text-sm w-1/2"
                                            />
                                          </div>
                                        </div>
                                        <div className="space-y-1">
                                          <Label className="text-xs text-[#6b7280]">Weight (kg)</Label>
                                          <Input 
                                            type="number" 
                                            defaultValue={exercise.targetWeight}
                                            className="rounded-lg h-9 text-sm"
                                          />
                                        </div>
                                        <div className="space-y-1">
                                          <Label className="text-xs text-[#6b7280]">Rest (sec)</Label>
                                          <Input 
                                            type="number" 
                                            defaultValue={exercise.restTime}
                                            className="rounded-lg h-9 text-sm"
                                          />
                                        </div>
                                      </div>
                                      {exercise.tempo && (
                                        <div className="space-y-1">
                                          <Label className="text-xs text-[#6b7280]">Tempo</Label>
                                          <Input 
                                            defaultValue={exercise.tempo}
                                            placeholder="e.g., 3-1-2-0"
                                            className="rounded-lg h-9 text-sm"
                                          />
                                        </div>
                                      )}
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 border-2 border-dashed border-[#e5e7eb] rounded-xl">
                            <p className="text-[#6b7280]">No exercises added for this day</p>
                            <p className="text-sm text-[#9ca3af]">This is a rest day</p>
                          </div>
                        )}
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>

                {/* Save Button */}
                <div className="flex gap-3 pt-4 border-t border-[#e5e7eb]">
                  <Button 
                    className="flex-1 bg-[#3b82f6] hover:bg-[#2563eb] rounded-xl"
                    onClick={() => setIsPlanModalOpen(false)}
                  >
                    Save Workout Plan
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="rounded-xl"
                    onClick={() => setIsPlanModalOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ===== LOG SESSION MODAL ===== */}
      <Dialog open={isSessionModalOpen} onOpenChange={setIsSessionModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl">
          <div className="space-y-6">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl text-[#111827]">Log Workout Session</DialogTitle>
                <div className="text-2xl text-[#10b981] tabular-nums">
                  <Clock className="w-5 h-5 inline mr-2" />
                  {formatTimer(sessionTimer)}
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[#111827]">Link to Plan (Optional)</Label>
                <Select>
                  <SelectTrigger className="rounded-xl border-[#e5e7eb]">
                    <SelectValue placeholder="Select a workout plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Exercise Logger */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg text-[#111827]">Exercises</h3>
                  <Button size="sm" className="rounded-xl bg-[#10b981] hover:bg-[#059669]">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Exercise
                  </Button>
                </div>

                {/* Mock exercise with sets */}
                <Card className="rounded-xl border-[#e5e7eb]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-[#111827]">Bench Press</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Set rows */}
                    {[1, 2, 3].map((setNum) => (
                      <div key={setNum} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-1 text-center text-sm text-[#6b7280]">
                          {setNum}
                        </div>
                        <div className="col-span-3">
                          <Input 
                            type="number" 
                            placeholder="Reps"
                            className="rounded-lg h-9 text-sm"
                          />
                        </div>
                        <div className="col-span-3">
                          <Input 
                            type="number" 
                            placeholder="Weight"
                            className="rounded-lg h-9 text-sm"
                          />
                        </div>
                        <div className="col-span-3">
                          <Input 
                            type="number" 
                            placeholder="RPE"
                            min="0"
                            max="10"
                            className="rounded-lg h-9 text-sm"
                          />
                        </div>
                        <div className="col-span-2 flex items-center justify-center">
                          <Checkbox id={`warmup-${setNum}`} />
                          <Label htmlFor={`warmup-${setNum}`} className="text-xs ml-1 cursor-pointer">WU</Label>
                        </div>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" className="rounded-lg w-full">
                      <Plus className="w-3 h-3 mr-1" />
                      Add Set
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Mood & Energy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#111827]">Mood</Label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-xl flex-1">
                      <Smile className="w-5 h-5 text-green-500" />
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl flex-1">
                      <Meh className="w-5 h-5 text-yellow-500" />
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl flex-1">
                      <Frown className="w-5 h-5 text-red-500" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#111827]">Energy Level: 7/10</Label>
                  <Slider 
                    defaultValue={[7]} 
                    max={10} 
                    step={1}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[#111827]">Notes</Label>
                <Textarea 
                  placeholder="How did the workout feel? Any observations?"
                  className="rounded-xl border-[#e5e7eb] min-h-[100px]"
                />
              </div>

              {/* Finish Button */}
              <div className="flex gap-3 pt-4 border-t border-[#e5e7eb]">
                <Button 
                  className="flex-1 bg-[#10b981] hover:bg-[#059669] rounded-xl"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setIsSessionModalOpen(false);
                  }}
                >
                  <Dumbbell className="w-4 h-4 mr-2" />
                  Finish Workout
                </Button>
                <Button 
                  variant="ghost" 
                  className="rounded-xl"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setIsSessionModalOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== SESSION DETAIL VIEW ===== */}
      <Dialog open={isSessionDetailOpen} onOpenChange={setIsSessionDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl">
          {selectedSession && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="text-2xl text-[#111827]">
                  Workout Session
                </DialogTitle>
                <DialogDescription className="text-[#6b7280]">
                  {new Date(selectedSession.startTime).toLocaleString()}
                </DialogDescription>
              </DialogHeader>

              {/* Session Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="rounded-xl border-[#e5e7eb] bg-[#f9fafb]">
                  <CardContent className="p-4 text-center">
                    <Clock className="w-6 h-6 mx-auto text-[#10b981] mb-2" />
                    <p className="text-xs text-[#6b7280]">Duration</p>
                    <p className="text-[#111827]">{calculateDuration(selectedSession.startTime, selectedSession.endTime)}</p>
                  </CardContent>
                </Card>
                <Card className="rounded-xl border-[#e5e7eb] bg-[#f9fafb]">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-6 h-6 mx-auto text-[#10b981] mb-2" />
                    <p className="text-xs text-[#6b7280]">Total Volume</p>
                    <p className="text-[#111827]">{calculateTotalVolume(selectedSession).toLocaleString()} kg</p>
                  </CardContent>
                </Card>
                <Card className="rounded-xl border-[#e5e7eb] bg-[#f9fafb]">
                  <CardContent className="p-4 text-center">
                    {selectedSession.mood && getMoodIcon(selectedSession.mood)}
                    <p className="text-xs text-[#6b7280] mt-2">Mood</p>
                    <p className="text-[#111827] capitalize">{selectedSession.mood || 'N/A'}</p>
                  </CardContent>
                </Card>
                <Card className="rounded-xl border-[#e5e7eb] bg-[#f9fafb]">
                  <CardContent className="p-4 text-center">
                    <Battery className="w-6 h-6 mx-auto text-[#10b981] mb-2" />
                    <p className="text-xs text-[#6b7280]">Energy</p>
                    <p className="text-[#111827]">{selectedSession.energyLevel || 'N/A'}/10</p>
                  </CardContent>
                </Card>
              </div>

              {/* Exercises */}
              <div className="space-y-4">
                <h3 className="text-lg text-[#111827]">Exercises</h3>
                {selectedSession.exercises.map((exercise, index) => (
                  <Card key={index} className="rounded-xl border-[#e5e7eb]">
                    <CardHeader>
                      <CardTitle className="text-base text-[#111827]">{exercise.exerciseName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-16">Set</TableHead>
                            <TableHead>Reps</TableHead>
                            <TableHead>Weight</TableHead>
                            <TableHead>RPE</TableHead>
                            <TableHead className="w-16"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {exercise.sets.map((set) => (
                            <TableRow key={set.setNumber}>
                              <TableCell>{set.setNumber}</TableCell>
                              <TableCell>{set.reps}</TableCell>
                              <TableCell>{set.weight} kg</TableCell>
                              <TableCell>{set.rpe || '-'}</TableCell>
                              <TableCell>
                                {set.isWarmup && (
                                  <Badge variant="outline" className="text-xs">WU</Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Notes */}
              {selectedSession.notes && (
                <div className="space-y-2">
                  <h3 className="text-lg text-[#111827]">Notes</h3>
                  <Card className="rounded-xl border-[#e5e7eb] bg-[#f9fafb]">
                    <CardContent className="p-4">
                      <p className="text-[#111827]">{selectedSession.notes}</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-[#e5e7eb]">
                <Button 
                  variant="destructive" 
                  className="rounded-xl"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Session
                </Button>
                <Button 
                  variant="ghost" 
                  className="rounded-xl flex-1"
                  onClick={() => setIsSessionDetailOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
