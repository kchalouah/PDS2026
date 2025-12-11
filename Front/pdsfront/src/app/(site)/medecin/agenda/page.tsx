'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { appointmentService } from '@/services/api';

export default function MedecinAgendaPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'day' | 'week' | 'month'>('day');

    useEffect(() => {
        const userStr = localStorage.getItem('medinsight_user');
        if (userStr) {
            const userData = JSON.parse(userStr);
            setUser(userData);
            loadAppointments(userData.id);
        }
    }, []);

    const loadAppointments = async (medecinId: number) => {
        try {
            const data = await appointmentService.getAllAppointments();
            setAppointments(data);
        } catch (error) {
            console.error('Erreur lors du chargement de l\'agenda:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SCHEDULED':
                return 'border-blue-500 bg-blue-50';
            case 'CONFIRMED':
                return 'border-green-500 bg-green-50';
            case 'COMPLETED':
                return 'border-gray-500 bg-gray-50';
            case 'CANCELLED':
                return 'border-red-500 bg-red-50';
            default:
                return 'border-gray-500 bg-gray-50';
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
                                <h1 className="text-2xl font-bold text-gray-900">Mon Agenda</h1>
                                <p className="text-sm text-gray-600">Gérer vos rendez-vous et disponibilités</p>
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
                    {/* View Selector */}
                    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                        <div className="flex justify-between items-center">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setView('day')}
                                    className={`px-4 py-2 rounded-lg transition-colors ${view === 'day'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Jour
                                </button>
                                <button
                                    onClick={() => setView('week')}
                                    className={`px-4 py-2 rounded-lg transition-colors ${view === 'week'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Semaine
                                </button>
                                <button
                                    onClick={() => setView('month')}
                                    className={`px-4 py-2 rounded-lg transition-colors ${view === 'month'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Mois
                                </button>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <span className="font-medium text-gray-900">Aujourd'hui</span>
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Rendez-vous du jour</h2>

                        {/* Time slots */}
                        <div className="space-y-2">
                            {['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((time) => {
                                const aptAtTime = appointments.find(apt => apt.heureDebut === time);

                                return (
                                    <div key={time} className="flex items-start border-b border-gray-200 pb-2">
                                        <div className="w-20 text-sm font-medium text-gray-600 pt-2">{time}</div>
                                        <div className="flex-1">
                                            {aptAtTime ? (
                                                <div className={`p-3 rounded-lg border-l-4 ${getStatusColor(aptAtTime.status)}`}>
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-medium text-gray-900">Patient #{aptAtTime.patientId}</p>
                                                            <p className="text-sm text-gray-600">{aptAtTime.motif}</p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {aptAtTime.heureDebut} - {aptAtTime.heureFin}
                                                            </p>
                                                        </div>
                                                        <Link
                                                            href={`/medecin/dossiers/${aptAtTime.patientId}`}
                                                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                                        >
                                                            Voir Dossier
                                                        </Link>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-3 text-sm text-gray-400 italic">Disponible</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Upcoming Appointments */}
                    <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Prochains Rendez-vous</h2>
                        <div className="space-y-3">
                            {appointments.slice(0, 5).map((apt) => (
                                <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-blue-100 rounded-full">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Patient #{apt.patientId}</p>
                                            <p className="text-xs text-gray-500">{apt.dateAppointment} à {apt.heureDebut}</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                        {apt.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
