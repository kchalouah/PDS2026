import { api } from './apiConfig';

export const securityService = {
    createOfficer: async (officerData: any) => {
        const response = await api.post('/api/security-officers', officerData);
        return response.data;
    },

    getAllOfficers: async () => {
        const response = await api.get('/api/security-officers');
        return response.data;
    },

    getOfficerById: async (id: number) => {
        const response = await api.get(`/api/security-officers/${id}`);
        return response.data;
    },

    updateOfficer: async (id: number, officerData: any) => {
        const response = await api.put(`/api/security-officers/${id}`, officerData);
        return response.data;
    },

    deleteOfficer: async (id: number) => {
        const response = await api.delete(`/api/security-officers/${id}`);
        return response.data;
    },
};
