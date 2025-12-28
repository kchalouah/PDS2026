import { NextRequest, NextResponse } from 'next/server';

const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8180';
const REALM = 'medinsight';

// Helper function to get admin token
async function getAdminToken() {
    const ADMIN_USERNAME = process.env.KEYCLOAK_ADMIN || 'admin';
    const ADMIN_PASSWORD = process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin';

    const params = new URLSearchParams();
    params.append('client_id', 'admin-cli');
    params.append('grant_type', 'password');
    params.append('username', ADMIN_USERNAME);
    params.append('password', ADMIN_PASSWORD);

    const response = await fetch(`${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
    });

    if (!response.ok) {
        throw new Error('Failed to get admin token');
    }

    const data = await response.json();
    return data.access_token;
}

export async function POST(request: NextRequest) {
    try {
        const { userId, newRole } = await request.json();

        if (!userId || !newRole) {
            return NextResponse.json(
                { message: 'userId and newRole are required' },
                { status: 400 }
            );
        }

        const adminToken = await getAdminToken();

        // Get current user's roles
        const currentRolesRes = await fetch(
            `${KEYCLOAK_URL}/admin/realms/${REALM}/users/${userId}/role-mappings/realm`,
            {
                headers: { 'Authorization': `Bearer ${adminToken}` }
            }
        );

        if (!currentRolesRes.ok) {
            return NextResponse.json(
                { message: 'Failed to fetch current roles' },
                { status: 500 }
            );
        }

        const currentRoles = await currentRolesRes.json();

        // Remove all current application roles
        const rolesToRemove = currentRoles.filter((role: any) =>
            ['PATIENT', 'MEDECIN', 'ADMIN', 'MANAGER', 'SECURITY_OFFICER'].includes(role.name)
        );

        if (rolesToRemove.length > 0) {
            await fetch(
                `${KEYCLOAK_URL}/admin/realms/${REALM}/users/${userId}/role-mappings/realm`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${adminToken}`
                    },
                    body: JSON.stringify(rolesToRemove),
                }
            );
        }

        // Get the new role object
        const newRoleRes = await fetch(
            `${KEYCLOAK_URL}/admin/realms/${REALM}/roles/${newRole}`,
            {
                headers: { 'Authorization': `Bearer ${adminToken}` }
            }
        );

        if (!newRoleRes.ok) {
            return NextResponse.json(
                { message: `Role ${newRole} not found` },
                { status: 404 }
            );
        }

        const roleData = await newRoleRes.json();

        // Assign the new role
        const assignRes = await fetch(
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

        if (!assignRes.ok) {
            return NextResponse.json(
                { message: 'Failed to assign new role' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: 'Role updated successfully',
            newRole
        });

    } catch (error: any) {
        console.error('[Change Role Error]:', error);
        return NextResponse.json(
            { message: 'Internal server error', error: error.toString() },
            { status: 500 }
        );
    }
}
