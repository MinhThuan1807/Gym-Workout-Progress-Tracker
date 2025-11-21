import axiosInstance from './axios'

interface LogMetricData {
  metricCode: MetricType
  value: number
  unit: string
  measureAt?: string
  note?: string
}

interface MetricHistoryParams {
  startDate?: string
  endDate?: string
  limit?: number
}

interface MetricStatsParams {
  startDate?: string
  endDate?: string
  groupBy?: 'day' | 'week' | 'month'
}

interface GetAllMetricsParams {
  metricCode?: MetricType
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export const metricAPI = {
  // Log new metric
  logMetric: async (data: LogMetricData) => {
    const response = await axiosInstance.post('/metric-entries', data)
    return response.data
  },

  // Get all metrics with filters
  getAll: async (params?: GetAllMetricsParams) => {
    const response = await axiosInstance.get('/metric-entries', { params })
    return response.data
  },

  // Get latest metric by code for goal tracking
  getLatestByCode: async (metricCode: MetricType) => {
    const response = await axiosInstance.get(
      `/metric-entries/latest/${metricCode}`
    )
    return response.data
  },

  // Get history for chart rendering
  getHistory: async (metricCode: MetricType, params?: MetricHistoryParams) => {
    const response = await axiosInstance.get(
      `/metric-entries/history/${metricCode}`,
      { params }
    )
    return response.data
  },

  // Get statistics
  getStats: async (metricCode: MetricType, params?: MetricStatsParams) => {
    const response = await axiosInstance.get(
      `/metric-entries/stats/${metricCode}`,
      { params }
    )
    return response.data
  },

  // Get metric by ID
  getById: async (id: string) => {
    const response = await axiosInstance.get(`/metric-entries/${id}`)
    return response.data
  },

  // Update metric
  update: async (id: string, data: Partial<LogMetricData>) => {
    const response = await axiosInstance.put(`/metric-entries/${id}`, data)
    return response.data
  },

  // Delete metric
  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/metric-entries/${id}`)
    return response.data
  },

  // Deprecated - Keep for backward compatibility
  getMetricsByCode: async (metricCode: MetricType) => {
    console.warn('getMetricsByCode is deprecated. Use getAll() instead.')
    const response = await axiosInstance.get('/metric-entries', {
      params: { metricCode }
    })
    return response.data
  },

  // Deprecated - Keep for backward compatibility
  getLatestMetric: async (metricCode: MetricType) => {
    console.warn(
      'getLatestMetric is deprecated. Use getLatestByCode() instead.'
    )
    const response = await axiosInstance.get(
      `/metric-entries/latest/${metricCode}`
    )
    return response.data
  }
}
