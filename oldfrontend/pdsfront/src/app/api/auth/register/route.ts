import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();
    const { username, email, password, role } = body;

    const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8180';
    const REALM = 'medinsight';
    const ADMIN_USERNAME = process.env.KEYCLOAK_ADMIN || 'admin';
    const ADMIN_PASSWORD = process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin';

    console.log(`[Register Debug] Attempting registration for ${username} with role ${role}`);

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
                { message: 'Failed to authenticate with identity provider' },
                { status: 500 }
            );
        }

        const adminTokenData = await adminTokenRes.json();
        const adminToken = adminTokenData.access_token;

        // Step 2: Create user in Keycloak
        const newUser = {
            username,
            email,
            enabled: true,
            emailVerified: true,
            credentials: [{
                type: 'password',
                value: password,
                temporary: false
            }]
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
                    { message: 'Username or email already exists' },
                    { status: 409 }
                );
            }

            return NextResponse.json(
                { message: 'Failed to create user' },
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
                { message: 'User created but role assignment failed' },
                { status: 500 }
            );
        }

        const users = await getUserRes.json();
        if (!users || users.length === 0) {
            console.error('[Register Debug] User not found after creation');
            return NextResponse.json(
                { message: 'User created but role assignment failed' },
                { status: 500 }
            );
        }

        const userId = users[0].id;

        // Step 4: Assign role to user
        const roleToAssign = role || 'PATIENT';

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
                message: 'User created successfully',
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

        return NextResponse.json({
            message: 'User registered successfully',
            username,
            email,
            role: roleToAssign
        });

    } catch (error: any) {
        console.error('[Register Debug] Internal Exception:', error);
        return NextResponse.json(
            { message: 'Internal Server Error', error: error.toString() },
            { status: 500 }
        );
    }
}
