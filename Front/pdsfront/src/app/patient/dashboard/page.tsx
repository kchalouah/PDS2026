"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Patient } from "@/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { User, Activity, Calendar, MapPin, Phone, Mail, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PatientDashboard() {
    const [patient, setPatient] = useState<Patient | null>(null)
    const [appointments, setAppointments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const token = localStorage.getItem('medinsight_token');
                const userData = localStorage.getItem('medinsight_user');

                if (!token || !userData) {
                    setError("Non authentifié. Veuillez vous connecter.");
                    setLoading(false);
                    router.push('/auth/login');
                    return;
                }

                const user = JSON.parse(userData);
                const userId = user.id;

                if (!userId) {
                    setError("Impossible de récupérer l'ID utilisateur");
                    setLoading(false);
                    return;
                }

                // Fetch patient data from backend
                try {
                    const response = await api.get(`/patients/user/${userId}`);
                    setPatient(response.data);

                    // Fetch patient appointments
                    if (response.data?.id) {
                        const apptResponse = await api.get(`/appointments/patient/${response.data.id}`);
                        setAppointments(apptResponse.data || []);
                    }
                } catch (apiErr: any) {
                    console.error("API Error:", apiErr);
                    // If patient doesn't exist yet in backend, show basic info from Keycloak
                    setPatient({
                        id: userId,
                        nom: user.username,
                        prenom: user.username,
                        email: user.email || ""
                    } as Patient);
                }
            } catch (err: any) {
                console.error("Error fetching patient:", err);
                setError("Impossible de charger les données du patient.");
            } finally {
                setLoading(false);
            }
        };

        fetchPatientData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('medinsight_token');
        localStorage.removeItem('medinsight_user');
        router.push('/auth/login');
    };

    if (loading) return <div className="p-8 text-white">Chargement...</div>;
    if (error) return <div className="p-8 text-red-500">Erreur: {error}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Tableau de Bord Patient</h1>
                        <p className="text-gray-300">Bienvenue, {patient?.prenom} {patient?.nom}</p>
                    </div>
                    <Button onClick={handleLogout} variant="outline" className="gap-2">
                        <LogOut className="h-4 w-4" />
                        Déconnexion
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                        <CardHeader className="flex flex-row items-center space-x-4">
                            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <User className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">{patient?.prenom} {patient?.nom}</CardTitle>
                                <CardDescription className="text-gray-300">Patient</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {patient?.email && (
                                <div className="flex items-center gap-3 text-sm text-gray-200">
                                    <Mail className="h-5 w-5 text-blue-400" />
                                    <span>{patient.email}</span>
                                </div>
                            )}
                            {patient?.gender && (
                                <div className="flex items-center gap-3 text-sm text-gray-200">
                                    <Activity className="h-5 w-5 text-blue-400" />
                                    <span>{patient.gender === 'M' ? 'Homme' : patient.gender === 'F' ? 'Femme' : 'Autre'}</span>
                                </div>
                            )}
                            {patient?.dateNaissance && (
                                <div className="flex items-center gap-3 text-sm text-gray-200">
                                    <Calendar className="h-5 w-5 text-blue-400" />
                                    <span>{new Date(patient.dateNaissance).toLocaleDateString('fr-FR')}</span>
                                </div>
                            )}
                            {patient?.telephone && (
                                <div className="flex items-center gap-3 text-sm text-gray-200">
                                    <Phone className="h-5 w-5 text-blue-400" />
                                    <span>{patient.telephone}</span>
                                </div>
                            )}
                            {patient?.adresse && (
                                <div className="flex items-center gap-3 text-sm text-gray-200">
                                    <MapPin className="h-5 w-5 text-blue-400" />
                                    <span>{patient.adresse.ville}, {patient.adresse.pays}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Appointments Card */}
                    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-2xl">Mes Rendez-vous</CardTitle>
                            <CardDescription className="text-gray-300">Prochains rendez-vous médicaux</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {appointments.length > 0 ? (
                                <div className="space-y-3">
                                    {appointments.slice(0, 5).map((appt, idx) => (
                                        <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/10">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold">{appt.medecinNom || 'Dr. ' + appt.medecinId}</p>
                                                    <p className="text-sm text-gray-300">{new Date(appt.dateHeure).toLocaleString('fr-FR')}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs ${appt.statut === 'CONFIRMED' ? 'bg-green-500/20 text-green-300' :
                                                        appt.statut === 'ANNULE' ? 'bg-red-500/20 text-red-300' :
                                                            'bg-yellow-500/20 text-yellow-300'
                                                    }`}>
                                                    {appt.statut}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 italic">Aucun rendez-vous prévu.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
