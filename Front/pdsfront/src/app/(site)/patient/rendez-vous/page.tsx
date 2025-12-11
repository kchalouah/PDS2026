'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { appointmentService, patientService } from '@/services/api';

export default function PatientRendezVousPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        dateAppointment: '',
        heureDebut: '',
        heureFin: '',
        motif: '',
        medecinId: '',
    });

    useEffect(() => {
        const userStr = localStorage.getItem('medinsight_user');
        if (userStr) {
            const userData = JSON.parse(userStr);
            setUser(userData);
            loadAppointments(userData.id);
        }
    }, []);

    const loadAppointments = async (userId: number) => {
        try {
            const data = await appointmentService.getAllAppointments();
            setAppointments(data);
        } catch (error) {
            console.error('Erreur lors du chargement des rendez-vous:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await appointmentService.createAppointment({
                ...formData,
                patientId: user.id,
                medecinId: parseInt(formData.medecinId),
                status: 'SCHEDULED',
            });
            setShowModal(false);
            setFormData({
                dateAppointment: '',
                heureDebut: '',
                heureFin: '',
                motif: '',
                medecinId: '',
            });
            loadAppointments(user.id);
        } catch (error) {
            console.error('Erreur lors de la création du rendez-vous:', error);
        }
    };

    const handleCancel = async (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
            try {
                await appointmentService.updateAppointmentStatus(id, 'CANCELLED');
                loadAppointments(user.id);
            } catch (error) {
                console.error('Erreur lors de l\'annulation:', error);
            }
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SCHEDULED':
                return 'bg-blue-100 text-blue-800';
            case 'CONFIRMED':
                return 'bg-green-100 text-green-800';
            case 'COMPLETED':
                return 'bg-gray-100 text-gray-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'SCHEDULED':
                return 'Programmé';
            case 'CONFIRMED':
                return 'Confirmé';
            case 'COMPLETED':
                return 'Terminé';
            case 'CANCELLED':
                return 'Annulé';
            default:
                return status;
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
                                <h1 className="text-2xl font-bold text-gray-900">Mes Rendez-vous</h1>
                                <p className="text-sm text-gray-600">Gérer vos consultations médicales</p>
                            </div>
                            <div className="flex space-x-4">
                                <Link
                                    href="/patient/dashboard"
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    ← Retour
                                </Link>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Nouveau Rendez-vous
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Appointments Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {appointments.length === 0 ? (
                            <div className="col-span-full bg-white rounded-xl shadow-md p-12 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun rendez-vous</h3>
                                <p className="mt-1 text-sm text-gray-500">Commencez par prendre un rendez-vous avec un médecin.</p>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Prendre un rendez-vous
                                </button>
                            </div>
                        ) : (
                            appointments.map((apt) => (
                                <div key={apt.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Consultation</h3>
                                            <p className="text-sm text-gray-500">RDV #{apt.id}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                                            {getStatusLabel(apt.status)}
                                        </span>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {apt.dateAppointment}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {apt.heureDebut} - {apt.heureFin}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Dr. Médecin #{apt.medecinId}
                                        </div>
                                        <div className="flex items-start text-sm text-gray-600">
                                            <svg className="w-4 h-4 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span className="flex-1">{apt.motif}</span>
                                        </div>
                                    </div>

                                    {apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
                                        <button
                                            onClick={() => handleCancel(apt.id)}
                                            className="w-full px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                                        >
                                            Annuler le rendez-vous
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </main>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Nouveau Rendez-vous</h2>
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
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                        <input
                                            type="date"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={formData.dateAppointment}
                                            onChange={(e) => setFormData({ ...formData, dateAppointment: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Heure de début</label>
                                            <input
                                                type="time"
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                value={formData.heureDebut}
                                                onChange={(e) => setFormData({ ...formData, heureDebut: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Heure de fin</label>
                                            <input
                                                type="time"
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                value={formData.heureFin}
                                                onChange={(e) => setFormData({ ...formData, heureFin: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Médecin</label>
                                        <input
                                            type="number"
                                            required
                                            placeholder="ID du médecin"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={formData.medecinId}
                                            onChange={(e) => setFormData({ ...formData, medecinId: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Motif de consultation</label>
                                        <textarea
                                            required
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={formData.motif}
                                            onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                                            placeholder="Décrivez le motif de votre consultation..."
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
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Confirmer le rendez-vous
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
