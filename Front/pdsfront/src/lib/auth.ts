import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Role } from '@/types';

const KEYCLOAK_URL = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8180';
const REALM = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'medinsight';
const CLIENT_ID = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'medinsight-frontend';

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
}

export interface DecodedToken {
    sub: string;
    realm_access: {
        roles: string[];
    };
    name: string;
    preferred_username: string; // Email
    email: string;
}

export const login = async (username: string, password: string): Promise<AuthResponse> => {
    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('grant_type', 'password');
    params.append('username', username);
    params.append('password', password);
    // If public client, no secret needed.

    try {
        const response = await axios.post<AuthResponse>(
            `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`,
            params,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error("Login Error Details:", error.response?.data || error.message);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/auth/login';
};

export const getToken = () => localStorage.getItem('token');

export const getUserRoles = (): Role[] => {
    const token = getToken();
    if (!token) return [];
    try {
        const decoded = jwtDecode<DecodedToken>(token);
        return decoded.realm_access.roles as Role[];
    } catch (e) {
        return [];
    }
};

export const hasRole = (role: Role): boolean => {
    const roles = getUserRoles();
    return roles.includes(role);
}

export const isAuthenticated = (): boolean => {
    return !!getToken();
}
