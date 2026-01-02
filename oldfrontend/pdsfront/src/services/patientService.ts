import { api } from './apiConfig';

export const patientService = {
    getAllPatients: async () => {
        const response = await api.get('/api/patients');
        return response.data;
    },

    getPatientById: async (id: number) => {
        const response = await api.get(`/api/patients/${id}`);
        return response.data;
    },

    getPatientByUserId: async (userId: number) => {
        const response = await api.get(`/api/patients/user/${userId}`);
        return response.data;
    },

    createPatient: async (patientData: any) => {
        const response = await api.post('/api/patients', patientData);
        return response.data;
    },

    updatePatient: async (id: number, patientData: any) => {
        const response = await api.put(`/api/patients/${id}`, patientData);
        return response.data;
    },

    deletePatient: async (id: number) => {
        const response = await api.delete(`/api/patients/${id}`);
        return response.data;
    },
};
