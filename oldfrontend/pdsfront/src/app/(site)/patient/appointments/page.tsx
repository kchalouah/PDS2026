'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { appointmentService, medecinService, patientService } from '@/services';
import { toast, Toaster } from 'react-hot-toast';

export default function AppointmentsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [medecins, setMedecins] = useState<any[]>([]);
    const [patient, setPatient] = useState<any>(null);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [bookingData, setBookingData] = useState({
        medecinId: '',
        dateHeure: '',
        motif: ''
    });

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

            // Fetch Appointments
            if (profile?.id) {
                const appts = await appointmentService.getAppointmentsByPatient(profile.id);
                setAppointments(appts || []);
            }

            // Fetch Medecins for dropdown
            const docs = await medecinService.getAllMedecins();
            setMedecins(docs || []);

        } catch (error) {
            console.error(error);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!patient?.id) return;

            const payload = {
                dateHeure: bookingData.dateHeure,
                motif: bookingData.motif,
                status: 'PLANIFIE',
                patientId: patient.id,
                medecinId: parseInt(bookingData.medecinId)
            };

            await appointmentService.createAppointment(payload);
            toast.success("Appointment booked successfully!");
            setShowModal(false);
            setBookingData({ medecinId: '', dateHeure: '', motif: '' });
            loadData(); // Refresh list
        } catch (error) {
            console.error(error);
            toast.error("Failed to book appointment");
        }
    };

    const handleCancel = async (id: number) => {
        if (!confirm("Are you sure you want to cancel this appointment?")) return;
        try {
            await appointmentService.updateStatus(id, 'ANNULE');
            toast.success("Appointment cancelled");
            loadData();
        } catch (error) {
            console.error(error);
            toast.error("Failed to cancel");
        }
    };

    const getDoctorName = (id: number) => {
        const doc = medecins.find(m => m.id === id);
        return doc ? `Dr. ${doc.prenom} ${doc.nom}` : `Doctor #${id}`;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'CONFIRME':
                return <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">Confirmed</span>;
            case 'ANNULE':
                return <span className="px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">Cancelled</span>;
            case 'PLANIFIE':
                return <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">Scheduled</span>;
            default:
                return <span className="px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">{status}</span>;
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

    return (
        <section className="pb-12 pt-24 lg:pb-24 lg:pt-32 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4">
                <Toaster />

                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-dark dark:text-white">My Appointments</h1>
                        <p className="mt-2 text-body-color">Manage your upcoming and past medical appointments.</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="rounded-lg bg-primary px-6 py-3 text-base font-medium text-white hover:bg-opacity-90 transition shadow-lg"
                    >
                        + Book New
                    </button>
                </div>

                <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-hidden">
                    <div className="max-w-full overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-100 text-left dark:bg-meta-4">
                                    <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">Date & Time</th>
                                    <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">Doctor</th>
                                    <th className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white">Reason</th>
                                    <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">Status</th>
                                    <th className="px-4 py-4 font-medium text-black dark:text-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-10 text-body-color">
                                            No appointments found. Book one now!
                                        </td>
                                    </tr>
                                ) : (
                                    appointments.map((appt) => (
                                        <tr key={appt.id} className="border-b border-stroke dark:border-strokedark last:border-0 hover:bg-gray-50 transition">
                                            <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                                                <h5 className="font-medium text-black dark:text-white">
                                                    {new Date(appt.dateHeure).toLocaleDateString()}
                                                </h5>
                                                <p className="text-sm text-body-color">
                                                    {new Date(appt.dateHeure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </td>
                                            <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                                <p className="text-black dark:text-white">
                                                    {getDoctorName(appt.medecinId)}
                                                </p>
                                            </td>
                                            <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                                <p className="text-black dark:text-white line-clamp-2">
                                                    {appt.motif}
                                                </p>
                                            </td>
                                            <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                                {getStatusBadge(appt.status)}
                                            </td>
                                            <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                                {appt.status !== 'ANNULE' && appt.status !== 'REALISE' && (
                                                    <button
                                                        onClick={() => handleCancel(appt.id)}
                                                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl dark:bg-boxdark animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-black dark:text-white">Book Appointment</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-black dark:hover:text-white">✕</button>
                        </div>

                        <form onSubmit={handleBook}>
                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                                    Select Doctor
                                </label>
                                <select
                                    className="w-full rounded border border-stroke bg-gray py-3 px-4 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    value={bookingData.medecinId}
                                    onChange={(e) => setBookingData({ ...bookingData, medecinId: e.target.value })}
                                    required
                                >
                                    <option value="">-- Choose a Doctor --</option>
                                    {medecins.map(doc => (
                                        <option key={doc.id} value={doc.id}>
                                            Dr. {doc.prenom} {doc.nom} ({doc.specialite})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                                    Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    className="w-full rounded border border-stroke bg-gray py-3 px-4 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    value={bookingData.dateHeure}
                                    onChange={(e) => setBookingData({ ...bookingData, dateHeure: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                                    Reason for Visit
                                </label>
                                <textarea
                                    rows={3}
                                    className="w-full rounded border border-stroke bg-gray py-3 px-4 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    placeholder="Briefly describe your symptoms or reason..."
                                    value={bookingData.motif}
                                    onChange={(e) => setBookingData({ ...bookingData, motif: e.target.value })}
                                    required
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="rounded border border-stroke px-6 py-2 text-black hover:bg-gray-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded bg-primary px-6 py-2 text-white hover:bg-opacity-90 transition shadow-md"
                                >
                                    Confirm Booking
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
