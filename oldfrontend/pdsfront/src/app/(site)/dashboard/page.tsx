'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkRedirect = () => {
            const token = localStorage.getItem('medinsight_token');
            const userStr = localStorage.getItem('medinsight_user');

            if (!token || !userStr) {
                router.replace('/login');
                return;
            }

            try {
                const user = JSON.parse(userStr);
                const role = user.role;

                if (role === 'PATIENT') {
                    router.replace('/patient/dashboard');
                } else if (role === 'MEDECIN') {
                    router.replace('/medecin/dashboard');
                } else if (role === 'ADMIN') {
                    router.replace('/admin/dashboard');
                } else if (role === 'MANAGER') {
                    router.replace('/manager/dashboard');
                } else if (role === 'RESPONSABLE_SECURITE' || role === 'SECURITY_OFFICER') {
                    router.replace('/security/dashboard');
                } else {
                    // Fallback or unknown role
                    console.warn('Unknown role:', role);
                    setChecking(false);
                }
            } catch (e) {
                console.error("Error parsing user data", e);
                router.replace('/login');
            }
        };

        checkRedirect();
    }, [router]);

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                <p className="text-gray-600">Your account does not have a recognized role for this dashboard.</p>
                <button
                    onClick={() => router.push('/')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Return Home
                </button>
            </div>
        </div>
    );
}
