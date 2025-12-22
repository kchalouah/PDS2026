/**
 * DEPRECATED: This file is maintained for backward compatibility only.
 * 
 * All services have been refactored into separate files for better organization.
 * Please import from specific service files or from '@/services' instead.
 * 
 * New structure:
 * - @/services/apiConfig - Shared axios configuration
 * - @/services/authService - Authentication
 * - @/services/userService - User management
 * - @/services/patientService - Patient operations
 * - @/services/medecinService - Doctor & clinical data
 * - @/services/appointmentService - Appointments
 * - @/services/dossierService - Medical dossiers
 * - @/services/prescriptionService - Prescriptions
 * - @/services/gestionService - Manager operations
 * - @/services/securityService - Security officers
 * - @/services/auditService - Audit logs
 * - @/services/predictionService - AI predictions
 * - @/services/notificationService - Notifications
 * 
 * See @/services/README.md for full documentation.
 */

// Re-export everything from the new modular structure
export * from './index';

// Default export for backward compatibility
export { default } from './apiConfig';
