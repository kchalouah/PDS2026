"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function AdminResourcePlanningPage() {
    const [medecins, setMedecins] = useState<any[]>([])
    const [selectedMedecin, setSelectedMedecin] = useState<any>(null)
    const [planning, setPlanning] = useState<any[]>([])
    const [appointments, setAppointments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('medinsight_token');
            const userData = localStorage.getItem('medinsight_user');

            if (!token || !userData) {
                router.push('/auth/login');
                return false;
            }

            const user = JSON.parse(userData);
            if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
                router.push('/admin/dashboard');
                return false;
            }
            return true;
        };

        if (checkAuth()) {
            fetchMedecins();
        }
    }, [router]);

    const fetchMedecins = async () => {
        try {
            const response = await api.get('/medecins');
            setMedecins(response.data || []);
        } catch (err) {
            console.error("Error fetching medecins:", err);
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de charger les médecins"
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchMedecinPlanning = async (medecinId: number) => {
        try {
            // Fetch planning/availability
            const planResponse = await api.get(`/medecins/planning/medecin/${medecinId}`);
            setPlanning(planResponse.data || []);

            // Fetch appointments
            const apptResponse = await api.get(`/appointments/medecin/${medecinId}`);
            setAppointments(apptResponse.data || []);
        } catch (err) {
            console.error("Error fetching planning:", err);
            setPlanning([]);
            setAppointments([]);
        }
    };

    const handleSelectMedecin = async (medecin: any) => {
        setSelectedMedecin(medecin);
        await fetchMedecinPlanning(medecin.id);
    };

    const getUpcomingAppointments = () => {
        return appointments.filter(appt => new Date(appt.dateHeure) >= new Date())
            .sort((a, b) => new Date(a.dateHeure).getTime() - new Date(b.dateHeure).getTime());
    };

    if (loading) return <div className="p-8 text-white">Chargement...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                            <Calendar className="h-10 w-10" />
                            Planification des Ressources
                        </h1>
                        <p className="text-gray-300">Gérer les horaires et disponibilités des médecins</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Medecins List */}
                    <Card className="lg:col-span-1 bg-white/10 backdrop-blur-md border-white/20 text-white">
                        <CardHeader>
                            <CardTitle>Médecins ({medecins.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                {medecins.length === 0 ? (
                                    <p className="text-gray-400 italic text-sm">Aucun médecin trouvé</p>
                                ) : (
                                    medecins.map((medecin) => (
                                        <div
                                            key={medecin.id}
                                            onClick={() => handleSelectMedecin(medecin)}
                                            className={`p-3 rounded-lg cursor-pointer transition-all ${selectedMedecin?.id === medecin.id
                                                    ? 'bg-teal-600/30 border border-teal-400'
                                                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                                                }`}
                                        >
                                            <p className="font-semibold flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                Dr. {medecin.prenom} {medecin.nom}
                                            </p>
                                            {medecin.specialite && (
                                                <p className="text-xs text-gray-400 mt-1">{medecin.specialite}</p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Planning Details */}
                    <Card className="lg:col-span-3 bg-white/10 backdrop-blur-md border-white/20 text-white">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                {selectedMedecin ? `Planning - Dr. ${selectedMedecin.prenom} ${selectedMedecin.nom}` : 'Sélectionnez un médecin'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {selectedMedecin ? (
                                <div className="space-y-6">
                                    {/* Availability/Planning */}
                                    <div>
                                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                            <Clock className="h-5 w-5 text-teal-400" />
                                            Disponibilités
                                        </h3>
                                        {planning.length === 0 ? (
                                            <div className="p-6 bg-white/5 rounded-lg border border-white/10 text-center">
                                                <p className="text-gray-400 italic mb-4">Aucune disponibilité définie</p>
                                                <Button className="gap-2">
                                                    <Plus className="h-4 w-4" />
                                                    Ajouter une Disponibilité
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {planning.map((slot, idx) => (
                                                    <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/10">
                                                        <p className="font-medium">{slot.jourSemaine || 'Jour non spécifié'}</p>
                                                        <p className="text-sm text-gray-400 mt-1">
                                                            {slot.heureDebut} - {slot.heureFin}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Upcoming Appointments */}
                                    <div>
                                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                            <Calendar className="h-5 w-5 text-blue-400" />
                                            Rendez-vous à venir ({getUpcomingAppointments().length})
                                        </h3>
                                        {getUpcomingAppointments().length === 0 ? (
                                            <p className="text-gray-400 italic text-sm p-4 bg-white/5 rounded-lg">
                                                Aucun rendez-vous prévu
                                            </p>
                                        ) : (
                                            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                                {getUpcomingAppointments().map((appt, idx) => (
                                                    <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/10">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <p className="font-medium">Patient #{appt.patientId}</p>
                                                                <p className="text-sm text-gray-400 mt-1">
                                                                    {new Date(appt.dateHeure).toLocaleString('fr-FR')}
                                                                </p>
                                                                {appt.motif && (
                                                                    <p className="text-sm text-gray-500 mt-1">{appt.motif}</p>
                                                                )}
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
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-400 italic text-center py-12">
                                    Sélectionnez un médecin pour voir son planning
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
