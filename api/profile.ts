import axiosInstance from './axios'

interface UpdateProfileData {
  displayName?: string
  gender?: 'male' | 'female' | 'other'
  dob?: Date
  heightCm?: number
  weightKg?: number
  avatar?: File
}

interface CreateGoalData {
  goalType: GoalType
  targetValue: number
  unit?: string
  startValue?: number
  startDate?: string
  targetDate?: string
  note?: string
  metricCode?: MetricType
  exerciseId?: string
}

interface UpdateGoalData {
  goalType?: GoalType
  targetValue?: number
  unit?: string
  startValue?: number
  startDate?: string
  targetDate?: string
  note?: string
  metricCode?: MetricType
  exerciseId?: string
  status?: GoalStatus
}

export const profileAPI = {
  getProfile: async () => {
    const response = await axiosInstance.get('/users/profile')
    return response.data
  },

  updateProfile: async (profileData: UpdateProfileData) => {
    const formData = new FormData()

    // ✅ Only append fields that are provided and not undefined
    if (profileData.displayName !== undefined) {
      formData.append('displayName', profileData.displayName)
    }
    if (profileData.gender !== undefined) {
      formData.append('gender', profileData.gender)
    }
    if (profileData.dob !== undefined) {
      // ✅ Format date properly (YYYY-MM-DD)
      const dateStr =
        profileData.dob instanceof Date
          ? profileData.dob.toISOString().split('T')[0]
          : new Date(profileData.dob).toISOString().split('T')[0]
      formData.append('dob', dateStr)
    }
    if (profileData.heightCm !== undefined) {
      formData.append('heightCm', profileData.heightCm.toString())
    }
    if (profileData.weightKg !== undefined) {
      formData.append('weightKg', profileData.weightKg.toString())
    }
    if (profileData.avatar instanceof File) {
      formData.append('avatar', profileData.avatar)
    }

    console.log('📤 Sending FormData:', Array.from(formData.entries()))

    const response = await axiosInstance.put('/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  },

  getAllGoal: async () => {
    const response = await axiosInstance.get('/goals')
    return response.data
  },

  getGoalById: async (id: string) => {
    const response = await axiosInstance.get(`/goals/${id}`)
    return response.data
  },

  createGoal: async (data: CreateGoalData) => {
    const response = await axiosInstance.post('/goals', data)
    return response.data
  },

  updateGoal: async (id: string, data: UpdateGoalData) => {
    const response = await axiosInstance.put(`/goals/${id}`, data)
    return response.data
  },

  deleteGoal: async (id: string) => {
    const response = await axiosInstance.delete(`/goals/${id}`)
    return response.data
  }
}
