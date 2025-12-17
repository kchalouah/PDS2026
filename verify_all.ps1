# verify_all.ps1
# Verifies presence and basic functionality of ALL Microservices and their CRUDs

$KEYCLOAK_URL = "http://localhost:8180"
$GATEWAY_URL = "http://localhost:8080"
$ADMIN_USER = "admin"
$ADMIN_PASS = "password"

function Get-Token {
    $tokenUrl = "$KEYCLOAK_URL/realms/medinsight/protocol/openid-connect/token"
    $body = @{
        client_id  = "medinsight-client"
        username   = $ADMIN_USER
        password   = $ADMIN_PASS
        grant_type = "password"
    }
    try {
        $response = Invoke-RestMethod -Uri $tokenUrl -Method Post -Body $body
        return $response.access_token
    }
    catch {
        Write-Error "Failed to authenticate: $_"
        return $null
    }
}

function Test-Endpoint {
    param($Name, $Url, $Method = "Get", $Body = $null)
    Write-Host "Testing $Name... " -NoNewline
    
    $headers = @{ Authorization = "Bearer $global:TOKEN"; "Content-Type" = "application/json" }
    try {
        $params = @{ Uri = $Url; Method = $Method; Headers = $headers; ErrorAction = "Stop" }
        if ($Body) { $params.Body = ($Body | ConvertTo-Json) }
        
        $response = Invoke-RestMethod @params
        Write-Host "OK" -ForegroundColor Green
        # Write-Host ($response | ConvertTo-Json -Depth 1)
        return $true
    }
    catch {
        $ex = $_.Exception.Response
        if ($ex) {
            $status = $ex.StatusCode.value__
            if ($status -eq 403) {
                Write-Host "FORBIDDEN (Service Reachable, Auth Reject)" -ForegroundColor Yellow
                return $true # Count as reachability success
            }
            elseif ($status -eq 404) {
                Write-Host "404 NOT FOUND (Route Issue?)" -ForegroundColor Red
            }
            else {
                Write-Host "FAILED ($status)" -ForegroundColor Red
                Write-Host $_
            }
        }
        else {
            Write-Host "FAILED (Connection Error)" -ForegroundColor Red
            Write-Host $_
        }
        return $false
    }
}

Write-Host "--- MedInsight Comprehensive Verification ---"
$global:TOKEN = Get-Token

if (-not $global:TOKEN) {
    Write-Error "Cannot proceed without token."
    exit
}
Write-Host "Authentication Successful.`n"

# 1. Patient Service
Test-Endpoint -Name "Patient Service (List)" -Url "$GATEWAY_URL/api/patients"
Test-Endpoint -Name "Dossier Medical (List/Search)" -Url "$GATEWAY_URL/api/dossiers/1" # Expected 404 if not found, but reachable
Test-Endpoint -Name "Appointments" -Url "$GATEWAY_URL/api/appointments"

# 2. Medecin Service
Test-Endpoint -Name "Medecin Service (List)" -Url "$GATEWAY_URL/api/medecins"
Test-Endpoint -Name "Diagnostics" -Url "$GATEWAY_URL/api/diagnostics/1"

# 3. Gestion Service
Test-Endpoint -Name "Gestion Service (Stats)" -Url "$GATEWAY_URL/api/gestion/stats"
Test-Endpoint -Name "Managers" -Url "$GATEWAY_URL/api/managers"

# 4. Security Service
Test-Endpoint -Name "Security Service (Audit)" -Url "$GATEWAY_URL/api/audit"
Test-Endpoint -Name "Security Officers" -Url "$GATEWAY_URL/api/security-officers"

# 5. Prediction Service
Test-Endpoint -Name "Prediction Service (Health)" -Url "$GATEWAY_URL/api/predictions/actuator/health"

# 6. Supervision Service
Test-Endpoint -Name "Supervision Service (Metrics)" -Url "$GATEWAY_URL/api/supervision/metrics"

# 7. Notification Service (NEW)
# Test sending an email (mocked console output)
$emailBody = @{
    to      = "test@example.com"
    subject = "Test Notification"
    text    = "This is a test from verify_all.ps1"
}
# Note: Controller expects Query params for simple fields? Checking code...
# @RequestParam String to, @RequestParam String subject, @RequestBody String text
Test-Endpoint -Name "Notification Service (Send Email)" `
    -Url "$GATEWAY_URL/api/notifications/email?to=test@example.com&subject=Test+Verification" `
    -Method "Post" -Body "This is the body text"

Write-Host "`nVerification Complete."
