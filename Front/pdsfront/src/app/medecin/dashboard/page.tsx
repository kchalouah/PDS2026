"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { User, Calendar, Activity, FileText, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MedecinDashboard() {
    const [medecin, setMedecin] = useState<any>(null)
    const [appointments, setAppointments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchMedecinData = async () => {
            try {
                const token = localStorage.getItem('medinsight_token');
                const userData = localStorage.getItem('medinsight_user');

                if (!token || !userData) {
                    setError("Non authentifié");
                    router.push('/auth/login');
                    return;
                }

                const user = JSON.parse(userData);
                const userId = user.id;

                // Fetch medecin data
                try {
                    const response = await api.get(`/medecins/user/${userId}`);
                    setMedecin(response.data);

                    // Fetch medecin appointments
                    if (response.data?.id) {
                        const apptResponse = await api.get(`/appointments/medecin/${response.data.id}`);
                        setAppointments(apptResponse.data || []);
                    }
                } catch (apiErr: any) {
                    console.error("API Error:", apiErr);
                    // If medecin doesn't exist in backend, show basic info
                    setMedecin({
                        id: userId,
                        nom: user.username,
                        prenom: user.username,
                        email: user.email || ""
                    });
                }
            } catch (err: any) {
                console.error("Error:", err);
                setError("Impossible de charger les données");
            } finally {
                setLoading(false);
            }
        };

        fetchMedecinData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('medinsight_token');
        localStorage.removeItem('medinsight_user');
        router.push('/auth/login');
    };

    if (loading) return <div className="p-8 text-white">Chargement...</div>;
    if (error) return <div className="p-8 text-red-500">Erreur: {error}</div>;

    const todayAppointments = appointments.filter(appt => {
        const apptDate = new Date(appt.dateHeure);
        const today = new Date();
        return apptDate.toDateString() === today.toDateString();
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Tableau de Bord Médecin</h1>
                        <p className="text-gray-300">Bonjour, Dr. {medecin?.prenom} {medecin?.nom}</p>
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
                            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center">
                                <User className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Dr. {medecin?.prenom} {medecin?.nom}</CardTitle>
                                <CardDescription className="text-gray-300">Médecin</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {medecin?.specialite && (
                                <div className="flex items-center gap-3 text-sm text-gray-200">
                                    <Activity className="h-5 w-5 text-teal-400" />
                                    <span>{medecin.specialite}</span>
                                </div>
                            )}
                            {medecin?.telephone && (
                                <div className="flex items-center gap-3 text-sm text-gray-200">
                                    <FileText className="h-5 w-5 text-teal-400" />
                                    <span>{medecin.telephone}</span>
                                </div>
                            )}
                            <div className="pt-4 border-t border-white/10">
                                <p className="text-sm text-gray-300">Rendez-vous aujourd'hui</p>
                                <p className="text-3xl font-bold text-white">{todayAppointments.length}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Appointments Card */}
                    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <Calendar className="h-6 w-6" />
                                Rendez-vous d'Aujourd'hui
                            </CardTitle>
                            <CardDescription className="text-gray-300">
                                {todayAppointments.length} rendez-vous prévus
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {todayAppointments.length > 0 ? (
                                <div className="space-y-3">
                                    {todayAppointments.map((appt, idx) => (
                                        <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/10">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold">Patient: {appt.patientNom || appt.patientId}</p>
                                                    <p className="text-sm text-gray-300">{new Date(appt.dateHeure).toLocaleTimeString('fr-FR')}</p>
                                                    {appt.motif && <p className="text-sm text-gray-400 mt-1">{appt.motif}</p>}
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
                                <p className="text-gray-400 italic">Aucun rendez-vous prévu aujourd'hui</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white lg:col-span-3">
                        <CardHeader>
                            <CardTitle className="text-2xl">Actions Rapides</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Button className="h-20 text-lg bg-teal-600 hover:bg-teal-700">
                                    Voir Tous les Rendez-vous
                                </Button>
                                <Button className="h-20 text-lg bg-blue-600 hover:bg-blue-700">
                                    Gérer les Dossiers
                                </Button>
                                <Button className="h-20 text-lg bg-purple-600 hover:bg-purple-700">
                                    Prédictions IA
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
