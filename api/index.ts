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

export const createBlogAPI = async (data: CreateBlogRequest) => {
  const response = await axios.post('blogs', data)
  return response.data
}

export const updateBlogAPI = async (id: string, data: UpdateBlogRequest) => {
  const response = await axios.put(`blogs/${id}`, data)
  return response.data
}

export const deleteBlogAPI = async (id: string) => {
  const response = await axios.delete(`blogs/${id}`)
  return response.data
}
