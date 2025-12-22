# Gestion Service API Documentation

## Overview
Manage managers and provide system-wide statistics for the admin dashboard.

## Features
- Manager Profile Management
- System Statistics (Dashboard)

## API Endpoints

### Managers
- **POST** `/api/managers` - Create a manager
- **GET** `/api/managers` - List all managers
- **GET** `/api/managers/{id}` - Get manager by ID
- **GET** `/api/managers/user/{userId}` - Get manager by User ID
- **PUT** `/api/managers/{id}` - Update manager
- **DELETE** `/api/managers/{id}` - Delete manager

### Dashboard
- **GET** `/api/gestion/stats` - Get system statistics
  - Returns: `totalPatients`, `totalDoctors`, `activeConsultations`, `occupancyRate`
