'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { appointmentService, medecinService, predictionService } from '@/services';
import { toast, Toaster } from 'react-hot-toast';

export default function MedecinDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [medecin, setMedecin] = useState<any>(null);
    const [stats, setStats] = useState({
        patients: 0,
        appointments: 0,
        pending: 0
    });
    const [appointments, setAppointments] = useState<any[]>([]);
    const [predictions, setPredictions] = useState<any>(null);
    const [riskData, setRiskData] = useState<any>(null);

    useEffect(() => {
        const initDashboard = async () => {
            try {
                const userStr = localStorage.getItem('medinsight_user');
                if (!userStr) {
                    router.push('/login');
                    return;
                }
                const user = JSON.parse(userStr);

                // 1. Get Medecin Profile
                const med = await medecinService.getMedecinByUserId(user.id);
                if (!med) {
                    toast.error("Medecin Profile not found.");
                    setLoading(false);
                    return;
                }
                setMedecin(med);

                // 2. Fetch Appointments
                const apps = await appointmentService.getAppointmentsByMedecin(med.id);
                setAppointments(apps || []);

                // 3. Stats
                const pendingCount = apps.filter((a: any) => a.status === 'EN_ATTENTE').length;
                // Unique patients count
                const uniquePatients = new Set(apps.map((a: any) => a.patientId)).size;

                setStats({
                    patients: uniquePatients,
                    appointments: apps.length,
                    pending: pendingCount
                });

                // 4. Predictions
                try {
                    const bedOcc = await predictionService.getBedOccupancy();
                    setPredictions(bedOcc);

                    const risks = await predictionService.getRelapseRisk();
                    setRiskData(risks);
                } catch (predErr) {
                    console.warn("Prediction service unavailable", predErr);
                }

            } catch (error) {
                console.error("Dashboard error:", error);
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        initDashboard();
    }, []);

    if (loading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

    return (
        <section className="pb-12 pt-24 lg:pb-24 lg:pt-32 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4">
                <Toaster />

                <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
                    Welcome back, Dr. {medecin?.nom || 'Doctor'}
                </h1>
                <p className="text-body-color mb-8">Here is your daily medical overview.</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="rounded-xl bg-white p-6 shadow-default dark:bg-boxdark border border-stroke dark:border-strokedark">
                        <h4 className="text-md text-body-color font-medium">Total Appointments</h4>
                        <h2 className="mt-4 text-3xl font-bold text-black dark:text-white">{stats.appointments}</h2>
                    </div>
                    <div className="rounded-xl bg-white p-6 shadow-default dark:bg-boxdark border border-stroke dark:border-strokedark">
                        <h4 className="text-md text-body-color font-medium">Unique Patients</h4>
                        <h2 className="mt-4 text-3xl font-bold text-black dark:text-white">{stats.patients}</h2>
                    </div>
                    <div className="rounded-xl bg-white p-6 shadow-default dark:bg-boxdark border border-stroke dark:border-strokedark">
                        <h4 className="text-md text-body-color font-medium">Pending Requests</h4>
                        <h2 className="mt-4 text-3xl font-bold text-primary">{stats.pending}</h2>
                    </div>
                </div>

                {/* AI Predictions */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-black dark:text-white mb-4">AI Predictive Insights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Bed Occupancy */}
                        <div className="rounded-xl bg-white p-6 shadow-default dark:bg-boxdark border border-stroke dark:border-strokedark relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" /></svg>
                            </div>
                            <h4 className="font-semibold text-black dark:text-white mb-2">Hospital Bed Occupancy</h4>
                            {predictions ? (
                                <div>
                                    <div className="flex items-end gap-2 mb-2">
                                        <span className="text-4xl font-bold text-primary">{predictions.currentOccupancy || 'N/A'}</span>
                                        <span className="text-sm text-body-color mb-1">Current</span>
                                    </div>
                                    <p className="text-sm">Predicted Next Week: <span className="font-medium text-black dark:text-white">{predictions.predictedOccupancyNextWeek}</span></p>
                                    <div className={`inline-flex mt-4 px-3 py-1 rounded-full text-xs font-medium ${predictions.riskLevel === 'HIGH' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                        Risk Level: {predictions.riskLevel}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-body-color">Predictive data loading...</p>
                            )}
                        </div>

                        {/* Relapse Risk */}
                        <div className="rounded-xl bg-white p-6 shadow-default dark:bg-boxdark border border-stroke dark:border-strokedark">
                            <h4 className="font-semibold text-black dark:text-white mb-2">Patient Relapse Analysis</h4>
                            {riskData ? (
                                <div>
                                    <div className="flex items-end gap-2 mb-2">
                                        <span className="text-4xl font-bold text-orange-500">{riskData.averageRisk || '0%'}</span>
                                        <span className="text-sm text-body-color mb-1">Avg Risk</span>
                                    </div>
                                    <p className="text-sm">Patients at High Risk: <span className="font-bold text-red-600">{riskData.highRiskPatientsCount || 0}</span></p>
                                    <p className="mt-4 text-xs text-body-color">Based on recent diagnostic trends.</p>
                                </div>
                            ) : (
                                <p className="text-sm text-body-color">Predictive data loading...</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Appointments */}
                <div className="rounded-xl border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                        Upcoming Appointments
                    </h4>

                    <div className="flex flex-col">
                        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
                            <div className="p-2.5 xl:p-5"><h5 className="text-sm font-medium uppercase xsm:text-base">Date</h5></div>
                            <div className="p-2.5 text-center xl:p-5"><h5 className="text-sm font-medium uppercase xsm:text-base">Patient</h5></div>
                            <div className="p-2.5 text-center xl:p-5"><h5 className="text-sm font-medium uppercase xsm:text-base">Status</h5></div>
                            <div className="hidden p-2.5 text-center sm:block xl:p-5"><h5 className="text-sm font-medium uppercase xsm:text-base">Reason</h5></div>
                            <div className="hidden p-2.5 text-center sm:block xl:p-5"><h5 className="text-sm font-medium uppercase xsm:text-base">Action</h5></div>
                        </div>

                        {appointments.length === 0 ? (
                            <div className="p-5 text-center text-body-color">No upcoming appointments found.</div>
                        ) : (
                            appointments.slice(0, 5).map((appointment) => (
                                <div key={appointment.id} className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-5 hover:bg-gray-1 dark:hover:bg-meta-4">
                                    <div className="flex items-center p-2.5 xl:p-5">
                                        <p className="text-black dark:text-white">{new Date(appointment.dateHeure).toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <p className="text-black dark:text-white">ID: {appointment.patientId}</p>
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <span className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${appointment.status === 'CONFIRME' ? 'bg-success text-success' :
                                                appointment.status === 'ANNULE' ? 'bg-danger text-danger' :
                                                    'bg-warning text-warning'
                                            }`}>
                                            {appointment.status}
                                        </span>
                                    </div>
                                    <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                                        <p className="text-black dark:text-white text-sm truncate max-w-[150px]">{appointment.motif}</p>
                                    </div>
                                    <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                                        <button onClick={() => router.push(`/medecin/patients`)} className="text-primary hover:underline text-sm">
                                            View Patient
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </section>
    );
}
