import axiosInstance from './axios'

export const commuityApi = {
  async fetchThreads() {
    const response = await axiosInstance.get('/threads/')
    return response.data
  },
  async createThread(title: string, type: string, message: string) {
    const response = await axiosInstance.post('/threads/', {
      title,
      type,
      message
    })
    return response.data
  }
}
