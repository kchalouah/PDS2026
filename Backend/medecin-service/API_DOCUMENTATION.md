# Medecin Service API Documentation

## Overview
Manage doctors, medical acts (diagnostics, prescriptions, reports), and planning.

## Features
- Doctor Profile Management
- Clinical Data Management (Diagnostics, Prescriptions, Reports)
- Schedule/Planning Management
- Predictive Analytics Integration

## API Endpoints

### Medecins
- **POST** `/api/medecins` - Create a doctor
- **GET** `/api/medecins` - List all doctors
- **GET** `/api/medecins/{id}` - Get doctor by ID
- **GET** `/api/medecins/user/{userId}` - Get doctor by User ID
- **PUT** `/api/medecins/{id}` - Update doctor details
- **DELETE** `/api/medecins/{id}` - Delete doctor

### Clinical Data
- **POST** `/api/medecins/diagnostics` - Add a diagnostic
- **DELETE** `/api/medecins/diagnostics/{id}` - Delete diagnostic
- **GET** `/api/medecins/diagnostics/dossier/{dossierId}` - Get diagnostics for a dossier
- **POST** `/api/medecins/prescriptions` - Create a prescription
- **DELETE** `/api/medecins/prescriptions/{id}` - Delete prescription
- **GET** `/api/medecins/prescriptions/dossier/{dossierId}` - Get prescriptions for a dossier
- **POST** `/api/medecins/reports` - Add a medical report
- **DELETE** `/api/medecins/reports/{id}` - Delete medical report
- **GET** `/api/medecins/reports/dossier/{dossierId}` - Get reports for a dossier

### Planning
- **POST** `/api/medecins/planning` - Add availability/planning
- **GET** `/api/medecins/planning/medecin/{medecinId}` - Get planning for a doctor

### Predictions (Proxy)
- **GET** `/api/medecins/predict/bed-occupancy` - Get bed occupancy prediction
