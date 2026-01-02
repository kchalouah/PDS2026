import { api } from './apiConfig';

export const medecinService = {
    getAllMedecins: async () => {
        const response = await api.get('/api/medecins');
        return response.data;
    },

    getMedecinById: async (id: number) => {
        const response = await api.get(`/api/medecins/${id}`);
        return response.data;
    },

    getMedecinByUserId: async (userId: number) => {
        const response = await api.get(`/api/medecins/user/${userId}`);
        return response.data;
    },

    createMedecin: async (medecinData: any) => {
        const response = await api.post('/api/medecins', medecinData);
        return response.data;
    },

    updateMedecin: async (id: number, medecinData: any) => {
        const response = await api.put(`/api/medecins/${id}`, medecinData);
        return response.data;
    },

    deleteMedecin: async (id: number) => {
        const response = await api.delete(`/api/medecins/${id}`);
        return response.data;
    },

    // Diagnostic operations
    getDiagnosticsByDossier: async (dossierId: number) => {
        const response = await api.get(`/api/medecins/diagnostics/dossier/${dossierId}`);
        return response.data;
    },

    addDiagnostic: async (diagnosticData: any) => {
        const response = await api.post('/api/medecins/diagnostics', diagnosticData);
        return response.data;
    },

    updateDiagnostic: async (id: number, diagnosticData: any) => {
        const response = await api.put(`/api/medecins/diagnostics/${id}`, diagnosticData);
        return response.data;
    },

    deleteDiagnostic: async (id: number) => {
        const response = await api.delete(`/api/medecins/diagnostics/${id}`);
        return response.data;
    },

    // Report operations
    getReportsByDossier: async (dossierId: number) => {
        const response = await api.get(`/api/medecins/reports/dossier/${dossierId}`);
        return response.data;
    },

    addReport: async (reportData: any) => {
        const response = await api.post('/api/medecins/reports', reportData);
        return response.data;
    },

    updateReport: async (id: number, reportData: any) => {
        const response = await api.put(`/api/medecins/reports/${id}`, reportData);
        return response.data;
    },

    deleteReport: async (id: number) => {
        const response = await api.delete(`/api/medecins/reports/${id}`);
        return response.data;
    },

    // Prescription operations (if managed by medecin service)
    createPrescription: async (prescriptionData: any) => {
        const response = await api.post('/api/medecins/prescriptions', prescriptionData);
        return response.data;
    },
};
