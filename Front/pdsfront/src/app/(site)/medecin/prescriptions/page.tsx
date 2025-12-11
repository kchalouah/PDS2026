'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { prescriptionService } from '@/services/api';

export default function MedecinPrescriptionsPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        patientId: '',
        medicament: '',
        dosage: '',
        frequence: '',
        duree: '',
        instructions: '',
    });

    useEffect(() => {
        const userStr = localStorage.getItem('medinsight_user');
        if (userStr) {
            const userData = JSON.parse(userStr);
            setUser(userData);
            loadPrescriptions(userData.id);
        }
    }, []);

    const loadPrescriptions = async (medecinId: number) => {
        try {
            const data = await prescriptionService.getAllPrescriptions();
            setPrescriptions(data);
        } catch (error) {
            console.error('Erreur lors du chargement des prescriptions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await prescriptionService.createPrescription({
                ...formData,
                patientId: parseInt(formData.patientId),
                medecinId: user.id,
                dateCreation: new Date().toISOString().split('T')[0],
            });
            setShowModal(false);
            setFormData({
                patientId: '',
                medicament: '',
                dosage: '',
                frequence: '',
                duree: '',
                instructions: '',
            });
            loadPrescriptions(user.id);
        } catch (error) {
            console.error('Erreur lors de la création:', error);
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
                                <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
                                <p className="text-sm text-gray-600">Créer et gérer les prescriptions</p>
                            </div>
                            <div className="flex space-x-4">
                                <Link
                                    href="/medecin/dashboard"
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    ← Retour
                                </Link>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Nouvelle Prescription
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Total Prescriptions</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{prescriptions.length}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Ce Mois</p>
                            <p className="text-3xl font-bold text-purple-600 mt-2">0</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Cette Semaine</p>
                            <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
                        </div>
                    </div>

                    {/* Prescriptions List */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Prescriptions Récentes</h2>
                        <div className="space-y-4">
                            {prescriptions.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune prescription</h3>
                                    <p className="mt-1 text-sm text-gray-500">Commencez par créer une nouvelle prescription</p>
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="mt-4 inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                    >
                                        Créer une prescription
                                    </button>
                                </div>
                            ) : (
                                prescriptions.map((prescription) => (
                                    <div key={prescription.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900">{prescription.medicament}</h3>
                                                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                                                        Prescription #{prescription.id}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-600">Patient</p>
                                                        <p className="font-medium text-gray-900">Patient #{prescription.patientId}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Dosage</p>
                                                        <p className="font-medium text-gray-900">{prescription.dosage}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Fréquence</p>
                                                        <p className="font-medium text-gray-900">{prescription.frequence}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600">Durée</p>
                                                        <p className="font-medium text-gray-900">{prescription.duree}</p>
                                                    </div>
                                                </div>
                                                {prescription.instructions && (
                                                    <p className="mt-2 text-sm text-gray-600 italic">{prescription.instructions}</p>
                                                )}
                                                <p className="mt-2 text-xs text-gray-500">Créée le {prescription.dateCreation}</p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                                                    Imprimer
                                                </button>
                                                <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
                                                    Modifier
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </main>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Nouvelle Prescription</h2>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">ID Patient</label>
                                        <input
                                            type="number"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            value={formData.patientId}
                                            onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Médicament</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Nom du médicament"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            value={formData.medicament}
                                            onChange={(e) => setFormData({ ...formData, medicament: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Dosage</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="ex: 500mg"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                value={formData.dosage}
                                                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Fréquence</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="ex: 3x par jour"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                value={formData.frequence}
                                                onChange={(e) => setFormData({ ...formData, frequence: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Durée</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="ex: 7 jours"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            value={formData.duree}
                                            onChange={(e) => setFormData({ ...formData, duree: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
                                        <textarea
                                            rows={3}
                                            placeholder="Instructions particulières..."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            value={formData.instructions}
                                            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-4 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                        >
                                            Créer la Prescription
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
