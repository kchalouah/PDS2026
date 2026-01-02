"use client"

import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import api from "@/lib/api"
import { Patient } from "@/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { User, Activity, Calendar, MapPin, Phone } from "lucide-react"

export default function PatientDashboard() {
    const [patient, setPatient] = useState<Patient | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError("Non authentifié");
                    setLoading(false);
                    return;
                }

                const decoded: any = jwtDecode(token);
                const userId = decoded.sub; // Keycloak uses 'sub' for User ID

                // Use the configured API client which handles the base URL (Gateway)
                // Ensure Gateway routes /api/patients correctly.
                const response = await api.get(`/api/patients/user/${userId}`);
                setPatient(response.data);
            } catch (err: any) {
                console.error("Error fetching patient:", err);
                setError("Impossible de charger les données du patient. Vérifiez la connexion au backend.");
            } finally {
                setLoading(false);
            }
        };

        fetchPatientData();
    }, []);

    if (loading) return <div className="p-8 text-white">Chargement...</div>;
    if (error) return <div className="p-8 text-red-500">Erreur: {error}</div>;

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold mb-4 text-white">Tableau de Bord Patient</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="bg-white/5 border-white/10 text-white">
                    <CardHeader className="flex flex-row items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <CardTitle>{patient?.prenom} {patient?.nom}</CardTitle>
                            <CardDescription className="text-gray-400">Patient</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Activity className="h-4 w-4 text-blue-400" />
                            <span>{patient?.gender === 'M' ? 'Homme' : 'Femme'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Calendar className="h-4 w-4 text-blue-400" />
                            <span>{patient?.profile?.dateNaissance}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Phone className="h-4 w-4 text-blue-400" />
                            <span>{patient?.profile?.telephone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <MapPin className="h-4 w-4 text-blue-400" />
                            <span>{patient?.profile?.adresse?.ville}, {patient?.profile?.adresse?.pays}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Coming Soon / Stats */}
                <Card className="bg-white/5 border-white/10 text-white">
                    <CardHeader>
                        <CardTitle>Mes Rendez-vous</CardTitle>
                        <CardDescription className="text-gray-400">Prochains rendez-vous médicaux</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-500 italic">Aucun rendez-vous prévu.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
