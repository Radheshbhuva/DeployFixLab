import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: `${baseURL}/api/v1`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach bearer token if available in authStore
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Automatic 401 token refresh interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(
          `${baseURL}/api/v1/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const { accessToken } = refreshResponse.data;
        useAuthStore.getState().setUser(useAuthStore.getState().user, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
