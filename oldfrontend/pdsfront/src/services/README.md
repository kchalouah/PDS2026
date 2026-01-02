# Services Directory

This directory contains all API service modules for the MedInsight frontend application.

## Structure

Each service is separated into its own file for better maintainability and clarity:

### Core Configuration
- **`apiConfig.ts`** - Shared axios configuration with interceptors for authentication and error handling

### Service Modules
- **`authService.ts`** - Authentication (login, register, logout)
- **`userService.ts`** - User management operations
- **`patientService.ts`** - Patient CRUD operations
- **`medecinService.ts`** - Doctor management + clinical data (diagnostics, reports, prescriptions)
- **`appointmentService.ts`** - Appointment scheduling and management
- **`dossierService.ts`** - Medical dossier operations
- **`prescriptionService.ts`** - Prescription management
- **`gestionService.ts`** - Manager operations
- **`securityService.ts`** - Security officer operations
- **`auditService.ts`** - Audit log retrieval
- **`predictionService.ts`** - AI predictions (bed occupancy, relapse risk)
- **`notificationService.ts`** - Notification management

### Index
- **`index.ts`** - Central export file for all services (maintains backward compatibility)

## Usage

### Import specific service:
```typescript
import { patientService } from '@/services/patientService';
```

### Import multiple services:
```typescript
import { patientService, appointmentService } from '@/services';
```

### Import from old api.ts (still works):
```typescript
import { patientService } from '@/services/api';
```

## Benefits of Modular Structure

1. **Better Organization** - Each service has its own file
2. **Easier Debugging** - Isolated error handling per service
3. **Improved Maintainability** - Changes to one service don't affect others
4. **Better Code Splitting** - Webpack can optimize bundle sizes
5. **Clear Responsibilities** - Each file has a single, clear purpose
6. **Easier Testing** - Services can be mocked individually
