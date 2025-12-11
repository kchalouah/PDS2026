'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { auditService } from '@/services/api';

export default function AdminActivitesPage() {
    const router = useRouter();
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({
        userId: '',
        action: '',
        dateFrom: '',
        dateTo: '',
    });

    useEffect(() => {
        loadActivities();
    }, []);

    const loadActivities = async () => {
        try {
            const data = await auditService.getAllAuditLogs();
            setActivities(data);
        } catch (error) {
            console.error('Erreur lors du chargement des activités:', error);
        } finally {
            setLoading(false);
        }
    };

    const getActionColor = (action: string) => {
        if (action?.includes('CREATE')) return 'bg-green-100 text-green-800';
        if (action?.includes('UPDATE')) return 'bg-blue-100 text-blue-800';
        if (action?.includes('DELETE')) return 'bg-red-100 text-red-800';
        if (action?.includes('LOGIN')) return 'bg-purple-100 text-purple-800';
        return 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['MANAGER', 'SECURITY_OFFICER']}>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Journal d'Activités</h1>
                                <p className="text-sm text-gray-600">Historique de toutes les actions utilisateurs</p>
                            </div>
                            <Link
                                href="/admin/dashboard"
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                ← Retour au Dashboard
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtres</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input
                                type="text"
                                placeholder="ID Utilisateur"
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={filter.userId}
                                onChange={(e) => setFilter({ ...filter, userId: e.target.value })}
                            />
                            <select
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={filter.action}
                                onChange={(e) => setFilter({ ...filter, action: e.target.value })}
                            >
                                <option value="">Toutes les actions</option>
                                <option value="CREATE">Création</option>
                                <option value="UPDATE">Modification</option>
                                <option value="DELETE">Suppression</option>
                                <option value="LOGIN">Connexion</option>
                            </select>
                            <input
                                type="date"
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={filter.dateFrom}
                                onChange={(e) => setFilter({ ...filter, dateFrom: e.target.value })}
                            />
                            <input
                                type="date"
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={filter.dateTo}
                                onChange={(e) => setFilter({ ...filter, dateTo: e.target.value })}
                            />
                        </div>
                        <div className="mt-4 flex justify-end space-x-3">
                            <button
                                onClick={() => setFilter({ userId: '', action: '', dateFrom: '', dateTo: '' })}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Réinitialiser
                            </button>
                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                Exporter CSV
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Total Activités</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{activities.length}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Créations</p>
                            <p className="text-3xl font-bold text-green-600 mt-2">
                                {activities.filter(a => a.action?.includes('CREATE')).length}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Modifications</p>
                            <p className="text-3xl font-bold text-blue-600 mt-2">
                                {activities.filter(a => a.action?.includes('UPDATE')).length}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Suppressions</p>
                            <p className="text-3xl font-bold text-red-600 mt-2">
                                {activities.filter(a => a.action?.includes('DELETE')).length}
                            </p>
                        </div>
                    </div>

                    {/* Activities List */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Activités Récentes</h2>
                        <div className="space-y-3">
                            {activities.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">Aucune activité enregistrée</p>
                                </div>
                            ) : (
                                activities.map((activity) => (
                                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-2 bg-blue-100 rounded-full">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    Utilisateur #{activity.userId} - {activity.action}
                                                </p>
                                                <p className="text-xs text-gray-500">{activity.timestamp || 'Date non disponible'}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getActionColor(activity.action)}`}>
                                            {activity.action}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
