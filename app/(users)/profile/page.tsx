'use client'

import { useMemo, useState } from 'react'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { PersonalInfoForm } from '@/components/profile/PersonalInfoForm'
import { GoalsSection } from '@/components/profile/GoalsSection'
import { QuickStatsCard } from '@/components/profile/QuickStatsCard'
import { AchievementsCard } from '@/components/profile/AchievementCard'
import { CreateGoalModal } from '@/components/profile/CreateGoalModal'
import { EditProfileModal } from '@/components/profile/EditProfileModal'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import { profileAPI } from '@/api/profile'
import { toast } from 'sonner'
import { useAppSelector, useAppDispatch } from '@/store/hook'
import {
  selectCurrentUser,
  updateUserProfile,
  updateUserAvatar
} from '@/store/slices/authSlice'

interface UserProfile {
  _id: string
  displayName: string
  email: string
  gender: 'male' | 'female' | 'other'
  dob: Date
  heightCm: number
  weightKg: number
  avatarUrl?: string
  role: string
}

interface UpdateProfileData {
  displayName?: string
  gender?: 'male' | 'female' | 'other'
  dob?: Date
  heightCm?: number
  weightKg?: number
  avatar?: File
}

//========= Mock Data (temporarily keep for goals and achievements) =========
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
]

const mockAchievements: Achievement[] = [
  {
    _id: 'ach-1',
    name: 'First Workout',
    description: 'Complete your first training session',
    icon: '🎯',
    unlocked: true,
    color: '#10b981'
  },
  {
    _id: 'ach-2',
    name: '10 Workouts',
    description: 'Complete 10 training sessions',
    icon: '💪',
    unlocked: true,
    color: '#3b82f6'
  },
  {
    _id: 'ach-3',
    name: '50 Workouts',
    description: 'Complete 50 training sessions',
    icon: '🔥',
    unlocked: true,
    color: '#f59e0b'
  },
  {
    _id: 'ach-4',
    name: '100 Workouts',
    description: 'Complete 100 training sessions',
    icon: '🏆',
    unlocked: true,
    color: '#fbbf24'
  },
  {
    _id: 'ach-5',
    name: '7 Day Streak',
    description: 'Train for 7 consecutive days',
    icon: '⚡',
    unlocked: true,
    color: '#f97316'
  },
  {
    _id: 'ach-6',
    name: '30 Day Streak',
    description: 'Train for 30 consecutive days',
    icon: '🌟',
    unlocked: false,
    progress: 12,
    requirement: 30,
    color: '#8b5cf6'
  },
  {
    _id: 'ach-7',
    name: 'First Goal',
    description: 'Achieve your first fitness goal',
    icon: '🎖️',
    unlocked: true,
    color: '#ec4899'
  },
  {
    _id: 'ach-8',
    name: '10,000kg Volume',
    description: 'Lift 10,000kg total volume',
    icon: '💎',
    unlocked: true,
    color: '#14b8a6'
  },
  {
    _id: 'ach-9',
    name: '50,000kg Volume',
    description: 'Lift 50,000kg total volume',
    icon: '👑',
    unlocked: false,
    progress: 28500,
    requirement: 50000,
    color: '#6366f1'
  },
  {
    _id: 'ach-10',
    name: 'Bodyweight Bench',
    description: 'Bench press your bodyweight',
    icon: '🦾',
    unlocked: true,
    color: '#10b981'
  },
  {
    _id: 'ach-11',
    name: '1.5x Bodyweight Bench',
    description: 'Bench press 1.5x your bodyweight',
    icon: '🚀',
    unlocked: false,
    progress: 92,
    requirement: 120,
    color: '#f59e0b'
  },
  {
    _id: 'ach-12',
    name: 'Elite Lifter',
    description: 'Join the 1000lb club (Squat+Bench+Deadlift)',
    icon: '⭐',
    unlocked: false,
    progress: 780,
    requirement: 1000,
    color: '#fbbf24'
  }
]

const quickStats: QuickStats = {
  totalWorkouts: 124,
  currentStreak: 12,
  goalsAchieved: 3,
  totalGoals: 5,
  totalVolume: 28500
}

