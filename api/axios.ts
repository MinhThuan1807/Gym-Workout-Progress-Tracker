/* eslint-disable @typescript-eslint/no-explicit-any */
import store from "@/store";
import { logoutUserAPI } from "@/store/slices/authSlice";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

// Types
interface ErrorResponse {
  message?: string;
  error?: string;
}

interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
  config: AxiosRequestConfig;
}

// Constants
const API_TIMEOUT = 15000;
const REFRESH_TOKEN_ENDPOINT = "/auth/refresh-token";
const COOKIE_SET_DELAY = 500; // Tăng lên 500ms

// Axios instances
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/v1/",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: API_TIMEOUT,
});

// 🔑 Separate instance for refresh (NO interceptors)
const axiosRefresh = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/v1/",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: API_TIMEOUT,
});

// Refresh state
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

// Helper: Delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ✅ Process queue
const processQueue = async (error: AxiosError | null): Promise<void> => {
  console.log(`📋 Processing queue: ${failedQueue.length} requests`);

  if (error) {
    failedQueue.forEach((prom) => prom.reject(error));
    failedQueue = [];
    return;
  }

  console.log("⏱️ Waiting for cookies to propagate...");
  await delay(COOKIE_SET_DELAY);

  console.log("🍪 Current cookies:", document.cookie);

  const queue = [...failedQueue];
  failedQueue = [];

  for (const item of queue) {
    try {
      console.log("♻️ Retrying queued request:", item.config.url);
      const response = await axiosInstance(item.config);
      item.resolve(response);
    } catch (err) {
      console.error("❌ Queued request failed:", item.config.url, err);
      item.reject(err);
    }
  }
};

// Handle logout
const handleLogout = (): void => {
  if (typeof window === "undefined") return;

  isRefreshing = false;
  failedQueue = [];

  store.dispatch(logoutUserAPI());

  if (!window.location.pathname.includes("/user/login")) {
    window.location.href = "/user/login";
  }
};

// ✅ RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ErrorResponse>) => {
    if (!error.response) {
      console.error("🌐 Network Error:", error.message);
      return Promise.reject(
        new Error("Network error. Please check your connection.")
      );
    }

    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    const { status } = error.response;

    // Handle 410 GONE - Token expired
    if (status === 410 && originalRequest && !originalRequest._retry) {
      if (originalRequest.url?.includes(REFRESH_TOKEN_ENDPOINT)) {
        console.error("❌ Refresh endpoint failed - logging out");
        handleLogout();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        console.log("⏳ Queueing request:", originalRequest.url);
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
            config: originalRequest,
          });
        });
      }

      isRefreshing = true;
      console.log("🔄 Starting token refresh...");
      console.log("🍪 Cookies before refresh:", document.cookie);

      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
          config: originalRequest,
        });

        (async () => {
          try {
            // Step 1: Refresh token
            const refreshResponse = await axiosRefresh.post(
              REFRESH_TOKEN_ENDPOINT
            );
            console.log("✅ Refresh response:", refreshResponse.status);

            // ✅ Step 2: CRITICAL - Fetch user profile to trigger cookie update
            console.log("🔄 Fetching user profile to update cookies...");
            try {
              await axiosRefresh.get("/users/profile");
              console.log(
                "✅ User profile fetched - cookies should be updated"
              );
            } catch (profileError) {
              console.warn(
                "⚠️ Profile fetch failed, continuing anyway:",
                profileError
              );
            }

            console.log("🍪 Cookies after refresh:", document.cookie);

            // Step 3: Process queue
            console.log("✅ Token refreshed - processing queue");
            await processQueue(null);

            console.log("🏁 Refresh process completed");
          } catch (refreshError) {
            console.error("❌ Refresh failed:", refreshError);
            await processQueue(refreshError as AxiosError);
            handleLogout();
          } finally {
            isRefreshing = false;
          }
        })();
      });
    }

    // Handle 401 UNAUTHORIZED
    if (status === 401) {
      console.warn("⚠️ Unauthorized - logging out");
      handleLogout();
      return Promise.reject(new Error("Unauthorized access"));
    }

    // Other errors
    const errorMessage =
      error.response.data?.message ||
      error.response.data?.error ||
      error.message ||
      "An unexpected error occurred";

    console.error(`❌ API Error [${status}]:`, errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosInstance;
