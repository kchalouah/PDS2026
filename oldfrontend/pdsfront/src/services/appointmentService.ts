import { api } from './apiConfig';

export const appointmentService = {
    getAllAppointments: async () => {
        const response = await api.get('/api/appointments');
        return response.data;
    },

    getAppointmentById: async (id: number) => {
        const response = await api.get(`/api/appointments/${id}`);
        return response.data;
    },

    getAppointmentsByPatient: async (patientId: number) => {
        const response = await api.get(`/api/appointments/patient/${patientId}`);
        return response.data;
    },

    getAppointmentsByMedecin: async (medecinId: number) => {
        const response = await api.get(`/api/appointments/medecin/${medecinId}`);
        return response.data;
    },

    createAppointment: async (appointmentData: any) => {
        const response = await api.post('/api/appointments', appointmentData);
        return response.data;
    },

    updateAppointment: async (id: number, appointmentData: any) => {
        const response = await api.put(`/api/appointments/${id}`, appointmentData);
        return response.data;
    },

    updateStatus: async (id: number, status: string) => {
        const response = await api.put(`/api/appointments/${id}/status`, { status });
        return response.data;
    },

    updateAppointmentStatus: async (id: number, status: string) => {
        const response = await api.put(`/api/appointments/${id}/status`, { status });
        return response.data;
    },

    deleteAppointment: async (id: number) => {
        const response = await api.delete(`/api/appointments/${id}`);
        return response.data;
    },
};
