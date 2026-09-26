import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const rawApiBase = import.meta.env.VITE_API_BASE_URL;
// Defaults to relative '/api/v1' when not explicitly provided.
// This routes through Vite's dev proxy to localhost:5000 and works seamlessly
// across both localhost and Cloudflare tunnel URLs (e.g. *.trycloudflare.com).
const baseURL = rawApiBase && rawApiBase.trim() !== ''
  ? (rawApiBase.endsWith('/api/v1') ? rawApiBase : `${rawApiBase.replace(/\/+$/, '')}/api/v1`)
  : '/api/v1';

export const apiClient = axios.create({
  baseURL,
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
    const url = originalRequest?.url || '';
    const isAuthRoute =
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/oauth') ||
      url.includes('/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const accessToken =
          refreshResponse.data?.data?.accessToken || refreshResponse.data?.accessToken;
        if (accessToken) {
          useAuthStore.getState().setUser(useAuthStore.getState().user, accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
