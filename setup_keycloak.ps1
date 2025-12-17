# setup_keycloak.ps1
# Automates Keycloak configuration for MedInsight

Write-Host "Waiting for Keycloak to be ready..." -ForegroundColor Cyan

# Wait for Keycloak to be accessible
$retryCount = 0
$maxRetries = 30
$connected = $false

while (-not $connected -and $retryCount -lt $maxRetries) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8180/realms/master" -Method Head -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            $connected = $true
            Write-Host "Keycloak is UP!" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "." -NoNewline
        Start-Sleep -Seconds 2
        $retryCount++
    }
}

if (-not $connected) {
    Write-Host "Keycloak is not reachable. Please ensure the container is running." -ForegroundColor Red
    exit 1
}

Write-Host "Configuring Keycloak Realm 'medinsight'..." -ForegroundColor Cyan

# 1. Login to Keycloak Admin CLI within Docker
# We use the internal port 8080 because we are executing INSIDE the container
docker exec medinsight-keycloak /opt/keycloak/bin/kcadm.sh config credentials --server http://localhost:8080 --realm master --user admin --password KeycloakAdmin2024!

# 2. Create Realm
Write-Host "Creating Realm..."
docker exec medinsight-keycloak /opt/keycloak/bin/kcadm.sh create realms -s realm=medinsight -s enabled=true -o

# 3. Create Client
Write-Host "Creating Client 'medinsight-client'..."
docker exec medinsight-keycloak /opt/keycloak/bin/kcadm.sh create clients -r medinsight -s clientId=medinsight-client -s enabled=true -s "redirectUris=[\"*\"]" -s "webOrigins=[\"*\"]" -s publicClient=true -s standardFlowEnabled=true -s directAccessGrantsEnabled=true -o

# 4. Create Roles
Write-Host "Creating Roles..."
docker exec medinsight-keycloak /opt/keycloak/bin/kcadm.sh create roles -r medinsight -s name=ADMIN
docker exec medinsight-keycloak /opt/keycloak/bin/kcadm.sh create roles -r medinsight -s name=PATIENT
docker exec medinsight-keycloak /opt/keycloak/bin/kcadm.sh create roles -r medinsight -s name=MEDECIN
docker exec medinsight-keycloak /opt/keycloak/bin/kcadm.sh create roles -r medinsight -s name=RESPONSABLE_SECURITE
docker exec medinsight-keycloak /opt/keycloak/bin/kcadm.sh create roles -r medinsight -s name=GESTIONNAIRE

# 5. Create Users
Write-Host "Creating Users..."

# Super Admin (All Roles)
docker exec medinsight-keycloak /opt/keycloak/bin/kcadm.sh create users -r medinsight -s username=superadmin -s enabled=true -s email=admin@medinsight.com
docker exec medinsight-keycloak /opt/keycloak/bin/kcadm.sh set-password -r medinsight --username superadmin --new-password admin
docker exec medinsight-keycloak /opt/keycloak/bin/kcadm.sh add-roles -r medinsight --uusername superadmin --rolename ADMIN

# Patient (Karim)
docker exec medinsight-keycloak /opt/keycloak/bin/kcadm.sh create users -r medinsight -s username=karim -s enabled=true -s email=karim@test.com -s firstName=Karim -s lastName=Patient
docker exec medinsight-keycloak /opt/keycloak/bin/kcadm.sh set-password -r medinsight --username karim --new-password 1234
docker exec medinsight-keycloak /opt/keycloak/bin/kcadm.sh add-roles -r medinsight --uusername karim --rolename PATIENT

# Doctor
docker exec medinsight-keycloak /opt/keycloak/bin/kcadm.sh create users -r medinsight -s username=doctor1 -s enabled=true -s email=doctor@medinsight.com -s firstName=Dr -s lastName=Smith
docker exec medinsight-keycloak /opt/keycloak/bin/kcadm.sh set-password -r medinsight --username doctor1 --new-password 1234
docker exec medinsight-keycloak /opt/keycloak/bin/kcadm.sh add-roles -r medinsight --uusername doctor1 --rolename MEDECIN

# Security Officer
docker exec medinsight-keycloak /opt/keycloak/bin/kcadm.sh create users -r medinsight -s username=securite1 -s enabled=true -s email=securite@medinsight.com -s firstName=Jean -s lastName=Securite
docker exec medinsight-keycloak /opt/keycloak/bin/kcadm.sh set-password -r medinsight --username securite1 --new-password 1234
docker exec medinsight-keycloak /opt/keycloak/bin/kcadm.sh add-roles -r medinsight --uusername securite1 --rolename RESPONSABLE_SECURITE

# Service Manager
docker exec medinsight-keycloak /opt/keycloak/bin/kcadm.sh create users -r medinsight -s username=gestionnaire1 -s enabled=true -s email=gestionnaire@medinsight.com -s firstName=Marie -s lastName=Gestionnaire
docker exec medinsight-keycloak /opt/keycloak/bin/kcadm.sh set-password -r medinsight --username gestionnaire1 --new-password 1234
docker exec medinsight-keycloak /opt/keycloak/bin/kcadm.sh add-roles -r medinsight --uusername gestionnaire1 --rolename GESTIONNAIRE

Write-Host "---------------------------------------------------" -ForegroundColor Green
Write-Host "Keycloak configured successfully!" -ForegroundColor Green
Write-Host "Realm: medinsight"
Write-Host "Client: medinsight-client"
Write-Host ""
Write-Host "Users created:"
Write-Host "  - superadmin (password: admin) - Role: ADMIN"
Write-Host "  - karim (password: 1234) - Role: PATIENT"
Write-Host "  - doctor1 (password: 1234) - Role: MEDECIN"
Write-Host "  - securite1 (password: 1234) - Role: RESPONSABLE_SECURITE"
Write-Host "  - gestionnaire1 (password: 1234) - Role: GESTIONNAIRE"
Write-Host "---------------------------------------------------"
