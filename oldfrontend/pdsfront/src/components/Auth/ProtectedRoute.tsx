'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('medinsight_token');
        const userStr = localStorage.getItem('medinsight_user');

        if (!token || !userStr) {
            router.push('/connexion');
            return;
        }

        if (allowedRoles && allowedRoles.length > 0) {
            try {
                const user = JSON.parse(userStr);
                if (!allowedRoles.includes(user.role)) {
                    // Rediriger vers le dashboard approprié selon le rôle
                    switch (user.role) {
                        case 'SECURITY_OFFICER':
                            router.push('/securite/dashboard');
                            break;
                        case 'PATIENT':
                            router.push('/patient/dashboard');
                            break;
                        case 'MEDECIN':
                            router.push('/medecin/dashboard');
                            break;
                        case 'MANAGER':
                            router.push('/admin/dashboard');
                            break;
                        default:
                            router.push('/connexion');
                    }
                }
            } catch (error) {
                router.push('/connexion');
            }
        }
    }, [router, allowedRoles]);

    return <>{children}</>;
}
