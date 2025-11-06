import axiosInstance from "./axios";

interface credentials {
    email: string;
    password: string;
}


export const authAPI = {
    login: async (credentials: credentials) => {
        const response = await axiosInstance.post(
            '/auth/login',
            credentials
        );
        return response.data;
        
    },
    logout: async () => {
        const response = await axiosInstance.post(
            '/auth/logout'
        );
        return response.data;
    },
    getCurrentUser: async () => {
        const response = await axiosInstance.get(
            '/users/profile'
        );
        return response.data;
    },
    register: async (credentials: credentials) => {
        const response = await axiosInstance.post(
            '/users/register',
            credentials
        );
        return response.data;
    },
    registerAdmin: async (credentials: credentials, secretKey: string) => {
        const response = await axiosInstance.post(
            '/admin/register',
            { ...credentials, secretKey }
        );
        return response.data;
    },
    verifyEmail: async (email: string, token: string) => {
        const response = await axiosInstance.post(
            '/users/verify',
            { email, token }
        );
        return response.data;
    },
}
