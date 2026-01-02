import { api } from './apiConfig';

export const prescriptionService = {
    getPrescriptionsByDossier: async (dossierId: number) => {
        const response = await api.get(`/api/prescriptions/dossier/${dossierId}`);
        return response.data;
    },

    getPrescriptionById: async (id: number) => {
        const response = await api.get(`/api/prescriptions/${id}`);
        return response.data;
    },

    createPrescription: async (prescriptionData: any) => {
        const response = await api.post('/api/prescriptions', prescriptionData);
        return response.data;
    },

    updatePrescription: async (id: number, prescriptionData: any) => {
        const response = await api.put(`/api/prescriptions/${id}`, prescriptionData);
        return response.data;
    },

    deletePrescription: async (id: number) => {
        const response = await api.delete(`/api/prescriptions/${id}`);
        return response.data;
    },
};
