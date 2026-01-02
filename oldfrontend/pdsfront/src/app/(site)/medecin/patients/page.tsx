'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { patientService } from '@/services';
import { toast, Toaster } from 'react-hot-toast';

export default function PatientListPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [patients, setPatients] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        try {
            // In a real app, maybe filter by doctor's patients only
            const data = await patientService.getAllPatients();
            setPatients(data || []);
        } catch (error) {
            console.error("Error loading patients:", error);
            toast.error("Failed to load patient list");
        } finally {
            setLoading(false);
        }
    };

    const filteredPatients = patients.filter(p =>
    (p.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <section className="pb-12 pt-24 lg:pb-24 lg:pt-32 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4">
                <Toaster />

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-black dark:text-white">Patient Directory</h1>
                        <p className="text-body-color mt-1">Access patient records and dossiers</p>
                    </div>
                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search patients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white dark:bg-boxdark border border-stroke dark:border-strokedark rounded-lg px-4 py-2 w-64 focus:outline-none focus:border-primary"
                        />
                    </div>
                </div>

                <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-hidden">
                    <div className="grid grid-cols-4 border-b border-stroke bg-gray-2 px-4 py-4 dark:border-strokedark dark:bg-meta-4 sm:grid-cols-5 md:px-6 2xl:px-7.5">
                        <div className="col-span-2 flex items-center"><p className="font-medium text-black dark:text-white">Name</p></div>
                        <div className="flex items-center"><p className="font-medium text-black dark:text-white">Email</p></div>
                        <div className="hidden sm:flex items-center"><p className="font-medium text-black dark:text-white">Phone</p></div>
                        <div className="flex items-center justify-end"><p className="font-medium text-black dark:text-white">Action</p></div>
                    </div>

                    {loading ? (
                        <div className="p-10 text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                    ) : filteredPatients.length === 0 ? (
                        <div className="p-6 text-center text-body-color">No patients found.</div>
                    ) : (
                        filteredPatients.map((patient, key) => (
                            <div key={patient.id} className="grid grid-cols-4 border-b border-stroke px-4 py-4 dark:border-strokedark sm:grid-cols-5 md:px-6 2xl:px-7.5 hover:bg-gray-1 dark:hover:bg-meta-4 transition">
                                <div className="col-span-2 flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center font-bold text-sm">
                                        {patient.prenom?.charAt(0)}{patient.nom?.charAt(0)}
                                    </div>
                                    <p className="text-black dark:text-white font-medium">{patient.prenom} {patient.nom}</p>
                                </div>
                                <div className="flex items-center">
                                    <p className="text-sm text-black dark:text-white">{patient.email}</p>
                                </div>
                                <div className="hidden sm:flex items-center">
                                    <p className="text-sm text-black dark:text-white">{patient.profile?.telephone || 'N/A'}</p>
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => router.push(`/medecin/patients/${patient.id}`)}
                                        className="text-primary hover:underline text-sm font-medium"
                                    >
                                        Open Dossier
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
