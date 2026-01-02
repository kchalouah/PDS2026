import { api } from './apiConfig';

export const predictionService = {
    getBedOccupancy: async () => {
        const response = await api.get('/api/predictions/bed-occupancy');
        return response.data;
    },

    getRelapseRisk: async () => {
        const response = await api.get('/api/predictions/relapse-risk');
        return response.data;
    },
};
