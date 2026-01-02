
import { NextResponse } from 'next/server';
import axios from 'axios';

// Environment variables
const KEYCLOAK_URL = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8180';
const REALM = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'medinsight';
const ADMIN_USERNAME = process.env.KEYCLOAK_MAST_ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.KEYCLOAK_MAST_ADMIN_PASSWORD || 'KeycloakAdmin2024!';
const FRONTEND_CLIENT_ID = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'medinsight-frontend';

async function getAdminToken() {
    const params = new URLSearchParams();
    params.append('client_id', 'admin-cli');
    params.append('username', ADMIN_USERNAME);
    params.append('password', ADMIN_PASSWORD);
    params.append('grant_type', 'password');

    try {
        const { data } = await axios.post(
            `${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`,
            params,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        return data.access_token;
    } catch (e: any) {
        console.error("Failed to get admin token", e.response?.data || e.message);
        throw e;
    }
}

export async function GET(req: Request) {
    try {
        const token = await getAdminToken();

        // 1. Check if client exists
        console.log(`Checking client ${FRONTEND_CLIENT_ID}...`);
        const clientsRes = await axios.get(`${KEYCLOAK_URL}/admin/realms/${REALM}/clients?clientId=${FRONTEND_CLIENT_ID}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        let client = clientsRes.data.find((c: any) => c.clientId === FRONTEND_CLIENT_ID);
        let message = "";

        const clientConfig = {
            clientId: FRONTEND_CLIENT_ID,
            publicClient: true,
            directAccessGrantsEnabled: true,
            standardFlowEnabled: true,
            implicitFlowEnabled: false,
            serviceAccountsEnabled: false,
            redirectUris: ["http://localhost:3000/*"],
            webOrigins: ["http://localhost:3000", "+"],
            rootUrl: "http://localhost:3000",
            baseUrl: "http://localhost:3000"
        };

        if (!client) {
            console.log("Client not found. Creating...");
            await axios.post(`${KEYCLOAK_URL}/admin/realms/${REALM}/clients`, clientConfig, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            message = "Client 'medinsight-frontend' created successfully."
        } else {
            console.log("Client found. Updating configuration...");
            // Update to ensure it is public and has direct access grants
            await axios.put(`${KEYCLOAK_URL}/admin/realms/${REALM}/clients/${client.id}`,
                { ...client, ...clientConfig },
                {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
                }
            );
            message = "Client 'medinsight-frontend' updated successfully (Public=true, DirectGrants=true)."
        }

        return NextResponse.json({ success: true, message });

    } catch (error: any) {
        return NextResponse.json({
            error: error.message,
            details: error.response?.data
        }, { status: 500 });
    }
}
