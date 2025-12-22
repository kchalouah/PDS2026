# Security Service API Documentation

## Overview
Manage security officers and audit logs. Authentication is handled by Gateway/Keycloak.

## Features
- Security Officer Management
- Audit Logging & Retrieval

## API Endpoints

### Security Officers
- **POST** `/api/security-officers` - Create a security officer
- **GET** `/api/security-officers` - List all officers
- **GET** `/api/security-officers/{id}` - Get officer by ID
- **GET** `/api/security-officers/user/{userId}` - Get officer by User ID
- **PUT** `/api/security-officers/{id}` - Update officer
- **DELETE** `/api/security-officers/{id}` - Delete officer

### Audit Logs
- **POST** `/api/audit` - Create audit log entry
- **GET** `/api/audit` - List all audit logs
- **GET** `/api/audit/user/{userId}` - Get logs by user
- **GET** `/api/audit/action/{action}` - Get logs by action type
- **GET** `/api/audit/entity/{entityType}/{entityId}` - Get logs by entity
- **GET** `/api/audit/date-range?start={iso}&end={iso}` - Get logs by date range
