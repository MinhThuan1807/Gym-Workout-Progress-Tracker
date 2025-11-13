import axiosInstance from "./axios"

export const muscleAPI = {
    getOneById: async(id: string) => {
        const response = await axiosInstance.get(`/muscle-groups/${id}`)
        return response.data;
    },
    getAll: async() => {
        const response = await axiosInstance.get('/muscle-groups')
        return response.data;
    }
}