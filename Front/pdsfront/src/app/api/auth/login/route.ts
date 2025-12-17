import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();
    const { username, password } = body;

    const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8180';
    const REALM = 'medinsight';
    const CLIENT_ID = 'medinsight-client';

    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('grant_type', 'password');
    params.append('username', username);
    params.append('password', password);

    console.log(`[Login Debug] Attempting login for ${username} at ${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`);

    try {
        const response = await fetch(`${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        });

        // Read text first to handle empty or non-JSON responses
        const text = await response.text();
        console.log(`[Login Debug] Keycloak Response Status: ${response.status}`);
        console.log(`[Login Debug] Keycloak Response Body: "${text}"`);

        let data;
        try {
            data = text ? JSON.parse(text) : {};
        } catch (e) {
            console.error('[Login Debug] JSON Parse Error:', e);
            return NextResponse.json({
                message: 'Invalid response from Identity Provider',
                detail: text
            }, { status: 500 });
        }

        if (!response.ok) {
            console.error('[Login Debug] Keycloak Error Data:', data);
            return NextResponse.json(
                { message: data.error_description || data.errorMessage || 'Invalid credentials' },
                { status: response.status }
            );
        }

        // Fetch User Info to get the UUID (sub)
        const userInfoUrl = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/userinfo`;
        console.log(`[Login Debug] Fetching user info from ${userInfoUrl}`);

        const userInfoRes = await fetch(userInfoUrl, {
            headers: { 'Authorization': `Bearer ${data.access_token}` }
        });

        const userInfoText = await userInfoRes.text();
        if (!userInfoRes.ok) {
            console.error('[Login Debug] User Info Error:', userInfoText);
            // Fallback: if userinfo fails, still return token but with random ID? 
            // Or fail? Better to fail or warn.
            // Let's return token but warn.
            console.warn('Could not fetch user info for ID mapping');
        }

        let userInfo = {};
        try {
            userInfo = userInfoText ? JSON.parse(userInfoText) : {};
        } catch (e) {
            console.error('[Login Debug] UserInfo JSON Parse Error:', e);
        }

        // Convert UUID to Long (Hash)
        let numericId = 0;
        if (userInfo.sub) {
            let hash = 0;
            const uuid = userInfo.sub;
            for (let i = 0; i < uuid.length; i++) {
                const char = uuid.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            numericId = Math.abs(hash);
        }

        return NextResponse.json({
            token: data.access_token,
            refreshToken: data.refresh_token,
            user: {
                username,
                email: userInfo.email,
                id: numericId,
                sub: userInfo.sub
            }
        });

    } catch (error: any) {
        console.error('[Login Debug] Internal Exception:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.toString() }, { status: 500 });
    }
}
