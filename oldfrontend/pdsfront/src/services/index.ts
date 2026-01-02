// Central export file for all services
// This maintains backward compatibility with existing imports

export { authService } from './authService';
export { userService } from './userService';
export { patientService } from './patientService';
export { medecinService } from './medecinService';
export { appointmentService } from './appointmentService';
export { dossierService } from './dossierService';
export { prescriptionService } from './prescriptionService';
export { gestionService } from './gestionService';
export { securityService } from './securityService';
export { auditService } from './auditService';
export { predictionService } from './predictionService';
export { notificationService } from './notificationService';

// Also export the api instance for direct use if needed
export { api, localApi } from './apiConfig';
