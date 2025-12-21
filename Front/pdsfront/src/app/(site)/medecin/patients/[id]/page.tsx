'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { patientService, dossierService, medecinService, prescriptionService } from '@/services/api';
import { toast, Toaster } from 'react-hot-toast';

export default function DoctorWorkstation() {
    const params = useParams();
    const router = useRouter();
    const patientId = Number(params.id);

    const [loading, setLoading] = useState(true);
    const [patient, setPatient] = useState<any>(null);
    const [dossier, setDossier] = useState<any>(null);

    // Data Lists
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const [diagnostics, setDiagnostics] = useState<any[]>([]);
    const [reports, setReports] = useState<any[]>([]);

    // Active Tab
    const [activeTab, setActiveTab] = useState<'overview' | 'prescriptions' | 'diagnostics' | 'reports'>('overview');

    useEffect(() => {
        if (patientId) {
            loadPatientData();
        }
    }, [patientId]);

    const loadPatientData = async () => {
        try {
            setLoading(true);
            const pData = await patientService.getPatientById(patientId);
            setPatient(pData);

            if (pData) {
                const dData = await dossierService.getDossierByPatientId(pData.id);
                setDossier(dData);

                if (dData) {
                    // Load parallel data
                    const [presc, diag, rep] = await Promise.all([
                        prescriptionService.getPrescriptionsByDossier(dData.id),
                        medecinService.getDiagnosticsByDossier(dData.id),
                        medecinService.getReportsByDossier(dData.id)
                    ]);
                    setPrescriptions(presc || []);
                    setDiagnostics(diag || []);
                    setReports(rep || []);
                }
            }
        } catch (error) {
            console.error("Error loading workstation:", error);
            toast.error("Failed to load patient data");
        } finally {
            setLoading(false);
        }
    };

    // Modals
    const [showDiagModal, setShowDiagModal] = useState(false);
    const [showPrescModal, setShowPrescModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);

    // Form States
    const [newDiag, setNewDiag] = useState({ description: '', resultat: '' });
    const [newPresc, setNewPresc] = useState({ medicaments: '', instructions: '', duree: '' });
    const [newReport, setNewReport] = useState({ type: '', contenu: '' });

    const handleAddDiagnostic = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await medecinService.addDiagnostic({
                ...newDiag,
                dossierMedical: { id: dossier.id }
            });
            toast.success("Diagnostic added");
            setShowDiagModal(false);
            setNewDiag({ description: '', resultat: '' });
            loadPatientData(); // Refresh
        } catch (err) {
            toast.error("Failed to add diagnostic");
        }
    };

    const handleAddPrescription = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await medecinService.createPrescription({
                ...newPresc,
                dossierMedical: { id: dossier.id }
            });
            toast.success("Prescription created");
            setShowPrescModal(false);
            setNewPresc({ medicaments: '', instructions: '', duree: '' });
            loadPatientData();
        } catch (err) {
            toast.error("Failed to create prescription");
        }
    };

    const handleAddReport = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await medecinService.addReport({
                ...newReport,
                dossierMedical: { id: dossier.id }
            });
            toast.success("Report added");
            setShowReportModal(false);
            setNewReport({ type: '', contenu: '' });
            loadPatientData();
        } catch (err) {
            toast.error("Failed to add report");
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    if (!patient) return <div className="p-10 text-center">Patient not found</div>;

    return (
        <section className="pb-12 pt-24 lg:pb-24 lg:pt-32 bg-gray-50 min-h-screen relative">
            <div className="container mx-auto px-4">
                <Toaster />

                {/* Header */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <button onClick={() => router.back()} className="text-sm text-body-color hover:text-primary mb-2">← Back to List</button>
                        <h1 className="text-2xl font-bold text-black dark:text-white">
                            {patient.prenom} {patient.nom}
                        </h1>
                        <p className="text-sm text-body-color">
                            Born: {patient.profile?.dateNaissance} • Sex: {patient.gender} • Contact: {patient.profile?.telephone}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6 border-b border-stroke dark:border-strokedark">
                    <nav className="-mb-px flex space-x-8">
                        {['overview', 'prescriptions', 'diagnostics', 'reports'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-body-color hover:text-black hover:border-gray-300'
                                    } capitalize`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="bg-white p-6 shadow-default dark:bg-boxdark rounded-xl border border-stroke dark:border-strokedark">

                    {activeTab === 'overview' && (
                        <div>
                            <h3 className="font-semibold text-lg mb-4 text-black dark:text-white">Medical Summary</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-body-color mb-1">Emergency Contact</p>
                                    <p className="font-medium text-black dark:text-white">{patient.emergencyContact || 'None provided'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-body-color mb-1">Address</p>
                                    <p className="font-medium text-black dark:text-white">
                                        {patient.profile?.adresse ? `${patient.profile.adresse.rue}, ${patient.profile.adresse.ville}` : 'N/A'}
                                    </p>
                                </div>
                                <div className="md:col-span-2">
                                    <h4 className="font-medium text-black dark:text-white mt-4 mb-2">Recent Activity</h4>
                                    {diagnostics.length > 0 ? (
                                        <p className="text-sm">Last diagnostic: {new Date(diagnostics[diagnostics.length - 1].date).toLocaleDateString()}</p>
                                    ) : <p className="text-sm text-body-color">No recent medical activity recorded.</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'diagnostics' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-lg text-black dark:text-white">Diagnostics History</h3>
                                <button onClick={() => setShowDiagModal(true)} className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-opacity-90">
                                    + Add Diagnostic
                                </button>
                            </div>
                            <div className="flex flex-col gap-4">
                                {diagnostics.length === 0 ? (
                                    <div className="p-4 border border-dashed rounded text-center text-body-color">No diagnostics found.</div>
                                ) : diagnostics.map((item: any) => (
                                    <div key={item.id} className="p-4 border border-stroke rounded dark:border-strokedark">
                                        <div className="flex justify-between mb-2">
                                            <span className="font-medium text-black dark:text-white">{item.description}</span>
                                            <span className="text-sm text-body-color">{new Date(item.date).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm">Result: {item.resultat}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'prescriptions' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-lg text-black dark:text-white">Prescriptions</h3>
                                <button onClick={() => setShowPrescModal(true)} className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-opacity-90">
                                    + New Prescription
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-body-color">
                                    <thead className="bg-gray-2 dark:bg-meta-4">
                                        <tr>
                                            <th className="p-3 font-medium text-black dark:text-white">Date</th>
                                            <th className="p-3 font-medium text-black dark:text-white">Medications</th>
                                            <th className="p-3 font-medium text-black dark:text-white">Instructions</th>
                                            <th className="p-3 font-medium text-black dark:text-white">Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {prescriptions.length === 0 ? (
                                            <tr><td colSpan={4} className="p-4 text-center">No prescriptions found.</td></tr>
                                        ) : prescriptions.map((p: any) => (
                                            <tr key={p.id} className="border-b border-stroke dark:border-strokedark">
                                                <td className="p-3">{new Date(p.date).toLocaleDateString()}</td>
                                                <td className="p-3 font-medium text-black">{p.medicaments}</td>
                                                <td className="p-3">{p.instructions}</td>
                                                <td className="p-3">{p.duree}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reports' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-lg text-black dark:text-white">Medical Reports</h3>
                                <button onClick={() => setShowReportModal(true)} className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-opacity-90">
                                    + Add Report
                                </button>
                            </div>
                            <div className="flex flex-col gap-4">
                                {reports.length === 0 ? (
                                    <div className="p-4 border border-dashed rounded text-center text-body-color">No reports found.</div>
                                ) : reports.map((item: any) => (
                                    <div key={item.id} className="p-4 border border-stroke rounded dark:border-strokedark bg-gray-50 dark:bg-meta-4">
                                        <h5 className="font-medium text-black dark:text-white mb-1">{item.type}</h5>
                                        <p className="text-sm mb-2 text-body-color">{new Date(item.date).toLocaleDateString()}</p>
                                        <p className="text-black dark:text-white">{item.contenu}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modals */}
                {/* Use basic fixed overlay for simplicity */}
                {showDiagModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white dark:bg-boxdark p-6 rounded-lg shadow-lg w-full max-w-md">
                            <h3 className="text-lg font-bold mb-4 text-black dark:text-white">Add Diagnostic</h3>
                            <form onSubmit={handleAddDiagnostic}>
                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-medium">Description</label>
                                    <input required type="text" className="w-full border rounded p-2 dark:bg-form-input dark:border-form-strokedark"
                                        value={newDiag.description} onChange={e => setNewDiag({ ...newDiag, description: e.target.value })} />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-medium">Result / Outcome</label>
                                    <textarea required className="w-full border rounded p-2 dark:bg-form-input dark:border-form-strokedark"
                                        value={newDiag.resultat} onChange={e => setNewDiag({ ...newDiag, resultat: e.target.value })} />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button type="button" onClick={() => setShowDiagModal(false)} className="px-4 py-2 rounded border text-sm">Cancel</button>
                                    <button type="submit" className="px-4 py-2 rounded bg-primary text-white text-sm">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {showPrescModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white dark:bg-boxdark p-6 rounded-lg shadow-lg w-full max-w-md">
                            <h3 className="text-lg font-bold mb-4 text-black dark:text-white">New Prescription</h3>
                            <form onSubmit={handleAddPrescription}>
                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-medium">Medications</label>
                                    <input required placeholder="E.g. Paracetamol 500mg" type="text" className="w-full border rounded p-2 dark:bg-form-input dark:border-form-strokedark"
                                        value={newPresc.medicaments} onChange={e => setNewPresc({ ...newPresc, medicaments: e.target.value })} />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-medium">Instructions (Dosage)</label>
                                    <input required placeholder="2 tablets daily" type="text" className="w-full border rounded p-2 dark:bg-form-input dark:border-form-strokedark"
                                        value={newPresc.instructions} onChange={e => setNewPresc({ ...newPresc, instructions: e.target.value })} />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-medium">Duration</label>
                                    <input required placeholder="5 days" type="text" className="w-full border rounded p-2 dark:bg-form-input dark:border-form-strokedark"
                                        value={newPresc.duree} onChange={e => setNewPresc({ ...newPresc, duree: e.target.value })} />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button type="button" onClick={() => setShowPrescModal(false)} className="px-4 py-2 rounded border text-sm">Cancel</button>
                                    <button type="submit" className="px-4 py-2 rounded bg-primary text-white text-sm">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {showReportModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white dark:bg-boxdark p-6 rounded-lg shadow-lg w-full max-w-lg">
                            <h3 className="text-lg font-bold mb-4 text-black dark:text-white">Add Medical Report</h3>
                            <form onSubmit={handleAddReport}>
                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-medium">Report Type</label>
                                    <select required className="w-full border rounded p-2 dark:bg-form-input dark:border-form-strokedark"
                                        value={newReport.type} onChange={e => setNewReport({ ...newReport, type: e.target.value })}>
                                        <option value="">Select Type</option>
                                        <option value="GENERAL_CHECKUP">General Checkup</option>
                                        <option value="XRAY">X-Ray / Imaging</option>
                                        <option value="LAB_RESULTS">Lab Results</option>
                                        <option value="SURGERY">Surgery Note</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-medium">Content / Observations</label>
                                    <textarea required rows={5} className="w-full border rounded p-2 dark:bg-form-input dark:border-form-strokedark"
                                        value={newReport.contenu} onChange={e => setNewReport({ ...newReport, contenu: e.target.value })} />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button type="button" onClick={() => setShowReportModal(false)} className="px-4 py-2 rounded border text-sm">Cancel</button>
                                    <button type="submit" className="px-4 py-2 rounded bg-primary text-white text-sm">Save Report</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
}
