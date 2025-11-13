import axiosInstance from "./axios"

export const exerciseAPI = {
    getAll: async () => {
        const response = await axiosInstance.get('/exercises')
        return response.data
    }
}