import { api } from './apiConfig';

export const auditService = {
    createAuditLog: async (auditData: any) => {
        const response = await api.post('/api/audit', auditData);
        return response.data;
    },

    getAllAuditLogs: async () => {
        const response = await api.get('/api/audit');
        return response.data;
    },

    getAuditLogsByUser: async (userId: number) => {
        const response = await api.get(`/api/audit/user/${userId}`);
        return response.data;
    },
};
