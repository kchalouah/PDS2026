# Keycloak Setup Script
# Run this after Keycloak starts successfully

Write-Host "Configuring Keycloak Realm..."

$KEYCLOAK_URL = "http://localhost:8180"
$ADMIN_USER = "admin"
$ADMIN_PASS = "KeycloakAdmin2024!"

# Step 1: Get admin token
Write-Host "Getting admin token..."
$tokenParams = @{
    client_id  = "admin-cli"
    grant_type = "password"
    username   = $ADMIN_USER
    password   = $ADMIN_PASS
}

$tokenResponse = Invoke-RestMethod -Uri "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" `
    -Method POST `
    -ContentType "application/x-www-form-urlencoded" `
    -Body $tokenParams

$token = $tokenResponse.access_token

# Step 2: Create realm
Write-Host "Creating medinsight realm..."
$realmConfig = @{
    realm   = "medinsight"
    enabled = $true
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms" `
        -Method POST `
        -Headers @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" } `
        -Body $realmConfig
    Write-Host "Realm created successfully!"
}
catch {
    Write-Host "Realm might already exist, continuing..."
}

# Step 3: Create roles
Write-Host "Creating roles..."
$roles = @("PATIENT", "MEDECIN", "ADMIN", "MANAGER", "SECURITY_OFFICER")

foreach ($role in $roles) {
    $roleConfig = @{
        name        = $role
        description = "$role Role"
    } | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/medinsight/roles" `
            -Method POST `
            -Headers @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" } `
            -Body $roleConfig
        Write-Host "Created role: $role"
    }
    catch {
        Write-Host "Role $role might already exist"
    }
}

# Step 4: Create admin user
Write-Host "Creating admin user..."
$adminUser = @{
    username      = "admin"
    email         = "admin@medinsight.com"
    enabled       = $true
    emailVerified = $true
    credentials   = @(
        @{
            type      = "password"
            value     = "admin"
            temporary = $false
        }
    )
} | ConvertTo-Json -Depth 10

try {
    Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/medinsight/users" `
        -Method POST `
        -Headers @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" } `
        -Body $adminUser
    Write-Host "Admin user created!"
    
    # Get user ID and assign ADMIN role
    $users = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/medinsight/users?username=admin" `
        -Headers @{ Authorization = "Bearer $token" }
    
    if ($users.Count -gt 0) {
        $userId = $users[0].id
        $adminRole = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/medinsight/roles/ADMIN" `
            -Headers @{ Authorization = "Bearer $token" }
        
        $roleMapping = @($adminRole) | ConvertTo-Json
        Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/medinsight/users/$userId/role-mappings/realm" `
            -Method POST `
            -Headers @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" } `
            -Body $roleMapping
        Write-Host "ADMIN role assigned to admin user!"
    }
}
catch {
    Write-Host "Admin user might already exist"
}

# Step 5: Create client
Write-Host "Creating medinsight-client..."
$clientConfig = @{
    clientId                  = "medinsight-client"
    enabled                   = $true
    publicClient              = $true
    directAccessGrantsEnabled = $true
    standardFlowEnabled       = $true
    implicitFlowEnabled       = $false
    rootUrl                   = "http://localhost:3000"
    redirectUris              = @("http://localhost:3000/*", "http://localhost:5173/*")
    webOrigins                = @("*")
} | ConvertTo-Json -Depth 10

try {
    Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/medinsight/clients" `
        -Method POST `
        -Headers @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" } `
        -Body $clientConfig
    Write-Host "Client created successfully!"
}
catch {
    Write-Host "Client might already exist"
}

Write-Host "`nKeycloak configuration complete!"
Write-Host "You can now login with username: admin, password: admin"
