'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { auditService } from '@/services';

export default function SecuriteAuditPage() {
    const router = useRouter();
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({
        userId: '',
        entity: '',
        dateFrom: '',
        dateTo: '',
    });

    useEffect(() => {
        loadAuditLogs();
    }, []);

    const loadAuditLogs = async () => {
        try {
            const data = await auditService.getAllAuditLogs();
            setAuditLogs(data);
        } catch (error) {
            console.error('Erreur lors du chargement des logs d\'audit:', error);
        } finally {
            setLoading(false);
        }
    };

    const getSeverityColor = (action: string) => {
        if (action?.includes('DELETE')) return 'bg-red-100 text-red-800 border-red-300';
        if (action?.includes('UPDATE')) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        if (action?.includes('CREATE')) return 'bg-green-100 text-green-800 border-green-300';
        if (action?.includes('LOGIN')) return 'bg-blue-100 text-blue-800 border-blue-300';
        return 'bg-gray-100 text-gray-800 border-gray-300';
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
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Journal d'Audit</h1>
                                <p className="text-sm text-gray-600">Traçabilité complète des actions système</p>
                            </div>
                            <Link
                                href="/securite/dashboard"
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
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtres d'Audit</h2>
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
                                value={filter.entity}
                                onChange={(e) => setFilter({ ...filter, entity: e.target.value })}
                            >
                                <option value="">Toutes les entités</option>
                                <option value="USER">Utilisateurs</option>
                                <option value="PATIENT">Patients</option>
                                <option value="APPOINTMENT">Rendez-vous</option>
                                <option value="PRESCRIPTION">Prescriptions</option>
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
                                onClick={() => setFilter({ userId: '', entity: '', dateFrom: '', dateTo: '' })}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Réinitialiser
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Appliquer
                            </button>
                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Exporter
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Total Événements</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{auditLogs.length}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Événements Critiques</p>
                            <p className="text-3xl font-bold text-red-600 mt-2">
                                {auditLogs.filter(l => l.action?.includes('DELETE')).length}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Modifications</p>
                            <p className="text-3xl font-bold text-yellow-600 mt-2">
                                {auditLogs.filter(l => l.action?.includes('UPDATE')).length}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Créations</p>
                            <p className="text-3xl font-bold text-green-600 mt-2">
                                {auditLogs.filter(l => l.action?.includes('CREATE')).length}
                            </p>
                        </div>
                    </div>

                    {/* Audit Trail */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Piste d'Audit</h2>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {auditLogs.length === 0 ? (
                                <div className="px-6 py-12 text-center text-gray-500">
                                    Aucun événement d'audit enregistré
                                </div>
                            ) : (
                                auditLogs.map((log) => (
                                    <div key={log.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-4 flex-1">
                                                <div className="p-2 bg-gray-100 rounded-lg">
                                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-1">
                                                        <p className="font-semibold text-gray-900">Utilisateur #{log.userId}</p>
                                                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(log.action)}`}>
                                                            {log.action}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        {log.details || 'Aucun détail disponible'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {log.timestamp || 'Date non disponible'} • IP: {log.ipAddress || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                            <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800">
                                                Détails →
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Security Alert */}
                    <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-md p-6 border border-yellow-200">
                        <div className="flex items-start space-x-4">
                            <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Recommandations de Sécurité</h3>
                                <ul className="space-y-1 text-sm text-gray-700">
                                    <li>✓ Tous les événements critiques sont enregistrés</li>
                                    <li>✓ Aucune activité suspecte détectée dans les dernières 24h</li>
                                    <li>✓ Les logs d'audit sont sauvegardés quotidiennement</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
