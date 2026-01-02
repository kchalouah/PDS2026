import { localApi } from '@/lib/api';

export const authService = {
    login: async (credentials: { username: string; password: string }) => {
        const response = await localApi.post('/api/auth/login', credentials);
        return response.data;
    },

    register: async (userData: any) => {
        const response = await localApi.post('/api/auth/register', userData);
        return response.data;
    },

    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('medinsight_token');
            localStorage.removeItem('medinsight_user');
        }
    },
};
