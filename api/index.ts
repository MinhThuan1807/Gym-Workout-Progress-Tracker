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
