import { api } from './apiConfig';

export const userService = {
    getAllUsers: async () => {
        const response = await api.get('/api/users');
        return response.data;
    },

    getUserById: async (id: number) => {
        const response = await api.get(`/api/users/${id}`);
        return response.data;
    },
};
