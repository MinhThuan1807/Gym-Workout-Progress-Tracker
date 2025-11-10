import axiosInstance from './axios'

const axios = axiosInstance

interface RegisterAdminParams {
  secretKey: string
  email: string
  password: string
}

/* Register Admin API */
export const registerAdminAPI = async ({
  secretKey,
  email,
  password
}: RegisterAdminParams) => {
  try {
    const response = await axios.post('admins/register', {
      secretKey,
      email,
      password
    })
    return response.data
  } catch (error) {
    throw error
  }
}
