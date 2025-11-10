import axiosInstance from './axios'

interface data {
  email: string
  password: string
}

export const authAPI = {
  login: async (data: data) => {
    const response = await axiosInstance.post('auth/login', data)
    return response.data
  },
  logout: async () => {
    const response = await axiosInstance.post('auth/logout')
    return response.data
  },
  getCurrentUser: async () => {
    const response = await axiosInstance.get('users/profile')
    return response.data
  },
  register: async (data: data) => {
    const response = await axiosInstance.post('users/register', data)
    return response.data
  },
  registerAdmin: async (data: data, secretKey: string) => {
    const response = await axiosInstance.post('admin/register', {
      ...data,
      secretKey
    })
    return response.data
  },
  verifyEmail: async (email: string, token: string) => {
    const response = await axiosInstance.post('users/verify', {
      email,
      token
    })
    return response.data
  }
}
