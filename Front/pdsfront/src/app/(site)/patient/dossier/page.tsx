'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { dossierService } from '@/services/api';

export default function PatientDossierPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [dossier, setDossier] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userStr = localStorage.getItem('medinsight_user');
        if (userStr) {
            const userData = JSON.parse(userStr);
            setUser(userData);
            loadDossier(userData.id);
        }
    }, []);

    const loadDossier = async (userId: number) => {
        try {
            const data = await dossierService.getDossierByPatientId(userId);
            setDossier(data);
        } catch (error) {
            console.error('Erreur lors du chargement du dossier:', error);
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
        <ProtectedRoute allowedRoles={['PATIENT']}>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Mon Dossier Médical</h1>
                                <p className="text-sm text-gray-600">Consultez votre historique médical complet</p>
                            </div>
                            <Link
                                href="/patient/dashboard"
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                ← Retour au Dashboard
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {!dossier ? (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun dossier médical</h3>
                            <p className="mt-1 text-sm text-gray-500">Votre dossier médical sera créé lors de votre première consultation</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Informations Générales */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Informations Générales</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Groupe Sanguin</p>
                                        <p className="text-lg font-semibold text-gray-900">{dossier.groupeSanguin || 'Non renseigné'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Allergies</p>
                                        <p className="text-lg font-semibold text-gray-900">{dossier.allergies || 'Aucune'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Antécédents Médicaux</p>
                                        <p className="text-lg font-semibold text-gray-900">{dossier.antecedents || 'Aucun'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Traitements en Cours</p>
                                        <p className="text-lg font-semibold text-gray-900">{dossier.traitements || 'Aucun'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Historique des Consultations */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Historique des Consultations</h2>
                                <div className="space-y-4">
                                    <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r-lg">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-gray-900">Consultation Générale</p>
                                                <p className="text-sm text-gray-600">Dr. Martin - 15 Nov 2024</p>
                                                <p className="text-sm text-gray-700 mt-2">Examen de routine, tout va bien</p>
                                            </div>
                                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                                Terminée
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Prescriptions */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Prescriptions Récentes</h2>
                                <div className="space-y-3">
                                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-gray-900">Paracétamol 1000mg</p>
                                                <p className="text-sm text-gray-600">3x par jour pendant 5 jours</p>
                                                <p className="text-xs text-gray-500 mt-1">Prescrit le 15 Nov 2024</p>
                                            </div>
                                            <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700">
                                                Télécharger
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Résultats d'Analyses */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Résultats d'Analyses</h2>
                                <div className="space-y-3">
                                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-gray-900">Analyse de Sang Complète</p>
                                                <p className="text-sm text-gray-600">Tous les paramètres sont normaux</p>
                                                <p className="text-xs text-gray-500 mt-1">Date: 10 Nov 2024</p>
                                            </div>
                                            <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                                                Voir Détails
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Documents Médicaux */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Documents Médicaux</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                        <div className="flex items-center space-x-3">
                                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                            <div>
                                                <p className="font-medium text-gray-900">Ordonnance.pdf</p>
                                                <p className="text-xs text-gray-500">15 Nov 2024</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                        <div className="flex items-center space-x-3">
                                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <div>
                                                <p className="font-medium text-gray-900">Résultats_Analyses.pdf</p>
                                                <p className="text-xs text-gray-500">10 Nov 2024</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}
