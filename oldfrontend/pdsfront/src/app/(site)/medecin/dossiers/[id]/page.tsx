'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { dossierService, patientService } from '@/services';

export default function MedecinDossierPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [patient, setPatient] = useState<any>(null);
    const [dossier, setDossier] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('infos');

    useEffect(() => {
        loadPatientData(parseInt(params.id));
    }, [params.id]);

    const loadPatientData = async (patientId: number) => {
        try {
            const [patientData, dossierData] = await Promise.all([
                patientService.getPatientById(patientId),
                dossierService.getDossierByPatientId(patientId).catch(() => null),
            ]);
            setPatient(patientData);
            setDossier(dossierData);
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
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

    if (!patient) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Patient non trouvé</h2>
                    <Link href="/medecin/patients" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
                        ← Retour à la liste
                    </Link>
                </div>
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
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Dossier de {patient.prenom} {patient.nom}
                                </h1>
                                <p className="text-sm text-gray-600">Patient #{patient.id}</p>
                            </div>
                            <Link
                                href="/medecin/patients"
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                ← Retour à la liste
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Patient Info Card */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <div className="flex items-center space-x-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                {patient.prenom?.charAt(0)}{patient.nom?.charAt(0)}
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Date de Naissance</p>
                                    <p className="font-semibold text-gray-900">{patient.dateNaissance}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Sexe</p>
                                    <p className="font-semibold text-gray-900">{patient.sexe === 'M' ? 'Masculin' : 'Féminin'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Téléphone</p>
                                    <p className="font-semibold text-gray-900">{patient.telephone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="font-semibold text-gray-900">{patient.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-xl shadow-md mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-6" aria-label="Tabs">
                                {[
                                    { id: 'infos', label: 'Informations Médicales', icon: '📋' },
                                    { id: 'consultations', label: 'Consultations', icon: '🩺' },
                                    { id: 'prescriptions', label: 'Prescriptions', icon: '💊' },
                                    { id: 'documents', label: 'Documents', icon: '📄' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        {tab.icon} {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="p-6">
                            {activeTab === 'infos' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <h3 className="font-semibold text-gray-900 mb-2">Groupe Sanguin</h3>
                                            <p className="text-2xl font-bold text-blue-600">{dossier?.groupeSanguin || 'Non renseigné'}</p>
                                        </div>
                                        <div className="p-4 bg-green-50 rounded-lg">
                                            <h3 className="font-semibold text-gray-900 mb-2">Allergies</h3>
                                            <p className="text-gray-700">{dossier?.allergies || 'Aucune allergie connue'}</p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-lg">
                                        <h3 className="font-semibold text-gray-900 mb-2">Antécédents Médicaux</h3>
                                        <p className="text-gray-700">{dossier?.antecedents || 'Aucun antécédent'}</p>
                                    </div>
                                    <div className="p-4 bg-yellow-50 rounded-lg">
                                        <h3 className="font-semibold text-gray-900 mb-2">Traitements en Cours</h3>
                                        <p className="text-gray-700">{dossier?.traitements || 'Aucun traitement en cours'}</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'consultations' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Historique des Consultations</h3>
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                            Nouvelle Consultation
                                        </button>
                                    </div>
                                    <div className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r-lg">
                                        <p className="font-semibold text-gray-900">Consultation Générale</p>
                                        <p className="text-sm text-gray-600">15 Nov 2024</p>
                                        <p className="text-sm text-gray-700 mt-2">Examen de routine, patient en bonne santé</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'prescriptions' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Prescriptions</h3>
                                        <Link
                                            href="/medecin/prescriptions"
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                        >
                                            Nouvelle Prescription
                                        </Link>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                        <p className="font-semibold text-gray-900">Paracétamol 1000mg</p>
                                        <p className="text-sm text-gray-600">3x par jour pendant 5 jours</p>
                                        <p className="text-xs text-gray-500 mt-1">Prescrit le 15 Nov 2024</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'documents' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents Médicaux</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
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
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
