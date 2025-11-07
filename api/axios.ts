import axios, { 
  AxiosError, 
  AxiosInstance, 
  AxiosRequestConfig, 
  InternalAxiosRequestConfig 
} from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/v1/",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 15000,
});
// Flag để tránh multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

// Xử lý queue khi refresh token xong
const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};


axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR - Xử lý lỗi 401
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

     // Nếu lỗi 410 GONE - token hết hạn, cần refresh
    if (error.response?.status === 410 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh, thêm vào queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi refresh token endpoint - cookies sẽ tự động gửi
         console.log('🔄 Refreshing token...');
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          {},
          { 
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
          }
        );
        processQueue(null);
        
        // Retry original request
        return axiosInstance(originalRequest);
        
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);
        
        // Xóa thông tin user và redirect về login
        if (typeof window !== 'undefined') {
            // Dispatch action để clear Redux state nếu cần
          window.dispatchEvent(new Event('auth:logout'));
          window.location.href = '/user/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Nếu lỗi 401 - chưa đăng nhập hoặc token không hợp lệ
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth:logout'));
        window.location.href = '/user/login';
      }
    }

    // Xử lý các lỗi khác
    const errorMessage = 
      (error.response?.data as any)?.message || 
      error.message || 
      'Something went wrong';
    
    return Promise.reject(new Error(errorMessage));
})

export default axiosInstance;