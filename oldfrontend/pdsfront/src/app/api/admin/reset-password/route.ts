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

// PUT - Reset user password
export async function PUT(request: NextRequest) {
    try {
        const { userId, newPassword } = await request.json();

        if (!userId || !newPassword) {
            return NextResponse.json(
                { message: 'userId and newPassword are required' },
                { status: 400 }
            );
        }

        const adminToken = await getAdminToken();

        const response = await fetch(
            `${KEYCLOAK_URL}/admin/realms/${REALM}/users/${userId}/reset-password`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify({
                    type: 'password',
                    value: newPassword,
                    temporary: false
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Reset Password Error]:', errorText);
            return NextResponse.json(
                { message: 'Failed to reset password' },
                { status: response.status }
            );
        }

        return NextResponse.json({
            message: 'Password reset successfully'
        });

    } catch (error: any) {
        console.error('[Reset Password Error]:', error);
        return NextResponse.json(
            { message: 'Internal server error', error: error.toString() },
            { status: 500 }
        );
    }
}
