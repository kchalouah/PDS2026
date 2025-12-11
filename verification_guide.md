# MedInsight Refactoring & Verification Guide

## 1. Gateway Configuration (`application.yml`)
I have refactored the `gateway-service` configuration:
- **Dynamic Routing Enabled:** `spring.cloud.gateway.discovery.locator.enabled=true`. This means you can access services via `http://localhost:8080/service-id/**` (e.g. `/patient-service/api/patients`).
- **Static Swagger Routes:** I added explicit routes ONLY for Swagger UI redirection (`/swagger/patient/**` -> `/patient-service/swagger-ui/index.html`).
- **Security:** Added OAuth2 Resource Server configuration to validate JWTs from Keycloak using `KEYCLOAK_ISSUER` and `KEYCLOAK_JWKS_URL`.

## 2. Security & Keycloak
- **Microservices:** All updated to use `oauth2ResourceServer` to validate tokens.
- **Environment config:** 
  - `KEYCLOAK_ISSUER` is used for token validation (audience/issuer check).
  - `KEYCLOAK_JWKS_URL` is used to fetch the public keys from Keycloak container.
- **Secrets:** All hardcoded passwords in `docker-compose.yml` have been replaced with `${VAR_NAME}`.
- **Environment:** Created `.env.example`. **You must create a `.env` file in the root directory** using the content of `.env.example` before running `docker-compose up`.

## 3. Verification Commands (Curl)

### Get Access Token (Run this first to get a token)
```bash
# Replace with your actual realm, client, user details
# NOTE: If you are running this from your host machine, use localhost:8180
USERNAME="doctor_user"
PASSWORD="password"
CLIENT_ID="medinsight-client"
KEYCLOAK_URL="http://localhost:8180"

export ACCESS_TOKEN=$(curl -s -X POST "$KEYCLOAK_URL/realms/medinsight/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=$USERNAME" \
  -d "password=$PASSWORD" \
  -d "grant_type=password" \
  -d "client_id=$CLIENT_ID" | jq -r .access_token)

echo "Token: $ACCESS_TOKEN"
```

### Test API Endpoints (Through Gateway)
```bash
# Gateway listens on 8080.
# Dynamic route format: http://localhost:8080/{service-name}/{path}

# Patient Service
curl -v -H "Authorization: Bearer $ACCESS_TOKEN" http://localhost:8080/patient-service/api/patients

# Medecin Service
curl -v -H "Authorization: Bearer $ACCESS_TOKEN" http://localhost:8080/medecin-service/api/medecins

# Gestion Service
curl -v -H "Authorization: Bearer $ACCESS_TOKEN" http://localhost:8080/gestion-service/api/gestion
```

### Test Swagger UI
Open these in your browser (no token needed for UI HTML, but 'Try it out' will need auth):
- Patient: [http://localhost:8080/swagger/patient/index.html](http://localhost:8080/swagger/patient/index.html)
- Medecin: [http://localhost:8080/swagger/medecin/index.html](http://localhost:8080/swagger/medecin/index.html)
- Prediction: [http://localhost:8080/swagger/prediction/index.html](http://localhost:8080/swagger/prediction/index.html)
- Gestion: [http://localhost:8080/swagger/gestion/index.html](http://localhost:8080/swagger/gestion/index.html)
- Security: [http://localhost:8080/swagger/security/index.html](http://localhost:8080/swagger/security/index.html)
- Supervision: [http://localhost:8080/swagger/supervision/index.html](http://localhost:8080/swagger/supervision/index.html)

## 4. Keycloak Setup Guide

If you need to set up Keycloak from scratch:
1. **Access Console:** http://localhost:8180 (admin/KeycloakAdmin2024! from .env)
2. **Create Realm:** `medinsight`
3. **Create Client:** `medinsight-client`
   - Access Type: `public` (for frontend) or `confidential` (for backend/postman)
   - Valid Redirect URIs: `*` (for dev)
   - Web Origins: `*`
4. **Create Roles:** `ADMIN`, `MEDECIN`, `PATIENT`
5. **Create Users:** Assign roles to them.

## 5. Next Steps
1. **Build:** Run `mvn clean install -DskipTests` in `Backend/`.
2. **Env:** Copy `.env.example` to `.env`.
3. **Run:** `docker-compose up --build -d`.
