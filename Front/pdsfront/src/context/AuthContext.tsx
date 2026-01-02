'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services';
import { useRouter } from 'next/navigation';

interface User {
    username: string;
    role: string;
    token: string;
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Check for existing session on mount
    useEffect(() => {
        const token = localStorage.getItem('medinsight_token');
        const storedUser = localStorage.getItem('medinsight_user');

        if (token && storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser({ ...userData, token });
            } catch (error) {
                console.error('Failed to parse stored user data:', error);
                localStorage.removeItem('medinsight_token');
                localStorage.removeItem('medinsight_user');
            }
        }

        setIsLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await authService.login({ username, password });

            // Keycloak response format: { token, refreshToken, username, role, user }
            const token = response.token;
            const role = response.role || response.user?.role || "PATIENT";
            const returnedUsername = response.username || response.user?.username || username;

            const userData = {
                username: returnedUsername,
                role: role,
                token: token,
                email: response.user?.email || username,
                id: response.user?.id,
                sub: response.user?.sub
            };

            // Store in localStorage
            localStorage.setItem('medinsight_token', token);
            localStorage.setItem('medinsight_user', JSON.stringify(userData));

            setUser(userData);
        } catch (error: any) {
            console.error('Login failed:', error);
            throw new Error(error.response?.data?.message || error.message || 'Login failed. Please check your credentials.');
        }
    };

    const register = async (userData: any) => {
        try {
            await authService.register(userData);
            // Auto login after register? Or redirect?
            // For now, let caller handle redirect
        } catch (error: any) {
            console.error('Registration failed:', error);
            throw new Error(error.response?.data?.error || 'Registration failed.');
        }
    }

    const logout = () => {
        authService.logout();
        setUser(null);
        router.push('/auth/login');
    };

    const value = {
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
