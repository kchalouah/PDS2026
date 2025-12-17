## 1. Gateway Configuration (`application.yml`)
- **Gateway Port:** `8080`
- **Dynamic Routing:** Enabled. Access services via `http://localhost:8080/service-id/**`
- **Swagger UI:**
    - Patient: `http://localhost:8080/patient-service/swagger-ui/index.html`
    - Medecin: `http://localhost:8080/medecin-service/swagger-ui/index.html`
    - Docs: `http://localhost:8080/patient-service/v3/api-docs`

## 2. Keycloak Configuration (Automated)
The realm `medinsight` was created automatically via script.
- **Admin Console:** `http://localhost:8180` (Login: `admin` / `KeycloakAdmin2024!`)
- **Key Users:**
    - `karim` (Role: `PATIENT`, Password: `1234`)
    - `superadmin` (Role: `ADMIN`, Password: `admin`)
    - `doctor1` (Role: `MEDECIN`, Password: `1234`)

## 3. Verification Commands (Curl)
**Note:** To test via curl with password, you must enable "Direct Access Grants" for `medinsight-client` in Keycloak Console.

```bash
# 1. Get Token (Requires Direct Access Grants enabled)
curl -X POST http://localhost:8180/realms/medinsight/protocol/openid-connect/token \
  -d "client_id=medinsight-client" \
  -d "username=karim" \
  -d "password=1234" \
  -d "grant_type=password"

# 2. Test Accessible Endpoint
curl -I http://localhost:8080/patient-service/v3/api-docs
```

## 5. Next Steps
1. Open [http://localhost:8080/patient-service/swagger-ui/index.html](http://localhost:8080/patient-service/swagger-ui/index.html) in your browser.
2. Use the "Authorize" button (if configured for implicitly/code flow) or simply explore the API definitions.
