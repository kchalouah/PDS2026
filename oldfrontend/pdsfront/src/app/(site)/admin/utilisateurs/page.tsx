'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { userService } from '@/services';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminUtilisateursPage() {
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await fetch('/api/admin/users');
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Erreur lors du chargement des utilisateurs:', error);
            toast.error('Erreur lors du chargement des utilisateurs');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, username: string, newRole: string) => {
        try {
            const response = await fetch('/api/admin/change-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, newRole })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to change role');
            }

            toast.success(`Rôle de ${username} changé en ${newRole}`);
            loadUsers(); // Reload users to show updated role
        } catch (error: any) {
            console.error('Error changing role:', error);
            toast.error(error.message || 'Erreur lors du changement de rôle');
        }
    };

    const handleDeleteUser = async (userId: string, username: string) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${username} ?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/users?userId=${userId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete user');
            }

            toast.success(`Utilisateur ${username} supprimé`);
            loadUsers();
        } catch (error: any) {
            console.error('Error deleting user:', error);
            toast.error(error.message || 'Erreur lors de la suppression');
        }
    };

    const handleUpdateUser = async (userData: any) => {
        try {
            const response = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update user');
            }

            toast.success('Utilisateur mis à jour');
            setShowModal(false);
            setSelectedUser(null);
            loadUsers();
        } catch (error: any) {
            console.error('Error updating user:', error);
            toast.error(error.message || 'Erreur lors de la mise à jour');
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'SECURITY_OFFICER':
                return 'bg-red-100 text-red-800';
            case 'MEDECIN':
                return 'bg-blue-100 text-blue-800';
            case 'PATIENT':
                return 'bg-green-100 text-green-800';
            case 'MANAGER':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-800';
            case 'INACTIVE':
                return 'bg-gray-100 text-gray-800';
            case 'SUSPENDED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
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
        <ProtectedRoute allowedRoles={['MANAGER', 'SECURITY_OFFICER']}>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
                                <p className="text-sm text-gray-600">Gérer tous les comptes utilisateurs</p>
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
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Total Utilisateurs</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{users.length}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Actifs</p>
                            <p className="text-3xl font-bold text-green-600 mt-2">
                                {users.filter(u => u.status === 'ACTIVE').length}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Médecins</p>
                            <p className="text-3xl font-bold text-blue-600 mt-2">
                                {users.filter(u => u.role === 'MEDECIN').length}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Patients</p>
                            <p className="text-3xl font-bold text-purple-600 mt-2">
                                {users.filter(u => u.role === 'PATIENT').length}
                            </p>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-900">Liste des Utilisateurs</h2>
                                <div className="flex space-x-3">
                                    <input
                                        type="text"
                                        placeholder="Rechercher..."
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="">Tous les rôles</option>
                                        <option value="PATIENT">Patient</option>
                                        <option value="MEDECIN">Médecin</option>
                                        <option value="MANAGER">Manager</option>
                                        <option value="SECURITY_OFFICER">Sécurité</option>
                                    </select>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedUser(null);
                                        setShowModal(true);
                                    }}
                                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Ajouter un utilisateur
                                </button>
                            </div>
                        </div>

                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.sub || user.id, user.username, e.target.value)}
                                                className={`px-2 py-1 text-xs font-semibold rounded border-0 cursor-pointer ${getRoleBadgeColor(user.role)}`}
                                            >
                                                <option value="PATIENT">PATIENT</option>
                                                <option value="MEDECIN">MEDECIN</option>
                                                <option value="ADMIN">ADMIN</option>
                                                <option value="MANAGER">MANAGER</option>
                                                <option value="SECURITY_OFFICER">SECURITY_OFFICER</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.provider}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(user.status)}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
                                                        try {
                                                            // Dynamically call delete service based on role
                                                            const { medecinService, patientService, gestionService, securityService } = require('@/services/api');
                                                            if (user.role === 'MEDECIN') await medecinService.deleteMedecin(user.id);
                                                            else if (user.role === 'PATIENT') await patientService.deletePatient(user.id);
                                                            else if (user.role === 'MANAGER') await gestionService.deleteManager(user.id);
                                                            else if (user.role === 'SECURITY_OFFICER') await securityService.deleteOfficer(user.id);

                                                            loadUsers();
                                                        } catch (e) {
                                                            alert('Erreur lors de la suppression');
                                                        }
                                                    }
                                                }}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>

            {/* User Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowModal(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <UserFormModal
                                onClose={() => setShowModal(false)}
                                onSuccess={() => {
                                    setShowModal(false);
                                    loadUsers();
                                }}
                                userToEdit={selectedUser}
                            />
                        </div>
                    </div>
                </div>
            )}
        </ProtectedRoute>
    );
}

// Sub-component for the Form (usually strictly in separate file but inline for now for context)
function UserFormModal({ onClose, onSuccess, userToEdit }: { onClose: () => void, onSuccess: () => void, userToEdit: any }) {
    const [role, setRole] = useState(userToEdit?.role || 'PATIENT');
    const [formData, setFormData] = useState({
        username: userToEdit?.username || '',
        email: userToEdit?.email || '',
        password: '',
        nom: userToEdit?.nom || '',
        prenom: userToEdit?.prenom || '',
        // Medecin specific
        specialite: userToEdit?.specialite || '',
        hospitalName: userToEdit?.hospitalName || '',
        // Manager specific
        department: userToEdit?.department || '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Determine service based on role
            // NOTE: In a real scenario, we might need separate "Create User" endpoints for purely Auth, 
            // but here we are creating Entities which create Auth users implicitly (Microservice pattern).
            const payload = { ...formData, role };

            // TODO: Call specific service based on role
            // Example:
            // if (role === 'MEDECIN') await medecinService.createMedecin(payload);
            // else if (role === 'PATIENT') await patientService.createPatient(payload);
            // etc.

            // For now, logging payload to simulate
            console.log('Creating user:', payload);

            // We need to import services inside or passing them. 
            // Assuming services are imported at top of file.
            const { medecinService, patientService, gestionService, securityService } = require('@/services/api');

            if (role === 'MEDECIN') {
                await medecinService.createMedecin(payload);
            } else if (role === 'PATIENT') {
                await patientService.createPatient(payload);
            } else if (role === 'MANAGER') {
                await gestionService.createManager(payload);
            } else if (role === 'SECURITY_OFFICER') {
                await securityService.createOfficer(payload);
            }

            onSuccess();
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Erreur lors de la création de l\'utilisateur');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                {userToEdit ? 'Modifier Utilisateur' : 'Nouvel Utilisateur'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                {!userToEdit && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Rôle</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="PATIENT">Patient</option>
                            <option value="MEDECIN">Médecin</option>
                            <option value="MANAGER">Manager</option>
                            <option value="SECURITY_OFFICER">Agent de Sécurité</option>
                        </select>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nom</label>
                        <input
                            type="text"
                            required
                            value={formData.nom}
                            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Prénom</label>
                        <input
                            type="text"
                            required
                            value={formData.prenom}
                            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                {!userToEdit && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                )}

                {/* Role Specific Fields */}
                {role === 'MEDECIN' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Spécialité</label>
                        <input
                            type="text"
                            value={formData.specialite}
                            onChange={(e) => setFormData({ ...formData, specialite: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                )}

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                    >
                        {loading ? 'Chargement...' : (userToEdit ? 'Modifier' : 'Créer')}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
}
