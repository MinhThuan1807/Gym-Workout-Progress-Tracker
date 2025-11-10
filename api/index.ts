import axiosInstance from './axios'

const axios = axiosInstance

interface RegisterAdminParams {
  secretKey: string
  email: string
  password: string
}

interface VerifyEmailParams {
  email: string
  token: string
}

export const verifyEmailAPI = async (data: VerifyEmailParams) => {
  const response = await axios.post('auth/verify', data)
  return response.data
}

/* Admin API */
export const registerAdminAPI = async (data: RegisterAdminParams) => {
  const response = await axios.post('admins/register', data)
  return response.data
}
