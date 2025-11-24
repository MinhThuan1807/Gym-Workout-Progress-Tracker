'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/user/ui/button'
import { Plus, Calendar, Dumbbell } from 'lucide-react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/user/ui/tabs'
import { exerciseAPI } from '@/api/exercise'
import { workoutAPI } from '@/api/workouts'
import WorkoutPlanCard from '@/components/user/workouts/WorkoutPlanCard'
import SessionCard from '@/components/user/workouts/SessionCard'
import PlanModal from '@/components/user/workouts/PlanModal'
import SessionModal from '@/components/user/workouts/SessionModal'
import SessionDetailModal from '@/components/user/workouts/SessionDetailModal'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel
} from '@/components/user/ui/alert-dialog'
import { toast } from 'sonner'

const daysOfWeek = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
] as const
const transformWorkoutPlanData = (apiData: any[]): U_WorkoutPlan[] => {
  return apiData.map((plan) => {
    // Khởi tạo days object với 7 ngày rỗng
    const days = {
      sunday: [],
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: []
    } as U_WorkoutPlan['days']

    // Map dow (day of week) từ API sang tên ngày
    const dowToDay: Record<number, (typeof daysOfWeek)[number]> = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday'
    }

    // Chuyển đổi days array từ API sang object
    plan.days.forEach((dayData: any) => {
      const dayName = dowToDay[dayData.dow]
      if (dayName) {
        days[dayName] = dayData.items.map((item: any) => ({
          exerciseId: String(item.exerciseId),
          targetSets: item.targetSets,
          repsMin: item.repsMin,
          repsMax: item.repsMax,
          targetWeight: item.targetWeight,
          restSec: item.restSec,
          tempo: item.tempo,
          order: item.order
        }))
      }
    })

    return {
      _id: plan._id,
      name: plan.name,
      goalHint: plan.goalHint,
      isActive: plan.isActive,
      startDate: plan.startDate
        ? new Date(plan.startDate).toISOString().split('T')[0]
        : undefined,
      endDate: plan.endDate
        ? new Date(plan.endDate).toISOString().split('T')[0]
        : undefined,
      days
    }
  })
}
export default function WorkoutsPage() {
  const [activeTab, setActiveTab] = useState('plans')
  const [plans, setPlans] = useState<U_WorkoutPlan[]>([])
  const [sessions, setSessions] = useState<U_WorkoutSession[]>([])
  const [exerciseLab, setExerciseLab] = useState<Exercise[]>([])

  // Plan modal states
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<U_WorkoutPlan | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  // Session modal states
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false)
  const [isSessionDetailOpen, setIsSessionDetailOpen] = useState(false)
  const [selectedSession, setSelectedSession] =
    useState<U_WorkoutSession | null>(null)
  const [editingSession, setEditingSession] = useState<U_WorkoutSession | null>(
    null
  )
  const [isSessionEditMode, setIsSessionEditMode] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteTargetSession, setDeleteTargetSession] =
    useState<U_WorkoutSession | null>(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansData, sessionsData, exercisesData] = await Promise.all([
          workoutAPI.getAll(),
          workoutAPI.getSessionAll(),
          exerciseAPI.getAll()
        ])

        setPlans(transformWorkoutPlanData(plansData.data || []))
        setSessions(sessionsData.data || [])
        setExerciseLab(exercisesData.data || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  // Plan functions
  const openCreatePlan = () => {
    setEditingPlan({
      _id: `temp-${Date.now()}`,
      name: '',
      goalHint: '',
      isActive: true,
      days: {
        sunday: [],
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: []
      }
    })
    setIsEditMode(false)
    setIsPlanModalOpen(true)
  }

  const openEditPlan = (plan: U_WorkoutPlan) => {
    setEditingPlan(plan)
    setIsEditMode(true)
    setIsPlanModalOpen(true)
  }
  const confirmDeleteSession = (sessionOrId: U_WorkoutSession | string) => {
    if (typeof sessionOrId === 'string') {
      const s = sessions.find((x) => x._id === sessionOrId) || null
      setDeleteTargetSession(s)
    } else {
      setDeleteTargetSession(sessionOrId)
    }
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteSession = async (sessionId?: string) => {
    const id = sessionId ?? deleteTargetSession?._id
    if (!id) return

    try {
      await workoutAPI.deleteSession(id)
      toast.success('✅ Session deleted successfully!')
      setIsDeleteDialogOpen(false)
      setDeleteTargetSession(null)
      await refreshSessions()
    } catch (error: any) {
      console.error('Error deleting session:', error)
      toast.error(
        `❌ ${error.response?.data?.message || 'Failed to delete session'}`
      )
    }
  }

  const refreshPlans = async () => {
    try {
      const plansData = await workoutAPI.getAll()
      setPlans(transformWorkoutPlanData(plansData.data || []))
    } catch (error) {
      console.error('Error refreshing plans:', error)
    }
  }

  // Session functions
  const openCreateSession = () => {
    setEditingSession({
      _id: `temp-${Date.now()}`,
      startTime: new Date(),
      exercises: [],
      notes: ''
    })
    setIsSessionEditMode(false)
    setIsSessionModalOpen(true)
  }

  const openEditSession = (session: U_WorkoutSession) => {
    setEditingSession(session)
    setIsSessionEditMode(true)
    setIsSessionModalOpen(true)
  }

  const openSessionDetail = (session: U_WorkoutSession) => {
    setSelectedSession(session)
    setIsSessionDetailOpen(true)
  }

  const refreshSessions = async () => {
    try {
      const sessionsData = await workoutAPI.getSessionAll()
      setSessions(sessionsData.data || [])
    } catch (error) {
      console.error('Error refreshing sessions:', error)
    }
  }

  const calculateDuration = (start: Date, end?: Date) => {
    if (!end) return 'In progress'
    const startTime = new Date(start)
    const endTime = new Date(end)
    const diff = Math.floor(
      (endTime.getTime() - startTime.getTime()) / 1000 / 60
    ) // minutes
    return `${diff} min`
  }

  const calculateTotalVolume = (session: U_WorkoutSession) => {
    let total = 0
    session.exercises.forEach((ex) => {
      ex.sets.forEach((set) => {
        if (!set.isWarmup) {
          total += set.reps * set.weight
        }
      })
    })
    return total
  }

  const getWorkoutDays = (plan: U_WorkoutPlan) => {
    return daysOfWeek.map((day) => plan.days[day].length > 0)
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div>
        <h1 className="text-2xl sm:text-3xl">Workouts</h1>
        <p className="text-sm sm:text-base text-[#6b7280]">
          Manage your workout plans and training sessions
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2 rounded-xl bg-[#e5e7eb]/50">
          <TabsTrigger value="plans" className="rounded-xl text-xs sm:text-sm">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Workout Plans</span>
            <span className="sm:hidden">Plans</span>
          </TabsTrigger>
          <TabsTrigger
            value="sessions"
            className="rounded-xl text-xs sm:text-sm"
          >
            <Dumbbell className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Sessions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6 mt-4 sm:mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {plans.map((plan) => (
              <WorkoutPlanCard
                key={plan._id}
                plan={plan}
                onEdit={openEditPlan}
                getWorkoutDays={getWorkoutDays}
              />
            ))}
          </div>
          <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50">
            <Button
              size="lg"
              className="rounded-full w-12 h-12 sm:w-14 sm:h-14 shadow-lg bg-[#3b82f6] hover:bg-[#2563eb]"
              onClick={openCreatePlan}
            >
              <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4 mt-4 sm:mt-6">
          <div className="space-y-3 sm:space-y-4">
            {sessions.map((session) => (
              <SessionCard
                key={session._id}
                session={session}
                onClick={openSessionDetail}
                onEdit={openEditSession}
                onDelete={confirmDeleteSession}
                calculateDuration={calculateDuration}
                calculateTotalVolume={calculateTotalVolume}
              />
            ))}
          </div>
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xóa buổi tập</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc muốn xóa buổi tập này? Hành động này không thể
                  hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteSession()}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50">
            <Button
              size="lg"
              className="rounded-full w-12 h-12 sm:w-14 sm:h-14 shadow-lg bg-[#10b981] hover:bg-[#059669]"
              onClick={openCreateSession}
            >
              <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <PlanModal
        open={isPlanModalOpen}
        onOpenChange={setIsPlanModalOpen}
        plan={editingPlan}
        exerciseLab={exerciseLab}
        isEditMode={isEditMode}
        onSuccess={refreshPlans}
      />

      <SessionModal
        open={isSessionModalOpen}
        onOpenChange={setIsSessionModalOpen}
        session={editingSession}
        plans={plans}
        exerciseLab={exerciseLab}
        isEditMode={isSessionEditMode}
        onSuccess={refreshSessions}
      />

      <SessionDetailModal
        open={isSessionDetailOpen}
        onOpenChange={setIsSessionDetailOpen}
        session={selectedSession}
        exerciseLab={exerciseLab}
        calculateDuration={calculateDuration}
        calculateTotalVolume={calculateTotalVolume}
        onEdit={openEditSession}
        onDelete={handleDeleteSession}
      />
    </div>
  )
}