// Loading skeleton component
function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Skeleton className="w-[120px] h-[120px] rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-[300px] rounded-2xl" />
          <Skeleton className="h-[400px] rounded-2xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-[300px] rounded-2xl" />
          <Skeleton className="h-[400px] rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  // ✅ Lấy user từ Redux store
  const user = useAppSelector(selectCurrentUser)
  const dispatch = useAppDispatch()

  const [isUpdating, setIsUpdating] = useState(false)
  const [goals] = useState<Goal[]>(mockGoals)
  const [achievements] = useState<Achievement[]>(mockAchievements)
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)

  // ✅ Convert user to UserProfile format
  const profile: UserProfile | null = user
    ? {
        _id: user._id,
        displayName: user.displayName,
        email: user.email,
        gender: user.gender || 'other',
        dob: user.dob || '',
        heightCm: user.heightCm || 0,
        weightKg: user.weightKg || 0,
        avatarUrl: user.avatarUrl,
        role: user.role
      }
    : null

  const activeGoals = useMemo(
    () => goals.filter((g) => g.status === 'active'),
    [goals]
  )
  const achievedGoals = useMemo(
    () => goals.filter((g) => g.status === 'achieved'),
    [goals]
  )
  const unlockedAchievements = useMemo(
    () => achievements.filter((a) => a.unlocked),
    [achievements]
  )

  // ✅ Handle avatar change với Redux update
  const handleAvatarChange = async (file: File) => {
    if (!profile) return

    console.log('📸 Starting avatar upload...')
    console.log('File:', { name: file.name, size: file.size, type: file.type })

    try {
      setIsUpdating(true)

      // ✅ Chỉ gửi avatar, không gửi các field khác
      const response = await profileAPI.updateProfile({
        avatar: file
      })

      console.log('✅ API Response:', response)

      const avatarUrl = response?.data?.avatarUrl || response?.avatarUrl

      if (avatarUrl) {
        dispatch(updateUserAvatar(avatarUrl))
        toast.success('Avatar updated successfully')
      } else {
        console.error('❌ No avatarUrl in response:', response)
        toast.error('Avatar uploaded but URL not found')
      }
    } catch (error: any) {
      console.error('❌ Avatar upload failed:', error)
      const errorMessage =
        error.response?.data?.message || 'Failed to update avatar'
      toast.error(errorMessage)
    } finally {
      setIsUpdating(false)
    }
  }

  // ✅ Handle profile update with better error handling
  const handleUpdateProfile = async (updates: UpdateProfileData) => {
    if (!profile) return

    try {
      setIsUpdating(true)
      console.log('📝 Updating profile with:', updates)

      const response = await profileAPI.updateProfile(updates)
      console.log('✅ Update response:', response)

      // ✅ Update Redux state with complete response
      dispatch(
        updateUserProfile({
          displayName: response.data.displayName || response.displayName,
          gender: response.data.gender || response.gender,
          dob: response.data.dob || response.dob,
          heightCm: response.data.heightCm || response.heightCm,
          weightKg: response.data.weightKg || response.weightKg,
          avatarUrl: response.data.avatarUrl || response.avatarUrl
        })
      )

      toast.success('Profile updated successfully')
      setIsEditProfileOpen(false)
    } catch (error: any) {
      console.error('❌ Profile update failed:', error)
      const errorMessage =
        error.response?.data?.message || 'Failed to update profile'
      toast.error(errorMessage)
      throw error
    } finally {
      setIsUpdating(false)
    }
  }

  // Show loading state nếu chưa có user
  if (!user) {
    return <ProfileSkeleton />
  }

  // Show error state nếu không có profile
  if (!profile) {
    return (
      <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
        <CardContent className="p-12 text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h3 className="text-xl text-[#111827] mb-2">
            Failed to Load Profile
          </h3>
          <p className="text-[#6b7280] mb-4">Unable to load user profile</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <ProfileHeader
        profile={profile}
        onEditClick={() => setIsEditProfileOpen(true)}
        onAvatarChange={handleAvatarChange}
        isUpdating={isUpdating}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          <PersonalInfoForm profile={profile} />
          <GoalsSection
            activeGoals={activeGoals}
            achievedGoals={achievedGoals}
            onAddGoal={() => setIsGoalModalOpen(true)}
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <QuickStatsCard stats={quickStats} />
          <AchievementsCard
            achievements={achievements}
            unlockedCount={unlockedAchievements.length}
          />
        </div>
      </div>

      <CreateGoalModal
        open={isGoalModalOpen}
        onOpenChange={setIsGoalModalOpen}
      />

      <EditProfileModal
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        profile={profile}
        onSave={handleUpdateProfile}
        isUpdating={isUpdating}
      />
    </div>
  )
}
