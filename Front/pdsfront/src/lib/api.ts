import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Choose base URL depending on runtime (SSR vs browser)
const isServer = typeof window === 'undefined';
const BROWSER_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const SERVER_API_URL = process.env.INTERNAL_API_URL || BROWSER_API_URL;
const API_BASE_URL = isServer ? SERVER_API_URL : BROWSER_API_URL;

// Create axios instance for external backend (Spring Gateway)
export const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Create axios instance for local Next.js API routes (Auth orchestration)
export const localApi: AxiosInstance = axios.create({
    baseURL: '', // Relative path to use Next.js server
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor - Add JWT token to requests
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('medinsight_token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const { status } = error.response;

            // Handle specific error codes
            if (status === 401) {
                // Unauthorized - clear auth and redirect
                if (typeof window !== 'undefined') {
                    // localStorage.removeItem('medinsight_token'); 
                    // localStorage.removeItem('medinsight_user');
                    // Avoid auto-redirect loop during dev; let context handle it
                }
            } else if (status === 403) {
                console.error('Access forbidden');
            } else if (status === 500) {
                console.error('Server error');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
