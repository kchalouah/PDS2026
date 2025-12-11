'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import StatCard from '@/components/Dashboard/StatCard';
import { appointmentService, patientService, predictionService } from '@/services/api';

export default function MedecinDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState({
        todayAppointments: 0,
        totalPatients: 0,
        thisWeekConsultations: 0,
        pendingPrescriptions: 0,
    });
    const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userStr = localStorage.getItem('medinsight_user');
        if (userStr) {
            const userData = JSON.parse(userStr);
            setUser(userData);
            loadMedecinData(userData.id);
        }
    }, []);

    const loadMedecinData = async (medecinId: number) => {
        try {
            const [appointments, patients] = await Promise.all([
                appointmentService.getAllAppointments().catch(() => []),
                patientService.getAllPatients().catch(() => []),
            ]);

            setStats({
                todayAppointments: appointments.length || 0,
                totalPatients: patients.length || 0,
                thisWeekConsultations: 0,
                pendingPrescriptions: 0,
            });

            setTodayAppointments(appointments.slice(0, 5));
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
        <ProtectedRoute allowedRoles={['MEDECIN']}>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Espace Médecin</h1>
                                <p className="text-sm text-gray-600">Dr. {user?.username}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    Médecin
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
                            title="RDV Aujourd'hui"
                            value={stats.todayAppointments}
                            icon={
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            }
                            bgColor="bg-blue-100"
                            iconColor="text-blue-600"
                            trend={{ value: '+12%', isPositive: true }}
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
                            title="Consultations Semaine"
                            value={stats.thisWeekConsultations}
                            icon={
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            }
                            bgColor="bg-purple-100"
                            iconColor="text-purple-600"
                        />
                        <StatCard
                            title="Prescriptions en Attente"
                            value={stats.pendingPrescriptions}
                            icon={
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            }
                            bgColor="bg-orange-100"
                            iconColor="text-orange-600"
                        />
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Link
                            href="/medecin/agenda"
                            className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all transform hover:scale-105"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Agenda</h3>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">Gérer votre planning</p>
                        </Link>

                        <Link
                            href="/medecin/patients"
                            className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all transform hover:scale-105"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Patients</h3>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">Liste de vos patients</p>
                        </Link>

                        <Link
                            href="/medecin/prescriptions"
                            className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all transform hover:scale-105"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Prescriptions</h3>
                                <div className="p-3 bg-purple-100 rounded-full">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">Créer des prescriptions</p>
                        </Link>

                        <Link
                            href="/medecin/statistiques"
                            className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all transform hover:scale-105"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Statistiques</h3>
                                <div className="p-3 bg-orange-100 rounded-full">
                                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">Vos performances</p>
                        </Link>
                    </div>

                    {/* Today's Appointments */}
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Rendez-vous d'Aujourd'hui</h2>
                        <div className="space-y-4">
                            {todayAppointments.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-sm text-gray-500">Aucun rendez-vous aujourd'hui</p>
                                </div>
                            ) : (
                                todayAppointments.map((apt, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-2 bg-blue-100 rounded-full">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Patient #{apt.patientId}</p>
                                                <p className="text-xs text-gray-500">{apt.heureDebut} - {apt.motif}</p>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/medecin/dossiers/${apt.patientId}`}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                                        >
                                            Voir Dossier
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Predictions Link */}
                    <Link
                        href="/medecin/predictions"
                        className="block bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-md p-6 text-white hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold mb-2">Prédictions & Analyses</h3>
                                <p className="text-sm opacity-90">Occupation des lits, risques de rechute, et plus</p>
                            </div>
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </Link>
                </main>
            </div>
        </ProtectedRoute>
    );
}
