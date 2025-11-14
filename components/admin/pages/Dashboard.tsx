'use client'

import { Users, Dumbbell, Activity, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { PageHeader } from '../shared/PageHeader'
import { StatCard } from '../shared/StatCard'
import { toast } from 'sonner'
import {
  totalUsersAPI,
  totalExercisesAPI,
  totalMuscleGroupsAPI,
  totalWorkoutPlansAPI
} from '@/api'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function Dashboard() {
  const router = useRouter()
  const [totalUsers, setTotalUsers] = useState<number>(0)
  const [totalExercises, setTotalExercises] = useState<number>(0)
  const [totalMuscleGroups, setTotalMuscleGroups] = useState<number>(0)
  const [totalWorkoutPlans, setTotalWorkoutPlans] = useState<number>(0)

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  useEffect(() => {
    // Fetch dashboard stats on mount
    const fetchStats = async () => {
      const fetchData = await Promise.all([
        totalUsersAPI(),
        totalExercisesAPI(),
        totalMuscleGroupsAPI(),
        totalWorkoutPlansAPI()
      ])
      setTotalUsers(
        formatNumber(fetchData[0].total as number) as unknown as number
      )
      setTotalExercises(
        formatNumber(fetchData[1].total as number) as unknown as number
      )
      setTotalMuscleGroups(
        formatNumber(fetchData[2].total as number) as unknown as number
      )
      setTotalWorkoutPlans(
        formatNumber(fetchData[3].total as number) as unknown as number
      )
    }
    fetchStats()
  }, [])

  return (
    <div className="p-4 lg:p-6">
      <PageHeader
        title="Dashboard Overview"
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      <div className="mb-6 bg-gradient-to-r from-[#2d8cf0] to-[#1e6bb8] text-white rounded-lg p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl lg:text-2xl mb-2">
              Welcome back, Admin! 👋
            </h2>
            <p className="text-blue-100 text-sm lg:text-base">
              Here's what's happening with your fitness platform today.
            </p>
          </div>
          <div>
            <button
              onClick={() => {
                router.refresh()
                toast.success('Dashboard data refreshed successfully!')
              }}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm lg:text-base whitespace-nowrap"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <StatCard
          title="Total Users"
          value={totalUsers.toString()}
          icon={Users}
          color="#2d8cf0"
        />
        <StatCard
          title="Total Exercises"
          value={totalExercises.toString()}
          icon={Dumbbell}
          color="#27ae60"
        />
        <StatCard
          title="Muscle Groups"
          value={totalMuscleGroups.toString()}
          icon={Activity}
          color="#e74c3c"
        />
        <StatCard
          title="Active Workout Plans"
          value={totalWorkoutPlans.toString()}
          icon={TrendingUp}
          color="#f39c12"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
          <h3 className="text-lg lg:text-xl text-gray-900 mb-4 font-medium">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link href="/admin/exercises/new">
              <button
                onClick={() => toast.info('Navigate to create new exercise')}
                className="w-full p-3 lg:p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#2d8cf0] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                    <Dumbbell className="w-4 h-4 lg:w-5 lg:h-5 text-[#2d8cf0]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-gray-900 font-medium">
                      Add Exercise
                    </div>
                    <div className="text-xs lg:text-sm text-gray-500 truncate">
                      Create a new workout
                    </div>
                  </div>
                </div>
              </button>
            </Link>

            <Link href="/admin/muscle-groups">
              <button
                onClick={() => toast.info('Navigate to create muscle group')}
                className="w-full p-3 lg:p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#2d8cf0] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg shrink-0">
                    <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-[#e74c3c]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-gray-900 font-medium">
                      Add Muscle Group
                    </div>
                    <div className="text-xs lg:text-sm text-gray-500 truncate">
                      Define muscle category
                    </div>
                  </div>
                </div>
              </button>
            </Link>

            <Link href="/admin/users">
              <button
                onClick={() => toast.info('Navigate to user management')}
                className="w-full p-3 lg:p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#2d8cf0] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg shrink-0">
                    <Users className="w-4 h-4 lg:w-5 lg:h-5 text-[#27ae60]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-gray-900 font-medium">View Users</div>
                    <div className="text-xs lg:text-sm text-gray-500 truncate">
                      Manage user accounts
                    </div>
                  </div>
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
