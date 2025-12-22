import { api } from './apiConfig';

export const dossierService = {
    getDossierByPatientId: async (patientId: number) => {
        const response = await api.get(`/api/dossiers/patient/${patientId}`);
        return response.data;
    },

    getDossierById: async (id: number) => {
        const response = await api.get(`/api/dossiers/${id}`);
        return response.data;
    },

    createDossier: async (dossierData: any) => {
        const response = await api.post('/api/dossiers', dossierData);
        return response.data;
    },

    updateDossier: async (id: number, dossierData: any) => {
        const response = await api.put(`/api/dossiers/${id}`, dossierData);
        return response.data;
    },
};
