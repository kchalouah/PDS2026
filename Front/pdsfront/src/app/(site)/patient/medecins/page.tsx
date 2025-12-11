'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';

export default function PatientMedecinsPage() {
    const router = useRouter();
    const [medecins, setMedecins] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [specialiteFilter, setSpecialiteFilter] = useState('');

    useEffect(() => {
        loadMedecins();
    }, []);

    const loadMedecins = async () => {
        try {
            // Simuler des données de médecins
            setMedecins([
                { id: 1, nom: 'Martin', prenom: 'Dr. Jean', specialite: 'Cardiologie', disponibilite: 'Disponible', telephone: '01 23 45 67 89', email: 'j.martin@medinsight.fr' },
                { id: 2, nom: 'Dubois', prenom: 'Dr. Marie', specialite: 'Pédiatrie', disponibilite: 'Occupé', telephone: '01 23 45 67 90', email: 'm.dubois@medinsight.fr' },
                { id: 3, nom: 'Bernard', prenom: 'Dr. Pierre', specialite: 'Dermatologie', disponibilite: 'Disponible', telephone: '01 23 45 67 91', email: 'p.bernard@medinsight.fr' },
                { id: 4, nom: 'Petit', prenom: 'Dr. Sophie', specialite: 'Ophtalmologie', disponibilite: 'Disponible', telephone: '01 23 45 67 92', email: 's.petit@medinsight.fr' },
                { id: 5, nom: 'Robert', prenom: 'Dr. Luc', specialite: 'Médecine Générale', disponibilite: 'Disponible', telephone: '01 23 45 67 93', email: 'l.robert@medinsight.fr' },
            ]);
        } catch (error) {
            console.error('Erreur lors du chargement des médecins:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredMedecins = medecins.filter(medecin =>
        (medecin.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            medecin.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            medecin.specialite?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (specialiteFilter === '' || medecin.specialite === specialiteFilter)
    );

    const specialites = [...new Set(medecins.map(m => m.specialite))];

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
                                <h1 className="text-2xl font-bold text-gray-900">Trouver un Médecin</h1>
                                <p className="text-sm text-gray-600">Recherchez et prenez rendez-vous avec nos médecins</p>
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
                    {/* Search and Filters */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom ou spécialité..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={specialiteFilter}
                                onChange={(e) => setSpecialiteFilter(e.target.value)}
                            >
                                <option value="">Toutes les spécialités</option>
                                {specialites.map((spec) => (
                                    <option key={spec} value={spec}>{spec}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Medecins Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMedecins.length === 0 ? (
                            <div className="col-span-full bg-white rounded-xl shadow-md p-12 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun médecin trouvé</h3>
                                <p className="mt-1 text-sm text-gray-500">Essayez de modifier vos critères de recherche</p>
                            </div>
                        ) : (
                            filteredMedecins.map((medecin) => (
                                <div key={medecin.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex items-center space-x-4 mb-4">
                                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                                {medecin.prenom.charAt(0)}{medecin.nom.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {medecin.prenom} {medecin.nom}
                                                </h3>
                                                <p className="text-sm text-blue-600 font-medium">{medecin.specialite}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                {medecin.telephone}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                {medecin.email}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mb-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${medecin.disponibilite === 'Disponible'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {medecin.disponibilite}
                                            </span>
                                            <div className="flex items-center text-yellow-500">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="ml-1 text-sm text-gray-600">4.8</span>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/patient/rendez-vous?medecinId=${medecin.id}`}
                                            className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-medium"
                                        >
                                            Prendre Rendez-vous
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
