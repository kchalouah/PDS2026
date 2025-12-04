# MedInsight E-Health Platform

A comprehensive microservices-based E-Health platform for managing patients, doctors, appointments, medical records, and predictions.

## 🏗️ Architecture

### Microservices
- **Eureka Server** (`:8761`) - Service Discovery
- **Config Service** (`:8888`) - Centralized Configuration
- **API Gateway** (`:8080`) - Single entry point with JWT validation
- **Patient Service** (`:8081`) - Patient & medical record management
- **Medecin Service** (`:8082`) - Doctor, diagnostics, prescriptions
- **Prediction Service** (`:8083`) - AI-driven predictions
- **Gestion Service** (`:8084`) - Statistics & management
- **Security Service** (`:8085`) - Authentication & user management
- **Supervision Service** (`:8086`) - Health checks & monitoring

### Infrastructure
- **PostgreSQL** (`:5432`) - Database
- **Keycloak** (`:8180`) - OAuth2/OIDC provider
- **Prometheus** (`:9090`) - Metrics collection
- **Grafana** (`:3000`) - Monitoring dashboards

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Java 17+
- Node.js 18+ (for frontend)
- Maven 3.8+

### 1. Clone Repository
```bash
git clone <repository-url>
cd PDS2026
```

### 2. Set Environment Variables
```bash
# Copy the example file
cp Backend/.env.example Backend/.env

# Edit .env with your secure passwords
# IMPORTANT: Never commit .env to git!
```

### 3. Build Backend Services
```bash
cd Backend
./mvnw clean package -DskipTests
```

### 4. Start All Services
```bash
# From project root
docker-compose up -d
```

### 5. Verify Services
- Eureka Dashboard: http://localhost:8761
- API Gateway: http://localhost:8080
- Swagger UI (each service): http://localhost:808X/swagger-ui.html
- Grafana: http://localhost:3000 (admin/GrafanaAdmin2024!)
- Prometheus: http://localhost:9090

## 📚 API Documentation

### Authentication
```bash
# Login
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "john.doe",
  "password": "password123"
}

# Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "john.doe",
  "role": "PATIENT"
}
```

### Using JWT Token
```bash
# Include token in Authorization header
GET http://localhost:8080/api/patients
Authorization: Bearer <your-jwt-token>
```

### Key Endpoints

#### Patient Service
- `POST /api/patients` - Create patient
- `GET /api/patients` - List all patients
- `GET /api/patients/{id}` - Get patient by ID
- `GET /api/dossiers/patient/{patientId}` - Get medical record
- `POST /api/appointments` - Book appointment
- `GET /api/appointments/patient/{patientId}` - Get patient appointments

#### Doctor Service
- `POST /api/medecins` - Create doctor
- `POST /api/medecins/planning` - Add availability
- `GET /api/medecins/planning/medecin/{medecinId}` - Get doctor schedule
- `POST /api/prescriptions` - Create prescription
- `GET /api/medecins/predict/bed-occupancy` - Get AI predictions

#### Security Service
- `POST /api/auth/login` - Login
- `POST /api/auth/validate` - Validate JWT token
- `POST /api/users` - Create user
- `GET /api/audit` - View audit logs

Full API documentation available at: http://localhost:8080/swagger-ui.html

## 🔐 Security Features

### Password Encryption
- All passwords encrypted with BCrypt
- Minimum 8 characters required
- Stored securely in database

### JWT Authentication
- Token-based authentication
- 24-hour expiration (configurable)
- Role-based access control (RBAC)
- Roles: PATIENT, MEDECIN, MANAGER, SECURITY_OFFICER

### Environment Variables
All sensitive data stored in environment variables:
- Database credentials
- JWT secret key
- Keycloak client secrets

### CORS Configuration
Frontend origins whitelisted in API Gateway:
- http://localhost:3000 (Next.js)
- http://localhost:5173 (Vite)
- Production domain (configure in CorsConfig.java)

## 🗄️ Database

### Auto-Generated Schema
Spring JPA automatically creates database tables on startup.

### Entities
- **User** - Authentication & authorization
- **Patient** - Patient information
- **DossierMedical** - Medical records
- **Appointment** - Appointments/RDV
- **Medecin** - Doctor information
- **Prescription** - Prescriptions/Ordonnances
- **Diagnostic** - Medical diagnostics
- **Report** - Medical reports
- **Planning** - Doctor availability
- **Manager** - Service managers
- **SecurityOfficer** - Security personnel
- **AuditLog** - Audit trail

## 📊 Monitoring

### Prometheus Metrics
All services expose metrics at `/actuator/prometheus`

### Grafana Dashboards
Access Grafana at http://localhost:3000
- Default credentials: admin / GrafanaAdmin2024!
- Pre-configured dashboards for all services

### Health Checks
- Individual service health: http://localhost:808X/actuator/health
- System health: http://localhost:8086/api/supervision/health

## 🧪 Testing

### Run Unit Tests
```bash
cd Backend
./mvnw test
```

### Run Integration Tests
```bash
./mvnw verify
```

### Manual Testing with Postman
Import the Postman collection (coming soon) for pre-configured API requests.

## 🐳 Docker Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f patient-service
```

### Rebuild After Code Changes
```bash
# Rebuild all
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build patient-service
```

## 🛠️ Development

### Project Structure
```
PDS2026/
├── Backend/
│   ├── config-service/
│   ├── eureka-server/
│   ├── gateway-service/
│   ├── patient-service/
│   ├── medecin-service/
│   ├── prediction-service/
│   ├── gestion-service/
│   ├── security-service/
│   ├── supervision-service/
│   └── pom.xml (parent)
├── Front/
│   └── pdsfront/
├── infra/
│   ├── prometheus/
│   └── grafana/
└── docker-compose.yml
```

### Adding a New Service
1. Create service module in Backend/
2. Add Dockerfile
3. Update docker-compose.yml
4. Register with Eureka
5. Add routes to Gateway
6. Update Prometheus scrape config

## 🔧 Configuration

### Environment Variables (.env)
```env
# Database
POSTGRES_USER=meduser
POSTGRES_PASSWORD=<your-secure-password>
POSTGRES_DB=medinsight

# JWT
JWT_SECRET=<your-jwt-secret-key>
JWT_EXPIRATION=86400000

# Keycloak
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=<your-keycloak-password>
KEYCLOAK_CLIENT_SECRET=<your-client-secret>
```

### Service Ports
- Eureka: 8761
- Config: 8888
- Gateway: 8080
- Patient: 8081
- Medecin: 8082
- Prediction: 8083
- Gestion: 8084
- Security: 8085
- Supervision: 8086

## 📝 License

[Your License Here]

## 👥 Contributors

[Your Team Here]

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**MedInsight** - Transforming Healthcare Through Technology 🏥
