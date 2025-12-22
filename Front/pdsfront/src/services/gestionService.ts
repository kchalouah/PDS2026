import { api } from './apiConfig';

export const gestionService = {
    createManager: async (managerData: any) => {
        const response = await api.post('/api/managers', managerData);
        return response.data;
    },

    getAllManagers: async () => {
        const response = await api.get('/api/managers');
        return response.data;
    },

    getManagerById: async (id: number) => {
        const response = await api.get(`/api/managers/${id}`);
        return response.data;
    },

    updateManager: async (id: number, managerData: any) => {
        const response = await api.put(`/api/managers/${id}`, managerData);
        return response.data;
    },

    deleteManager: async (id: number) => {
        const response = await api.delete(`/api/managers/${id}`);
        return response.data;
    },
};
