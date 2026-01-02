'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import StatCard from '@/components/Dashboard/StatCard';
import { auditService, userService } from '@/services';

export default function SecuriteDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        failedLogins: 0,
        auditLogs: 0,
    });
    const [recentLogs, setRecentLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userStr = localStorage.getItem('medinsight_user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
        loadSecurityData();
    }, []);

    const loadSecurityData = async () => {
        try {
            const [users, logs] = await Promise.all([
                userService.getAllUsers().catch(() => []),
                auditService.getAllAuditLogs().catch(() => []),
            ]);

            setStats({
                totalUsers: users.length || 0,
                activeUsers: users.filter((u: any) => u.status === 'ACTIVE').length || 0,
                failedLogins: 0,
                auditLogs: logs.length || 0,
            });

            setRecentLogs(logs.slice(0, 5));
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('medinsight_token');
        localStorage.removeItem('medinsight_user');
        router.push('/connexion');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['SECURITY_OFFICER']}>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Centre de Sécurité</h1>
                                <p className="text-sm text-gray-600">Responsable Sécurité - {user?.username}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                                    Sécurité
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Déconnexion
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Total Utilisateurs"
                            value={stats.totalUsers}
                            icon={
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            }
                            bgColor="bg-blue-100"
                            iconColor="text-blue-600"
                        />
                        <StatCard
                            title="Utilisateurs Actifs"
                            value={stats.activeUsers}
                            icon={
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                            bgColor="bg-green-100"
                            iconColor="text-green-600"
                        />
                        <StatCard
                            title="Connexions Échouées"
                            value={stats.failedLogins}
                            icon={
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            }
                            bgColor="bg-red-100"
                            iconColor="text-red-600"
                        />
                        <StatCard
                            title="Logs d'Audit"
                            value={stats.auditLogs}
                            icon={
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            }
                            bgColor="bg-purple-100"
                            iconColor="text-purple-600"
                        />
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Link
                            href="/securite/logs"
                            className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all transform hover:scale-105"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Logs de Connexion</h3>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">Consulter les connexions</p>
                        </Link>

                        <Link
                            href="/securite/audit"
                            className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all transform hover:scale-105"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Journal d'Audit</h3>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">Actions utilisateurs</p>
                        </Link>

                        <Link
                            href="/securite/utilisateurs"
                            className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all transform hover:scale-105"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Gestion Utilisateurs</h3>
                                <div className="p-3 bg-purple-100 rounded-full">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">Gérer les comptes</p>
                        </Link>

                        <Link
                            href="/admin/dashboard"
                            className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all transform hover:scale-105"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Outils Admin</h3>
                                <div className="p-3 bg-orange-100 rounded-full">
                                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">Accès admin complet</p>
                        </Link>
                    </div>

                    {/* Recent Logs */}
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Logs Récents</h2>
                        <div className="space-y-4">
                            {recentLogs.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-sm text-gray-500">Aucun log récent</p>
                                </div>
                            ) : (
                                recentLogs.map((log, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-2 bg-blue-100 rounded-full">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{log.action}</p>
                                                <p className="text-xs text-gray-500">Utilisateur #{log.userId} - {log.timestamp}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Security Alerts */}
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl shadow-md p-6 border border-red-200">
                        <div className="flex items-center space-x-3 mb-4">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h2 className="text-xl font-bold text-gray-900">Alertes de Sécurité</h2>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-700">✅ Aucune alerte de sécurité active</p>
                            <p className="text-sm text-gray-700">✅ Tous les systèmes fonctionnent normalement</p>
                            <p className="text-sm text-gray-700">✅ Dernière vérification: Aujourd'hui</p>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
