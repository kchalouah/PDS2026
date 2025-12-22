# Patient Service API Documentation

## Overview
Handle patient records, appointments, and medical dossiers.

## Features
- Patient Profile Management
- Appointment Scheduling & Management
- Medical Dossier Access

## API Endpoints

### Patients
- **POST** `/api/patients` - Create a new patient
- **GET** `/api/patients` - List all patients
- **GET** `/api/patients/{id}` - Get patient by ID
- **GET** `/api/patients/user/{userId}` - Get patient by User ID
- **GET** `/api/patients/search?query={q}` - Search patients
- **PUT** `/api/patients/{id}` - Update patient
- **DELETE** `/api/patients/{id}` - Delete patient

### Appointments
- **POST** `/api/appointments` - Book appointment
- **GET** `/api/appointments` - List all appointments (Role: Medecin/Admin)
- **GET** `/api/appointments/{id}` - Get appointment details
- **GET** `/api/appointments/patient/{patientId}` - List appointments for a patient
- **GET** `/api/appointments/medecin/{medecinId}` - List appointments for a doctor
- **PUT** `/api/appointments/{id}/status?status={status}` - Update status (CONFIRMED, ANNULE, REALISE)
- **PUT** `/api/appointments/{id}/reschedule` - Reschedule appointment
- **DELETE** `/api/appointments/{id}` - Cancel/Delete appointment

### Medical Dossiers
- **GET** `/api/dossiers` - List all dossiers
- **GET** `/api/dossiers/{id}` - Get dossier by ID
- **GET** `/api/dossiers/patient/{patientId}` - Get dossier by Patient ID
- **PUT** `/api/dossiers/{id}` - Update dossier
