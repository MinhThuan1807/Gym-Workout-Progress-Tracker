import axios, { 
  AxiosError, 
  AxiosInstance, 
  AxiosRequestConfig, 
  InternalAxiosRequestConfig 
} from 'axios';
import { getToken, setToken, removeTokens, isTokenExpired, getRefreshToken } from '@/lib/auth';



const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/v1/",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 15000, // 10 minutes
});
// Flag để tránh multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

// Xử lý queue khi refresh token xong
const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    let token = getToken();

    // Kiểm tra token hết hạn chưa
    if (token && isTokenExpired(token)) {
      // Nếu đang refresh, chờ
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          token = getToken();
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        });
      }

      // Refresh token
      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          token = newToken;
          processQueue(null, newToken);
        } else {
          processQueue(new Error('Refresh failed') as AxiosError, null);
          removeTokens();
          if (typeof window !== 'undefined') {
            window.location.href = 'user/login';
          }
        }
      } catch (error) {
        processQueue(error as AxiosError, null);
        removeTokens();
        if (typeof window !== 'undefined') {
          window.location.href = 'user/login';
        }
      } finally {
        isRefreshing = false;
      }
    }

    // Thêm token vào header
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

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

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
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
        const newToken = await refreshAccessToken();
        
        if (newToken) {
          processQueue(null, newToken);
          
          // Retry original request với token mới
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return axiosInstance(originalRequest);
        } else {
          processQueue(error, null);
          removeTokens();
          if (typeof window !== 'undefined') {
            window.location.href = 'user/login';
          }
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        removeTokens();
        if (typeof window !== 'undefined') {
          window.location.href = 'user/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Xử lý các lỗi khác
    const errorMessage = 
      (error.response?.data as any)?.message || 
      error.message || 
      'Something went wrong';
    
    return Promise.reject(new Error(errorMessage));
  }
);

// Hàm refresh token
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    // Dùng axios thuần, không qua interceptor
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      { refreshToken },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const { accessToken } = response.data;
    setToken(accessToken);
    return accessToken;
  } catch (error) {
    console.error('Refresh token failed:', error);
    return null;
  }
}

export default axiosInstance;