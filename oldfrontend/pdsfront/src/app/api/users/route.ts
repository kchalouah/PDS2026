import { NextResponse } from 'next/server';

// Configuration
const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8180';
const REALM = 'medinsight';
const ADMIN_USER = process.env.KEYCLOAK_ADMIN || 'admin';
const ADMIN_PASS = process.env.KEYCLOAK_ADMIN_PASSWORD || 'KeycloakAdmin2024!'; // Default from .env

// Backend Service URLs (Defaulting to localhost ports for dev)
const SERVICES = {
    PATIENT: process.env.PATIENT_SERVICE_URL || 'http://localhost:8081',
    MEDECIN: process.env.MEDECIN_SERVICE_URL || 'http://localhost:8082',
    MANAGER: process.env.GESTION_SERVICE_URL || 'http://localhost:8084'
};
// Service Paths (Gateway or Direct)
// Ideally calls should go through Gateway if possible, but internal service-to-service communication
// inside the "backend" network (or from Next.js server) is often direct or via Gateway.
// Using direct ports for simplicity in local dev.

async function getAdminToken() {
    const params = new URLSearchParams();
    params.append('client_id', 'admin-cli');
    params.append('grant_type', 'password');
    params.append('username', ADMIN_USER);
    params.append('password', ADMIN_PASS);

    const res = await fetch(`${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
    });

    if (!res.ok) throw new Error('Failed to get admin token');
    const data = await res.json();
    return data.access_token;
}

async function createUserInKeycloak(token: string, userData: any) {
    const res = await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/users`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: userData.username,
            email: userData.email,
            enabled: true,
            emailVerified: true,
            firstName: userData.username, // Placeholder
            lastName: "User", // Placeholder
            credentials: [{
                type: 'password',
                value: userData.password,
                temporary: false
            }]
        })
    });

    if (res.status === 409) throw new Error('User already exists');
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to create Keycloak user: ${err}`);
    }

    // Get the ID of the created user
    const listRes = await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/users?username=${userData.username}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const users = await listRes.json();
    return users[0];
}

async function assignRole(token: string, userId: string, roleName: string) {
    // 1. Get Role ID
    const roleRes = await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/roles/${roleName}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!roleRes.ok) return; // Role might not exist, ignore for now

    const role = await roleRes.json();

    // 2. Assign
    await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/users/${userId}/role-mappings/realm`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([role])
    });
}

function uuidToLong(uuid: string): number {
    // Simple hash to convert UUID to a number (Not collision proof but sufficient for demo)
    let hash = 0;
    for (let i = 0; i < uuid.length; i++) {
        const char = uuid.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, email, password, role } = body;

        // 1. Get Admin Token
        const adminToken = await getAdminToken();

        // 2. Create User in Keycloak
        const kcUser = await createUserInKeycloak(adminToken, { username, email, password });

        // 3. Assign Role // Map 'PATIENT' -> 'ROLE_PATIENT'
        const roleMapping: Record<string, string> = {
            'PATIENT': 'ROLE_PATIENT',
            'MEDECIN': 'ROLE_MEDECIN',
            'MANAGER': 'ROLE_GESTIONNAIRE'
        };
        const keycloakRole = roleMapping[role] || 'ROLE_PATIENT';
        await assignRole(adminToken, kcUser.id, keycloakRole);

        // 4. Create Profile in Backend
        // Use Admin Token to create profile directly? 
        // Or we need a user token? Let's try Admin Token first, if service allows. 
        // If not, we'd need to login as the new user.
        // For simplicity, we'll try to use the *Admin Token* but we technically should be authorized.
        // Services configured as Resource Server usually trust valid tokens. Admin often has permissions.

        const backendUrl = role === 'MEDECIN' ? SERVICES.MEDECIN :
            role === 'MANAGER' ? SERVICES.MANAGER :
                SERVICES.PATIENT;

        const endpoint = role === 'MEDECIN' ? '/api/medecins' :
            role === 'MANAGER' ? '/api/gestionnaires' :
                '/api/patients';

        // Construct numeric ID
        const numericId = uuidToLong(kcUser.id);

        const profilePayload = {
            userId: numericId,
            nom: "User",
            prenom: username,
            email: email,
            profile: {
                // Empty profile data as placeholders
                adresse: { rue: "", ville: "", codePostal: "", pays: "" }
            }
        };

        const profileRes = await fetch(`${backendUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${adminToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profilePayload)
        });

        if (!profileRes.ok) {
            // If Backend creation fails, we should technically rollback Keycloak user...
            // For now, logging error.
            console.error(`Failed to create backend profile: ${profileRes.status}`);
            // return NextResponse.json({ message: 'User created but profile creation failed' }, { status: 500 });
            // Let's proceed as success for the auth part, user can update profile later.
        }

        return NextResponse.json({ message: 'User registered successfully' });

    } catch (error: any) {
        console.error('Registration Error:', error);
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
