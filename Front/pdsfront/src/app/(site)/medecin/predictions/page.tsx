'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { predictionService } from '@/services';

export default function MedecinPredictionsPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [predictions, setPredictions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userStr = localStorage.getItem('medinsight_user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
        loadPredictions();
    }, []);

    const loadPredictions = async () => {
        try {
            const data = await predictionService.getAllPredictions();
            setPredictions(data);
        } catch (error) {
            console.error('Erreur lors du chargement des prédictions:', error);
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
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Prédictions & Analyses IA</h1>
                                <p className="text-sm text-gray-600">Analyses prédictives pour optimiser les soins</p>
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
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Occupation des Lits</p>
                                    <p className="text-4xl font-bold mt-2">75%</p>
                                    <p className="text-xs opacity-75 mt-1">↑ 5% vs semaine dernière</p>
                                </div>
                                <svg className="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Risque de Rechute</p>
                                    <p className="text-4xl font-bold mt-2">12%</p>
                                    <p className="text-xs opacity-75 mt-1">↓ 3% vs mois dernier</p>
                                </div>
                                <svg className="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90">Prédictions Actives</p>
                                    <p className="text-4xl font-bold mt-2">{predictions.length}</p>
                                    <p className="text-xs opacity-75 mt-1">Mises à jour en temps réel</p>
                                </div>
                                <svg className="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Prediction Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Occupation Prediction */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Prévision d'Occupation des Lits</h2>
                            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                                <div className="text-center">
                                    <svg className="w-16 h-16 mx-auto text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <p className="text-gray-600">Graphique de prévision</p>
                                    <p className="text-sm text-gray-500 mt-2">Basé sur l'historique des 30 derniers jours</p>
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-xs text-gray-600">Aujourd'hui</p>
                                    <p className="text-lg font-bold text-blue-600">75%</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Demain</p>
                                    <p className="text-lg font-bold text-purple-600">78%</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">+7 jours</p>
                                    <p className="text-lg font-bold text-pink-600">82%</p>
                                </div>
                            </div>
                        </div>

                        {/* Readmission Risk */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Risque de Réadmission</h2>
                            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                                <div className="text-center">
                                    <svg className="w-16 h-16 mx-auto text-purple-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    <p className="text-gray-600">Analyse des tendances</p>
                                    <p className="text-sm text-gray-500 mt-2">Algorithme de machine learning</p>
                                </div>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Risque Faible</span>
                                    <span className="text-sm font-semibold text-green-600">65%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Risque Moyen</span>
                                    <span className="text-sm font-semibold text-yellow-600">23%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Risque Élevé</span>
                                    <span className="text-sm font-semibold text-red-600">12%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Predictions List */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Prédictions Détaillées</h2>
                        <div className="space-y-4">
                            {predictions.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune prédiction disponible</h3>
                                    <p className="mt-1 text-sm text-gray-500">Les prédictions apparaîtront ici une fois générées</p>
                                </div>
                            ) : (
                                predictions.map((prediction) => (
                                    <div key={prediction.id} className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{prediction.type}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{prediction.description}</p>
                                                <p className="text-xs text-gray-500 mt-2">Confiance: {prediction.confidence}%</p>
                                            </div>
                                            <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-medium">
                                                IA
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* AI Insights */}
                    <div className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-start space-x-4">
                            <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <div>
                                <h3 className="text-lg font-bold mb-2">Insights IA du Jour</h3>
                                <ul className="space-y-2 text-sm opacity-90">
                                    <li>✓ Tendance à la hausse des admissions pour maladies respiratoires (+15%)</li>
                                    <li>✓ Optimisation suggérée: Augmenter les créneaux de consultation de 10%</li>
                                    <li>✓ 3 patients nécessitent un suivi prioritaire cette semaine</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
