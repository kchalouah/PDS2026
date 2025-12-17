import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Choose base URL depending on runtime (SSR vs browser)
const isServer = typeof window === 'undefined';
const BROWSER_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const SERVER_API_URL = process.env.INTERNAL_API_URL || BROWSER_API_URL;
const API_BASE_URL = isServer ? SERVER_API_URL : BROWSER_API_URL;

// Create axios instance for external backend (Spring Gateway)
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Create axios instance for local Next.js API routes (Auth orchestration)
const localApi: AxiosInstance = axios.create({
  baseURL: '', // Relative path to use Next.js server
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - Add JWT token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Only access localStorage in the browser
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('medinsight_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      const { status } = error.response;

      if (status === 401) {
        // Unauthorized - clear token and redirect to login (browser only)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('medinsight_token');
          localStorage.removeItem('medinsight_user');
          window.location.href = '/login';
        }
      } else if (status === 403) {
        // Forbidden - insufficient permissions
        console.error('Access forbidden');
      } else if (status === 500) {
        console.error('Server error');
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network error - no response from server');
    } else {
      // Something else happened
      console.error('Request error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;

// API Service Methods
export const authService = {
  login: async (username: string, password: string) => {
    // Use localApi for login proxy
    const response = await localApi.post('/api/auth/login', { username, password });
    return response.data;
  },

  validateToken: async (token: string) => {
    // This presumably hits backend? Or local? Assuming backend if it validates against Keycloak via introspection, 
    // BUT we don't have a local /api/auth/validate. Assuming it might check backend.
    // If original code was checking backend, keep it. 
    // Actually, usually validate is skipped if we just trust token expiry locally, but let's assume backend.
    const response = await api.post('/api/auth/validate', null, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
};

export const userService = {
  createUser: async (userData: any) => {
    // Use localApi for registration orchestration
    const response = await localApi.post('/api/users', userData);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/api/users');
    return response.data;
  },

  getUserByUsername: async (username: string) => {
    const response = await api.get(`/api/users/${username}`);
    return response.data;
  },
};

export const patientService = {
  createPatient: async (patientData: any) => {
    const response = await api.post('/api/patients', patientData);
    return response.data;
  },

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
};

export const appointmentService = {
  createAppointment: async (appointmentData: any) => {
    const response = await api.post('/api/appointments', appointmentData);
    return response.data;
  },

  getAllAppointments: async () => {
    const response = await api.get('/api/appointments');
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

  updateAppointmentStatus: async (id: number, status: string) => {
    const response = await api.put(`/api/appointments/${id}/status?status=${status}`);
    return response.data;
  },

  deleteAppointment: async (id: number) => {
    await api.delete(`/api/appointments/${id}`);
  },
};

export const dossierService = {
  getAllDossiers: async () => {
    const response = await api.get('/api/dossiers');
    return response.data;
  },

  getDossierById: async (id: number) => {
    const response = await api.get(`/api/dossiers/${id}`);
    return response.data;
  },

  getDossierByPatientId: async (patientId: number) => {
    const response = await api.get(`/api/dossiers/patient/${patientId}`);
    return response.data;
  },

  updateDossier: async (id: number, dossierData: any) => {
    const response = await api.put(`/api/dossiers/${id}`, dossierData);
    return response.data;
  },
};

export const medecinService = {
  createMedecin: async (medecinData: any) => {
    const response = await api.post('/api/medecins', medecinData);
    return response.data;
  },

  addPlanning: async (planningData: any) => {
    const response = await api.post('/api/medecins/planning', planningData);
    return response.data;
  },

  getPlanningByMedecin: async (medecinId: number) => {
    const response = await api.get(`/api/medecins/planning/medecin/${medecinId}`);
    return response.data;
  },
};

export const prescriptionService = {
  createPrescription: async (prescriptionData: any) => {
    const response = await api.post('/api/prescriptions', prescriptionData);
    return response.data;
  },

  getPrescriptionsByDossier: async (dossierId: number) => {
    const response = await api.get(`/api/prescriptions/dossier/${dossierId}`);
    return response.data;
  },
};

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
