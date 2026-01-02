'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services';

interface User {
    username: string;
    role: string;
    token: string;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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
            const response = await authService.login(username, password);
            const { token, username: returnedUsername, role } = response;

            const userData = {
                username: returnedUsername,
                role,
                token,
            };

            // Store in localStorage
            localStorage.setItem('medinsight_token', token);
            localStorage.setItem('medinsight_user', JSON.stringify({ username: returnedUsername, role }));

            setUser(userData);
        } catch (error: any) {
            console.error('Login failed:', error);
            throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    const logout = () => {
        localStorage.removeItem('medinsight_token');
        localStorage.removeItem('medinsight_user');
        setUser(null);
        window.location.href = '/login';
    };

    const value = {
        user,
        login,
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
