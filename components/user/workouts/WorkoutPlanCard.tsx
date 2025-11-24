import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/user/ui/card'
import { Button } from '@/components/user/ui/button'
import { Badge } from '@/components/user/ui/badge'
import { Switch } from '@/components/user/ui/switch'
import { Separator } from '@/components/user/ui/separator'
import { Calendar, Edit } from 'lucide-react'

const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

interface WorkoutPlanCardProps {
  plan: U_WorkoutPlan
  onEdit: (plan: U_WorkoutPlan) => void
  getWorkoutDays: (plan: U_WorkoutPlan) => boolean[]
}

export default function WorkoutPlanCard({
  plan,
  onEdit,
  getWorkoutDays
}: WorkoutPlanCardProps) {
  return (
    <Card className="rounded-2xl border-[#e5e7eb] shadow-sm hover:shadow-md transition-shadow bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-[#111827] mb-1">{plan.name}</CardTitle>
            <p className="text-sm text-[#6b7280]">{plan.goalHint}</p>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={plan.isActive} />
            <Badge
              className={
                plan.isActive
                  ? 'bg-[#3b82f6] text-white'
                  : 'bg-[#9ca3af] text-white'
              }
            >
              {plan.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
        {plan.startDate && plan.endDate && (
          <div className="text-sm text-[#6b7280] mt-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              {plan.startDate} — {plan.endDate}
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
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
        <Button
          variant="outline"
          className="w-full rounded-xl border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white"
          onClick={() => onEdit(plan)}
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Plan
        </Button>
      </CardContent>
    </Card>
  )
}
