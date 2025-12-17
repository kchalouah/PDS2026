# MedInsight - Seed and Test Script
# Usage: ./seed_and_test.ps1

$BASE_URL_GATEWAY = "http://localhost:8080"
$BASE_URL_PREDICTION = "http://localhost:8083"

# 1. Authenticate (Get Token from Keycloak)
Write-Host "1. Authenticating via Keycloak..."
$authBody = @{
    client_id  = "medinsight-client"
    username   = "admin"
    password   = "password"
    grant_type = "password"
}

try {
    $tokenResponse = Invoke-RestMethod -Uri "http://localhost:8180/realms/medinsight/protocol/openid-connect/token" -Method Post -Body $authBody -ContentType "application/x-www-form-urlencoded"
    $token = $tokenResponse.access_token
    Write-Host "   Success! Token received."
}
catch {
    Write-Error "   Failed to authenticate with Keycloak. Ensure Keycloak is running and 'medinsight' realm is configured."
    Write-Error "   Error Details: $_"
    exit 1
}

$headers = @{
    Authorization = "Bearer $token"
}

# 2. Create Patient
Write-Host "`n2. Creating Patient..."
$patientBody = @{
    nom           = "Doe"
    prenom        = "John"
    email         = "john.doe@example.com"
    dateNaissance = "1980-01-01"
    adresse       = "123 Main St"
} | ConvertTo-Json

try {
    $patient = Invoke-RestMethod -Uri "$BASE_URL_GATEWAY/api/patients" -Method Post -Body $patientBody -ContentType "application/json" -Headers $headers
    Write-Host "   Success! Patient created (via Gateway): $($patient.nom) $($patient.prenom)"
}
catch {
    Write-Host "   Gateway failed: $($_.Exception.Message). Retrying 8081 directly..."
    try {
        $patient = Invoke-RestMethod -Uri "http://localhost:8081/api/patients" -Method Post -Body $patientBody -ContentType "application/json" -Headers $headers
        Write-Host "   Success! Patient created (Direct 8081): $($patient.nom) $($patient.prenom)"
    }
    catch {
        Write-Error "   Failed Direct: $($_.Exception.Message)"
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader $_.Exception.Response.GetResponseStream()
            Write-Error "   Response Body: $($reader.ReadToEnd())"
        }
    }
}

# 3. Create Doctor
Write-Host "`n3. Creating Doctor..."
$doctorBody = @{
    nom        = "Smith"
    prenom     = "Alice"
    specialite = "Cardiologie"
    email      = "alice.smith@medinsight.com"
} | ConvertTo-Json

try {
    $doctor = Invoke-RestMethod -Uri "$BASE_URL_GATEWAY/api/medecins" -Method Post -Body $doctorBody -ContentType "application/json" -Headers $headers
    Write-Host "   Success! Doctor created (via Gateway): Dr. $($doctor.nom)"
}
catch {
    Write-Host "   Gateway failed: $($_.Exception.Message). Retrying 8082 directly..."
    try {
        $doctor = Invoke-RestMethod -Uri "http://localhost:8082/api/medecins" -Method Post -Body $doctorBody -ContentType "application/json" -Headers $headers
        Write-Host "   Success! Doctor created (Direct 8082): Dr. $($doctor.nom)"
    }
    catch {
        Write-Error "   Failed Direct: $($_.Exception.Message)"
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader $_.Exception.Response.GetResponseStream()
            Write-Error "   Response Body: $($reader.ReadToEnd())"
        }
    }
}

# 4. Test Prediction (No-Show)
Write-Host "`n4. Testing No-Show Prediction..."
$predictionBody = @{
    age               = 45
    distance          = 15.0
    lead_time         = 10
    previous_no_shows = 2
} | ConvertTo-Json

try {
    # Calling Prediction Service directly (Port 8083) or via Gateway (8080)
    # Using direct port 8083 as configured in previous steps, but ideally should be via Gateway.
    # Note: Security was disabled for /api/predictions/** in Prediction Service, so no token needed for that specific endpoint,
    # but providing headers anyway is good practice.
    $prediction = Invoke-RestMethod -Uri "$BASE_URL_PREDICTION/api/predictions/predict-no-show" -Method Post -Body $predictionBody -ContentType "application/json"
    Write-Host "   Success! Prediction: Probability=$($prediction.no_show_probability), Risk=$($prediction.risk_level)"
}
catch {
    Write-Error "   Failed to get prediction: $_"
}

# 5. Test Gestion Service (Stats)
Write-Host "`n5. Testing Gestion Service (Stats)..."
try {
    $stats = Invoke-RestMethod -Uri "http://localhost:8084/api/gestion/stats" -Method Get -Headers $headers
    Write-Host "   Success! Stats: $($stats | ConvertTo-Json -Depth 1 -Compress)"
}
catch {
    Write-Error "   Failed to get stats: $($_.Exception.Message)"
}

# 6. Test Supervision Service (Health)
Write-Host "`n6. Testing Supervision Service (Health)..."
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8086/api/supervision/health" -Method Get -Headers $headers
    Write-Host "   Success! System Status: $($health.status)"
}
catch {
    Write-Error "   Failed to get health: $($_.Exception.Message)"
}

Write-Host "`n----------------------------------------"
Write-Host "Seed and Test Complete."
Write-Host "----------------------------------------"
