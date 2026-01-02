import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();

    // Extract all fields from the registration form
    const {
        username,
        nom,
        prenom,
        email,
        password,
        dateNaissance,
        gender,
        telephone,
        emergencyContact,
        rue,
        ville,
        codePostal,
        pays
    } = body;

    const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8180';
    const REALM = 'medinsight';
    const ADMIN_USERNAME = process.env.KEYCLOAK_ADMIN || 'admin';
    const ADMIN_PASSWORD = process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin';

    console.log(`[Register Debug] Attempting registration for ${username} (${email})`);

    try {
        // Step 1: Get admin access token
        const adminParams = new URLSearchParams();
        adminParams.append('client_id', 'admin-cli');
        adminParams.append('grant_type', 'password');
        adminParams.append('username', ADMIN_USERNAME);
        adminParams.append('password', ADMIN_PASSWORD);

        const adminTokenRes = await fetch(`${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: adminParams.toString(),
        });

        if (!adminTokenRes.ok) {
            const errorText = await adminTokenRes.text();
            console.error('[Register Debug] Admin token error:', errorText);
            return NextResponse.json(
                { error: 'Failed to authenticate with identity provider' },
                { status: 500 }
            );
        }

        const adminTokenData = await adminTokenRes.json();
        const adminToken = adminTokenData.access_token;

        // Step 2: Create user in Keycloak
        const newUser = {
            username,
            email,
            firstName: prenom,
            lastName: nom,
            enabled: true,
            emailVerified: true,
            credentials: [{
                type: 'password',
                value: password,
                temporary: false
            }],
            attributes: {
                dateNaissance: [dateNaissance],
                gender: [gender],
                telephone: [telephone],
                emergencyContact: [emergencyContact],
                rue: [rue],
                ville: [ville],
                codePostal: [codePostal],
                pays: [pays]
            }
        };

        const createUserRes = await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify(newUser),
        });

        if (!createUserRes.ok) {
            const errorText = await createUserRes.text();
            console.error('[Register Debug] Create user error:', errorText);

            // Check if user already exists
            if (createUserRes.status === 409) {
                return NextResponse.json(
                    { error: 'Un utilisateur avec cet email existe déjà' },
                    { status: 409 }
                );
            }

            return NextResponse.json(
                { error: 'Échec de création du compte' },
                { status: createUserRes.status }
            );
        }

        // Step 3: Get the created user's ID
        const getUserRes = await fetch(
            `${KEYCLOAK_URL}/admin/realms/${REALM}/users?username=${encodeURIComponent(username)}`,
            {
                headers: { 'Authorization': `Bearer ${adminToken}` }
            }
        );

        if (!getUserRes.ok) {
            console.error('[Register Debug] Failed to fetch created user');
            return NextResponse.json(
                { error: 'Utilisateur créé mais attribution du rôle échouée' },
                { status: 500 }
            );
        }

        const users = await getUserRes.json();
        if (!users || users.length === 0) {
            console.error('[Register Debug] User not found after creation');
            return NextResponse.json(
                { error: 'Utilisateur créé mais attribution du rôle échouée' },
                { status: 500 }
            );
        }

        const userId = users[0].id;

        // Step 4: Assign PATIENT role to user (default role for registration)
        const roleToAssign = 'PATIENT';

        // Get the role ID from Keycloak
        const getRoleRes = await fetch(
            `${KEYCLOAK_URL}/admin/realms/${REALM}/roles/${roleToAssign}`,
            {
                headers: { 'Authorization': `Bearer ${adminToken}` }
            }
        );

        if (!getRoleRes.ok) {
            console.warn(`[Register Debug] Role ${roleToAssign} not found, user created without role`);
            return NextResponse.json({
                success: true,
                message: 'Compte créé avec succès',
                username,
                email
            });
        }

        const roleData = await getRoleRes.json();

        // Assign the role
        const assignRoleRes = await fetch(
            `${KEYCLOAK_URL}/admin/realms/${REALM}/users/${userId}/role-mappings/realm`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify([roleData]),
            }
        );

        if (!assignRoleRes.ok) {
            const errorText = await assignRoleRes.text();
            console.error('[Register Debug] Role assignment error:', errorText);
        }

        console.log(`[Register Debug] User ${username} created successfully with role ${roleToAssign}`);

        // Step 5: Create patient record in backend (call patient-service)
        try {
            const patientServiceUrl = process.env.PATIENT_SERVICE_URL || 'http://localhost:8081';
            const patientPayload = {
                nom,
                prenom,
                email,
                dateNaissance,
                gender,
                telephone,
                emergencyContact,
                adresse: {
                    rue,
                    ville,
                    codePostal,
                    pays
                },
                // Store Keycloak user ID for future reference
                keycloakUserId: userId
            };

            const patientRes = await fetch(`${patientServiceUrl}/api/patients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(patientPayload)
            });

            if (!patientRes.ok) {
                console.error('[Register Debug] Failed to create patient record in backend');
                // Don't fail the registration, just log the error
            } else {
                console.log('[Register Debug] Patient record created in backend');
            }
        } catch (err) {
            console.error('[Register Debug] Error creating patient record:', err);
            // Don't fail the registration
        }

        return NextResponse.json({
            success: true,
            message: 'Compte créé avec succès',
            username,
            email,
            role: roleToAssign
        });

    } catch (error: any) {
        console.error('[Register Debug] Internal Exception:', error);
        return NextResponse.json(
            { error: 'Erreur interne du serveur', details: error.toString() },
            { status: 500 }
        );
    }
}
