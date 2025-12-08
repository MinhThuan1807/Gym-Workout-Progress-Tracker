import axiosInstance from './axios'

const axios = axiosInstance

export const verifyEmailAPI = async (data: VerifyEmailParams) => {
  const response = await axios.post('auth/verify', data)
  return response.data
}

/* User API */
export const registerUserAPI = async (data: RegisterUserParams) => {
  const response = await axios.post('users/register', data)
  return response.data
}

/* Admin API */
export const registerAdminAPI = async (data: RegisterAdminParams) => {
  const response = await axios.post('admins/register', data)
  return response.data
}

export const changespasswordAPI = async (data: {
  oldPassword: string
  newPassword: string
}) => {
  const response = await axios.put('auth/change-password', data)
  return response.data
}

export const getAdminProfileAPI = async () => {
  const response = await axios.get('admins/profile')
  return response.data
}

export const updateAdminProfileAPI = async (data: FormData) => {
  const response = await axios.put('admins/profile', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

/* Muscle Group API */
export const getAllMuscleGroupsAPI = async () => {
  const response = await axios.get('muscle-groups')
  return response.data
}

export const getMuscleGroupByIdAPI = async (id: string) => {
  const response = await axios.get(`muscle-groups/${id}`)
  return response.data
}

export const createMuscleGroupAPI = async (data: CreateMuscleGroupParams) => {
  const response = await axios.post('muscle-groups', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const updateMuscleGroupAPI = async (
  id: string,
  data: UpdateMuscleGroupRequest
) => {
  const response = await axios.put(`muscle-groups/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const deleteMuscleGroupAPI = async (id: string) => {
  const response = await axios.delete(`muscle-groups/${id}`)
  return response.data
}

/* Exercise API */

export const getAllExercisesAPI = async () => {
  const response = await axios.get('exercises')
  return response.data
}

export const getExerciseByIdAPI = async (id: string) => {
  const response = await axios.get(`exercises/${id}`)
  return response.data
}

export const createExerciseAPI = async (data: FormData) => {
  const response = await axios.post('exercises', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const updateExerciseAPI = async (id: string, data: FormData) => {
  const response = await axios.put(`exercises/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const deleteExerciseAPI = async (id: string) => {
  const response = await axios.delete(`exercises/${id}`)
  return response.data
}

export const uploadVideoAPI = async (id: string, data: FormData) => {
  const response = await axios.put(`exercises/${id}/upload-video`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

/* Blog API */

export const getAllBlogsAPI = async () => {
  const response = await axios.get('blogs')
  return response.data
}

export const getBlogByIdAPI = async (id: string) => {
  const response = await axios.get(`blogs/${id}`)
  return response.data
}

export const createBlogAPI = async (data: FormData) => {
  const response = await axios.post('blogs', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const updateBlogAPI = async (id: string, data: FormData) => {
  const response = await axios.put(`blogs/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const deleteBlogAPI = async (id: string) => {
  const response = await axios.delete(`blogs/${id}`)
  return response.data
}

export const likeBlogAPI = async (id: string) => {
  const response = await axios.put(`blogs/${id}/like`)
  return response.data
}

export const viewBlogAPI = async (id: string) => {
  const response = await axios.put(`blogs/${id}/view`)
  return response.data
}

export const getAllUsersAPI = async () => {
  const response = await axios.get('admins/users')
  return response.data
}

export const getUserByIdAPI = async (id: string) => {
  const response = await axios.get(`admins/users/${id}`)
  return response.data
}

export const updateUserAPI = async (id: string, data: FormData) => {
  const response = await axios.put(`admins/users/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export const deleteUserAPI = async (id: string) => {
  const response = await axios.delete(`admins/users/${id}`)
  return response.data
}

export const toggleUserStatusAPI = async (id: string) => {
  const response = await axios.patch(`admins/users/${id}/toggle-status`)
  return response.data
}

// ===== Dashboard Stats =====
export const totalUsersAPI = async () => {
  const response = await axios.get('dashboard/total-users')
  return response.data
}

export const totalExercisesAPI = async () => {
  const response = await axios.get('dashboard/total-exercises')
  return response.data
}

export const totalMuscleGroupsAPI = async () => {
  const response = await axios.get('dashboard/total-muscle-groups')
  return response.data
}

export const totalWorkoutPlansAPI = async () => {
  const response = await axios.get('dashboard/total-workout-plans')
  return response.data
}

export const totalUserByMonthAPI = async () => {
  const response = await axios.get('dashboard/total-users-by-month')
  return response.data
}

export const totalExerciseByTypeAPI = async () => {
  const response = await axios.get('dashboard/total-exercises-by-type')
  return response.data
}

