'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import StatCard from '@/components/Dashboard/StatCard';
import { userService, patientService, appointmentService } from '@/services';

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPatients: 0,
        totalAppointments: 0,
        totalDoctors: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userStr = localStorage.getItem('medinsight_user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [users, patients, appointments] = await Promise.all([
                userService.getAllUsers().catch(() => []),
                patientService.getAllPatients().catch(() => []),
                appointmentService.getAllAppointments().catch(() => []),
            ]);

            setStats({
                totalUsers: users.length || 0,
                totalPatients: patients.length || 0,
                totalAppointments: appointments.length || 0,
                totalDoctors: 0,
            });
        } catch (error) {
            console.error('Erreur lors du chargement des statistiques:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('medinsight_token');
        localStorage.removeItem('medinsight_user');
        router.push('/connexion');
    };

    const externalTools = [
        {
            name: 'Grafana',
            description: 'Tableaux de bord et métriques',
            url: 'http://localhost:3000',
            icon: '📊',
            color: 'from-orange-500 to-red-500',
        },
        {
            name: 'Keycloak',
            description: 'Gestion d\'authentification',
            url: 'http://localhost:8180',
            icon: '🔐',
            color: 'from-blue-500 to-indigo-500',
        },
        {
            name: 'Prometheus',
            description: 'Monitoring et alertes',
            url: 'http://localhost:9090',
            icon: '🔥',
            color: 'from-red-500 to-pink-500',
        },
        {
            name: 'Swagger UI',
            description: 'Documentation API',
            url: 'http://localhost:8080/swagger-ui.html',
            icon: '📚',
            color: 'from-green-500 to-teal-500',
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['MANAGER', 'SECURITY_OFFICER']}>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Admin</h1>
                                <p className="text-sm text-gray-600">Bienvenue, {user?.username}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                    {user?.role}
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
                            title="Total Patients"
                            value={stats.totalPatients}
                            icon={
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            }
                            bgColor="bg-green-100"
                            iconColor="text-green-600"
                        />
                        <StatCard
                            title="Rendez-vous"
                            value={stats.totalAppointments}
                            icon={
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            }
                            bgColor="bg-purple-100"
                            iconColor="text-purple-600"
                        />
                        <StatCard
                            title="Médecins"
                            value={stats.totalDoctors}
                            icon={
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            }
                            bgColor="bg-orange-100"
                            iconColor="text-orange-600"
                        />
                    </div>

                    {/* External Tools */}
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Outils Externes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {externalTools.map((tool) => (
                                <a
                                    key={tool.name}
                                    href={tool.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-6 bg-gradient-to-br ${tool.color} rounded-xl text-white hover:shadow-lg transition-all transform hover:scale-105`}
                                >
                                    <div className="text-4xl mb-3">{tool.icon}</div>
                                    <h3 className="text-lg font-bold mb-1">{tool.name}</h3>
                                    <p className="text-sm opacity-90">{tool.description}</p>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Actions Rapides</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Link
                                href="/admin/utilisateurs"
                                className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all transform hover:scale-105"
                            >
                                <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span className="font-medium text-gray-900">Gérer Utilisateurs</span>
                            </Link>

                            <Link
                                href="/admin/entites"
                                className="flex items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all transform hover:scale-105"
                            >
                                <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                                </svg>
                                <span className="font-medium text-gray-900">Voir Entités</span>
                            </Link>

                            <Link
                                href="/admin/activites"
                                className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all transform hover:scale-105"
                            >
                                <svg className="w-6 h-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="font-medium text-gray-900">Journal d'Activités</span>
                            </Link>

                            <Link
                                href="/dashboard/appointments"
                                className="flex items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg hover:from-orange-100 hover:to-orange-200 transition-all transform hover:scale-105"
                            >
                                <svg className="w-6 h-6 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="font-medium text-gray-900">Rendez-vous</span>
                            </Link>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Activité Récente</h2>
                        <div className="space-y-4">
                            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">Aucune activité récente</p>
                                    <p className="text-xs text-gray-500">Les activités du système apparaîtront ici</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
