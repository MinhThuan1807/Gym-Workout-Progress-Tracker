import axiosInstance from "./axios";

export const metricAPI = {
    create: async (data: {metricCode: MetricType, value: number, unit: string, measureAt: Date }) => {
        const response = await axiosInstance.post(
            '/metric-entries',
            data
        );
        return response.data;
    },
    getAll: async () => {
        const response = await axiosInstance.get(
            '/metric-entries'
        )
        return response.data
    }
}