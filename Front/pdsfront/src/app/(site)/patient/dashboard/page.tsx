'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { patientService, appointmentService, dossierService } from '@/services/api';
import Link from 'next/link';
import { Toaster, toast } from 'react-hot-toast';

export default function PatientDashboard() {
    const router = useRouter();
    const [patient, setPatient] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [dossier, setDossier] = useState<any>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const userStr = localStorage.getItem('medinsight_user');
                if (!userStr) {
                    router.push('/login');
                    return;
                }
                const user = JSON.parse(userStr);

                // Fetch Patient Profile using User ID
                // Note: Ensure your backend has this endpoint working or user ID mapping is correct
                // Assuming user.id corresponds to what the endpoint expects
                const profile = await patientService.getPatientByUserId(user.id);
                setPatient(profile);

                if (profile && profile.id) {
                    // Fetch Appointments
                    const appts = await appointmentService.getAppointmentsByPatient(profile.id);
                    setAppointments(appts || []);

                    // Fetch Dossier
                    const dos = await dossierService.getDossierByPatientId(profile.id);
                    setDossier(dos);
                }

            } catch (error) {
                console.error("Failed to load patient data", error);
                toast.error("Could not load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <section className="pb-12 pt-24 lg:pb-24 lg:pt-32 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-dark dark:text-white">
                            Hello, {patient?.nom ? `${patient.prenom} ${patient.nom}` : 'Patient'}
                        </h1>
                        <p className="mt-2 text-base text-body-color">
                            Welcome to your health dashboard.
                        </p>
                    </div>
                    <Link
                        href="/patient/appointments/book"
                        className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-center text-base font-medium text-white hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg"
                    >
                        Book Appointment
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {/* Stat Card 1: Next Appointment */}
                    <div className="rounded-xl bg-white p-8 shadow-sm hover:shadow-md transition-shadow dark:bg-dark-2">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-dark dark:text-white">Next Appointment</h3>
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            </span>
                        </div>
                        {appointments.length > 0 ? (
                            // Sort and pick first upcoming
                            <div>
                                <p className="text-2xl font-bold text-dark dark:text-white mb-2">
                                    {new Date(appointments[0].dateHeure).toLocaleDateString()}
                                </p>
                                <p className="text-body-color">
                                    {new Date(appointments[0].dateHeure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    <br />
                                    <span className="text-sm">With Dr. [Fetch Name]</span>
                                </p>
                            </div>
                        ) : (
                            <p className="text-body-color">No upcoming appointments.</p>
                        )}
                        <Link href="/patient/appointments" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
                            View All &rarr;
                        </Link>
                    </div>

                    {/* Stat Card 2: Medical Record Status */}
                    <div className="rounded-xl bg-white p-8 shadow-sm hover:shadow-md transition-shadow dark:bg-dark-2">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-dark dark:text-white">My Records</h3>
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-dark dark:text-white mb-1">
                            {dossier ? 'Active' : 'Pending'}
                        </p>
                        <p className="text-sm text-body-color">
                            Medical Dossier ID: {dossier?.id || 'N/A'}
                        </p>
                        <Link href="/patient/dossier" className="mt-6 inline-block text-sm font-medium text-secondary hover:underline">
                            Access Records &rarr;
                        </Link>
                    </div>

                    {/* Stat Card 3: Profile Info */}
                    <div className="rounded-xl bg-white p-8 shadow-sm hover:shadow-md transition-shadow dark:bg-dark-2">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-dark dark:text-white">Profile</h3>
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-body-color">Phone:</span>
                                <span className="font-medium text-dark dark:text-white">{patient?.telephone || 'Not set'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-body-color">Email:</span>
                                <span className="font-medium text-dark dark:text-white">{patient?.email || 'N/A'}</span>
                            </div>
                        </div>

                        <Link href="/patient/profile" className="mt-6 inline-block text-sm font-medium text-green-600 hover:underline">
                            Edit Profile &rarr;
                        </Link>
                    </div>
                </div>

                {/* Recent Activity / History Section */}
                <div className="mt-10 rounded-xl bg-white p-8 shadow-sm dark:bg-dark-2">
                    <h2 className="mb-6 text-2xl font-bold text-dark dark:text-white">Recent Updates</h2>
                    <div className="space-y-4">
                        {/* Placeholder for notifications or recent actions */}
                        <div className="flex items-start gap-4 border-b border-stroke pb-4 last:border-0 dark:border-dark-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                                !
                            </div>
                            <div>
                                <h4 className="text-base font-semibold text-dark dark:text-white">Welcome to MedInsight</h4>
                                <p className="text-sm text-body-color">Your account has been successfully created. Please complete your profile.</p>
                                <span className="text-xs text-body-color/70 mt-1 block">Just now</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
