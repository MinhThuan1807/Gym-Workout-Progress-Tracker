'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Plus,
  Target,
  Trophy,
  Edit2,
  Trash2,
  Calendar,
  TrendingUp
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'

interface GoalsSectionProps {
  activeGoals: Goal[]
  achievedGoals: Goal[]
  onAddGoal: () => void
  onEditGoal: (goal: Goal) => void
  onDeleteGoal: (goalId: string) => void
  isLoading?: boolean
}

export function GoalsSection({
  activeGoals,
  achievedGoals,
  onAddGoal,
  onEditGoal,
  onDeleteGoal,
  isLoading = false
}: GoalsSectionProps) {
  const getGoalIcon = (type: GoalType) => {
    const icons = {
      weight: '⚖️',
      body_fat_pct: '📊', // ✅ Đổi key
      sessions_per_week: '📅', // ✅ Đổi key
      one_rm: '💪', // ✅ Đổi key
      strength: '🏋️',
      endurance: '🏃',
      flexibility: '🧘'
    }
    return icons[type] || '🎯'
  }

  const getProgressPercentage = (goal: Goal) => {
    // ✅ Handle undefined currentValue
    const current = goal.currentValue ?? goal.startValue ?? 0

    if (!goal.startValue) {
      // Nếu không có startValue, tính % trực tiếp
      return Math.min((current / goal.targetValue) * 100, 100)
    }

    const total = goal.targetValue - goal.startValue
    const progress = current - goal.startValue

    return Math.max(0, Math.min((progress / total) * 100, 100))
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No deadline'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const GoalCard = ({ goal }: { goal: Goal }) => {
    const progress = getProgressPercentage(goal)
    const isAchieved = goal.status === 'achieved'
    const current = goal.currentValue ?? goal.startValue ?? 0 // ✅ Fallback value

    return (
      <Card className="border-[#e5e7eb] hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="text-2xl">{getGoalIcon(goal.type)}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-[#111827] mb-1">
                  {goal.name}
                </h4>
                <div className="flex items-center gap-2 text-sm text-[#6b7280]">
                  <span>
                    {current.toFixed(1)} / {goal.targetValue} {goal.unit}
                  </span>
                  {goal.linkedExerciseName && (
                    <Badge variant="outline" className="text-xs">
                      {goal.linkedExerciseName}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditGoal(goal)}
                className="h-8 w-8 p-0 hover:bg-blue-50"
              >
                <Edit2 className="h-4 w-4 text-blue-600" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Goal</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{goal.name}"? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDeleteGoal(goal._id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-[#6b7280]">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {isNaN(progress) ? '0.0' : progress.toFixed(1)}% complete
              </span>
              {goal.targetDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(goal.targetDate)}
                </span>
              )}
            </div>
          </div>

          {goal.notes && (
            <p className="text-xs text-[#6b7280] mt-2 italic">{goal.notes}</p>
          )}

          {isAchieved && (
            <Badge className="mt-2 bg-green-100 text-green-700 hover:bg-green-100">
              ✓ Achieved
            </Badge>
          )}
        </CardContent>
      </Card>
    )
  }

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border-[#e5e7eb]">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-2 w-full mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
      <CardHeader className="border-b border-[#e5e7eb] pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#111827]">
                Fitness Goals
              </h3>
              <p className="text-sm text-[#6b7280]">
                Track your progress toward your targets
              </p>
            </div>
          </div>
          <Button
            onClick={onAddGoal}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Active Goals */}
        <div>
          <h4 className="font-semibold text-[#111827] mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Active Goals ({activeGoals.length})
          </h4>

          {isLoading ? (
            <LoadingSkeleton />
          ) : activeGoals.length === 0 ? (
            <div className="text-center py-8 text-[#6b7280]">
              <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No active goals yet</p>
              <p className="text-xs mt-1">
                Create your first goal to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeGoals.map((goal) => (
                <GoalCard key={goal._id} goal={goal} />
              ))}
            </div>
          )}
        </div>

        {/* Achieved Goals */}
        {achievedGoals.length > 0 && (
          <div>
            <h4 className="font-semibold text-[#111827] mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-green-600" />
              Achieved Goals ({achievedGoals.length})
            </h4>
            <div className="space-y-3">
              {achievedGoals.map((goal) => (
                <GoalCard key={goal._id} goal={goal} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
