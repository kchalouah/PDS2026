'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { dossierService, patientService, prescriptionService, medecinService } from '@/services';
import { toast, Toaster } from 'react-hot-toast';

export default function DossierPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [patient, setPatient] = useState<any>(null);
    const [dossier, setDossier] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('prescriptions');

    // Sub-data
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const [diagnostics, setDiagnostics] = useState<any[]>([]);
    const [reports, setReports] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const userStr = localStorage.getItem('medinsight_user');
            if (!userStr) {
                router.push('/login');
                return;
            }
            const user = JSON.parse(userStr);

            // Fetch Patient
            const profile = await patientService.getPatientByUserId(user.id);
            setPatient(profile);

            if (profile?.id) {
                // Fetch Dossier
                const dos = await dossierService.getDossierByPatientId(profile.id);
                setDossier(dos);

                if (dos?.id) {
                    // Fetch related medical data
                    const [prescs, diags, reps] = await Promise.all([
                        prescriptionService.getPrescriptionsByDossier(dos.id),
                        medecinService.getDiagnosticsByDossier(dos.id),
                        medecinService.getReportsByDossier(dos.id)
                    ]);

                    setPrescriptions(prescs || []);
                    setDiagnostics(diags || []);
                    setReports(reps || []);
                }
            }

        } catch (error) {
            console.error(error);
            // Don't show error if it's just that the dossier doesn't exist yet
            if (dossier === null) {
                // maybe just empty
            } else {
                toast.error("Failed to load medical records");
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

    if (!dossier) {
        return (
            <section className="pb-12 pt-24 lg:pb-24 lg:pt-32 bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-black dark:text-white mb-4">No Medical Record Found</h2>
                    <p className="text-body-color">Your medical dossier has not been created yet. Please consult with your doctor.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="pb-12 pt-24 lg:pb-24 lg:pt-32 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4">
                <Toaster />

                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-dark dark:text-white">Medical Record</h1>
                    <p className="mt-2 text-body-color">
                        Patient: <span className="font-semibold text-black dark:text-white">{patient?.prenom} {patient?.nom}</span> |
                        Dossier ID: <span className="font-mono text-black dark:text-white">#{dossier.id}</span>
                    </p>
                </div>

                {/* Tabs */}
                <div className="mb-8 flex flex-wrap gap-4 border-b border-stroke pb-2 dark:border-strokedark">
                    <button
                        onClick={() => setActiveTab('prescriptions')}
                        className={`px-4 py-2 text-sm font-medium transition ${activeTab === 'prescriptions' ? 'border-b-2 border-primary text-primary' : 'text-body-color hover:text-black dark:hover:text-white'}`}
                    >
                        Prescriptions
                    </button>
                    <button
                        onClick={() => setActiveTab('diagnostics')}
                        className={`px-4 py-2 text-sm font-medium transition ${activeTab === 'diagnostics' ? 'border-b-2 border-primary text-primary' : 'text-body-color hover:text-black dark:hover:text-white'}`}
                    >
                        Diagnostics
                    </button>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`px-4 py-2 text-sm font-medium transition ${activeTab === 'reports' ? 'border-b-2 border-primary text-primary' : 'text-body-color hover:text-black dark:hover:text-white'}`}
                    >
                        Reports
                    </button>
                </div>

                {/* Content */}
                <div className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">

                    {activeTab === 'prescriptions' && (
                        <div>
                            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">Prescriptions History</h3>
                            {prescriptions.length === 0 ? <p className="text-body-color">No prescriptions found.</p> : (
                                <div className="space-y-4">
                                    {prescriptions.map((p) => (
                                        <div key={p.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition dark:border-strokedark dark:hover:bg-meta-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-black dark:text-white">{p.medicament}</h4>
                                                    <p className="text-sm text-body-color mt-1">{p.dosage} - {p.frequence}</p>
                                                    <p className="text-xs text-gray-500 mt-2">Duration: {p.duree}</p>
                                                </div>
                                                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                                                    Author: Dr. {p.medecin?.nom || 'Unknown'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'diagnostics' && (
                        <div>
                            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">Medical Diagnostics</h3>
                            {diagnostics.length === 0 ? <p className="text-body-color">No diagnostics found.</p> : (
                                <div className="space-y-4">
                                    {diagnostics.map((d) => (
                                        <div key={d.id} className="p-4 border border-gray-200 rounded-lg bg-red-50 dark:bg-meta-4 dark:border-strokedark">
                                            <div className="flex justify-between">
                                                <h4 className="font-bold text-red-800 dark:text-red-300">{d.maladie}</h4>
                                                <span className="text-xs text-body-color">{new Date(d.date).toLocaleDateString()}</span>
                                            </div>
                                            <p className="mt-2 text-sm text-black dark:text-white">{d.description}</p>
                                            <p className="mt-2 text-xs font-semibold text-gray-600">Severity: {d.severite}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'reports' && (
                        <div>
                            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">Medical Reports</h3>
                            {reports.length === 0 ? <p className="text-body-color">No reports found.</p> : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {reports.map((r) => (
                                        <div key={r.id} className="p-5 border border-stroke rounded-lg dark:border-strokedark">
                                            <h4 className="font-bold text-black dark:text-white mb-2">{r.typeReport}</h4>
                                            <p className="text-sm text-body-color mb-3">{r.contenu}</p>
                                            <div className="flex justify-between items-center mt-4 border-t border-gray-100 pt-3">
                                                <span className="text-xs text-gray-500">{new Date(r.date).toLocaleDateString()}</span>
                                                {/* Potential Download Button if reports were files */}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </section>
    );
}
