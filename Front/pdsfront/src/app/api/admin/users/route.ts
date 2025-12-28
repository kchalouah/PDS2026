import { NextRequest, NextResponse } from 'next/server';

const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8180';
const REALM = 'medinsight';

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

// GET - Fetch all users
export async function GET() {
    try {
        const adminToken = await getAdminToken();

        const response = await fetch(
            `${KEYCLOAK_URL}/admin/realms/${REALM}/users`,
            {
                headers: { 'Authorization': `Bearer ${adminToken}` }
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { message: 'Failed to fetch users' },
                { status: response.status }
            );
        }

        const users = await response.json();

        // Extract roles for each user
        const usersWithRoles = await Promise.all(
            users.map(async (user: any) => {
                try {
                    const rolesRes = await fetch(
                        `${KEYCLOAK_URL}/admin/realms/${REALM}/users/${user.id}/role-mappings/realm`,
                        {
                            headers: { 'Authorization': `Bearer ${adminToken}` }
                        }
                    );

                    if (rolesRes.ok) {
                        const roles = await rolesRes.json();
                        const appRole = roles.find((r: any) =>
                            ['PATIENT', 'MEDECIN', 'ADMIN', 'MANAGER', 'SECURITY_OFFICER'].includes(r.name)
                        );

                        return {
                            id: user.id,
                            sub: user.id,
                            username: user.username,
                            email: user.email,
                            enabled: user.enabled,
                            role: appRole?.name || 'PATIENT',
                            status: user.enabled ? 'ACTIVE' : 'INACTIVE',
                            provider: 'keycloak'
                        };
                    }
                } catch (e) {
                    console.error('Error fetching roles for user:', user.username, e);
                }

                return {
                    id: user.id,
                    sub: user.id,
                    username: user.username,
                    email: user.email,
                    enabled: user.enabled,
                    role: 'PATIENT',
                    status: user.enabled ? 'ACTIVE' : 'INACTIVE',
                    provider: 'keycloak'
                };
            })
        );

        return NextResponse.json(usersWithRoles);

    } catch (error: any) {
        console.error('[Get Users Error]:', error);
        return NextResponse.json(
            { message: 'Internal server error', error: error.toString() },
            { status: 500 }
        );
    }
}

// PUT - Update user
export async function PUT(request: NextRequest) {
    try {
        const { userId, username, email, enabled } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { message: 'userId is required' },
                { status: 400 }
            );
        }

        const adminToken = await getAdminToken();

        const updateData: any = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (typeof enabled === 'boolean') updateData.enabled = enabled;

        const response = await fetch(
            `${KEYCLOAK_URL}/admin/realms/${REALM}/users/${userId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify(updateData),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Update User Error]:', errorText);
            return NextResponse.json(
                { message: 'Failed to update user' },
                { status: response.status }
            );
        }

        return NextResponse.json({
            message: 'User updated successfully'
        });

    } catch (error: any) {
        console.error('[Update User Error]:', error);
        return NextResponse.json(
            { message: 'Internal server error', error: error.toString() },
            { status: 500 }
        );
    }
}

// DELETE - Delete user
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { message: 'userId is required' },
                { status: 400 }
            );
        }

        const adminToken = await getAdminToken();

        const response = await fetch(
            `${KEYCLOAK_URL}/admin/realms/${REALM}/users/${userId}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Delete User Error]:', errorText);
            return NextResponse.json(
                { message: 'Failed to delete user' },
                { status: response.status }
            );
        }

        return NextResponse.json({
            message: 'User deleted successfully'
        });

    } catch (error: any) {
        console.error('[Delete User Error]:', error);
        return NextResponse.json(
            { message: 'Internal server error', error: error.toString() },
            { status: 500 }
        );
    }
}
