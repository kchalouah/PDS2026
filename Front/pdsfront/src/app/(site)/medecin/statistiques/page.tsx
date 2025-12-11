'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import StatCard from '@/components/Dashboard/StatCard';

export default function MedecinStatistiquesPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalConsultations: 0,
        thisMonth: 0,
        avgPerDay: 0,
        satisfaction: 0,
    });

    useEffect(() => {
        const userStr = localStorage.getItem('medinsight_user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            // Simuler le chargement des statistiques
            setStats({
                totalConsultations: 245,
                thisMonth: 42,
                avgPerDay: 8,
                satisfaction: 95,
            });
        } catch (error) {
            console.error('Erreur lors du chargement des statistiques:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['MEDECIN']}>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Mes Statistiques</h1>
                                <p className="text-sm text-gray-600">Analyse de vos performances</p>
                            </div>
                            <Link
                                href="/medecin/dashboard"
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                ← Retour au Dashboard
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Total Consultations"
                            value={stats.totalConsultations}
                            icon={
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            }
                            bgColor="bg-blue-100"
                            iconColor="text-blue-600"
                            trend={{ value: '+12%', isPositive: true }}
                        />
                        <StatCard
                            title="Ce Mois"
                            value={stats.thisMonth}
                            icon={
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            }
                            bgColor="bg-green-100"
                            iconColor="text-green-600"
                            trend={{ value: '+8%', isPositive: true }}
                        />
                        <StatCard
                            title="Moyenne/Jour"
                            value={stats.avgPerDay}
                            icon={
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            }
                            bgColor="bg-purple-100"
                            iconColor="text-purple-600"
                        />
                        <StatCard
                            title="Satisfaction"
                            value={`${stats.satisfaction}%`}
                            icon={
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                            bgColor="bg-yellow-100"
                            iconColor="text-yellow-600"
                            trend={{ value: '+2%', isPositive: true }}
                        />
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Consultations Chart */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Évolution des Consultations</h2>
                            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                                <div className="text-center">
                                    <svg className="w-16 h-16 mx-auto text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <p className="text-gray-600">Graphique des consultations</p>
                                    <p className="text-sm text-gray-500 mt-2">Sur les 12 derniers mois</p>
                                </div>
                            </div>
                        </div>

                        {/* Satisfaction Chart */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Taux de Satisfaction</h2>
                            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                                <div className="text-center">
                                    <div className="relative inline-block">
                                        <svg className="w-32 h-32" viewBox="0 0 100 100">
                                            <circle
                                                className="text-gray-200"
                                                strokeWidth="10"
                                                stroke="currentColor"
                                                fill="transparent"
                                                r="40"
                                                cx="50"
                                                cy="50"
                                            />
                                            <circle
                                                className="text-green-600"
                                                strokeWidth="10"
                                                strokeDasharray={`${stats.satisfaction * 2.51}, 251`}
                                                strokeLinecap="round"
                                                stroke="currentColor"
                                                fill="transparent"
                                                r="40"
                                                cx="50"
                                                cy="50"
                                                transform="rotate(-90 50 50)"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-3xl font-bold text-green-600">{stats.satisfaction}%</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-4">Basé sur les retours patients</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Métriques de Performance</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-gray-600">Temps Moyen/Consultation</p>
                                <p className="text-3xl font-bold text-blue-600 mt-2">25 min</p>
                                <p className="text-xs text-gray-500 mt-1">Optimal: 20-30 min</p>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <p className="text-sm text-gray-600">Taux de Suivi</p>
                                <p className="text-3xl font-bold text-green-600 mt-2">88%</p>
                                <p className="text-xs text-gray-500 mt-1">Excellent</p>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <p className="text-sm text-gray-600">Prescriptions/Jour</p>
                                <p className="text-3xl font-bold text-purple-600 mt-2">6.5</p>
                                <p className="text-xs text-gray-500 mt-1">Moyenne nationale: 5.2</p>
                            </div>
                        </div>
                    </div>

                    {/* Top Pathologies */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Top Pathologies Traitées</h2>
                        <div className="space-y-3">
                            {[
                                { name: 'Infections Respiratoires', count: 45, color: 'bg-blue-500' },
                                { name: 'Troubles Digestifs', count: 32, color: 'bg-green-500' },
                                { name: 'Douleurs Musculaires', count: 28, color: 'bg-purple-500' },
                                { name: 'Allergies', count: 21, color: 'bg-yellow-500' },
                                { name: 'Autres', count: 19, color: 'bg-gray-500' },
                            ].map((pathology, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700">{pathology.name}</span>
                                            <span className="text-sm text-gray-600">{pathology.count} cas</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`${pathology.color} h-2 rounded-full`}
                                                style={{ width: `${(pathology.count / 45) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
