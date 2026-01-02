"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { User, BarChart3, TrendingUp, Users, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ManagerDashboard() {
    const [manager, setManager] = useState<any>(null)
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchManagerData = async () => {
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

                // Fetch manager data
                try {
                    const response = await api.get(`/managers/user/${userId}`);
                    setManager(response.data);
                } catch (apiErr: any) {
                    console.error("API Error:", apiErr);
                    setManager({
                        id: userId,
                        nom: user.username,
                        prenom: user.username,
                        email: user.email || ""
                    });
                }

                // Fetch system stats
                try {
                    const statsResponse = await api.get('/gestion/stats');
                    setStats(statsResponse.data);
                } catch (err) {
                    setStats({
                        totalPatients: 0,
                        totalDoctors: 0,
                        activeConsultations: 0,
                        occupancyRate: 0
                    });
                }

            } catch (err: any) {
                console.error("Error:", err);
                setError("Impossible de charger les données");
            } finally {
                setLoading(false);
            }
        };

        fetchManagerData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('medinsight_token');
        localStorage.removeItem('medinsight_user');
        router.push('/auth/login');
    };

    if (loading) return <div className="p-8 text-white">Chargement...</div>;
    if (error) return <div className="p-8 text-red-500">Erreur: {error}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Tableau de Bord Manager</h1>
                        <p className="text-gray-300">Bonjour, {manager?.prenom} {manager?.nom}</p>
                    </div>
                    <Button onClick={handleLogout} variant="outline" className="gap-2">
                        <LogOut className="h-4 w-4" />
                        Déconnexion
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Patients</CardTitle>
                            <Users className="h-5 w-5 text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats?.totalPatients || 0}</div>
                            <p className="text-xs text-gray-400 mt-1">Total enregistrés</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Médecins</CardTitle>
                            <User className="h-5 w-5 text-green-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats?.totalDoctors || 0}</div>
                            <p className="text-xs text-gray-400 mt-1">Personnel médical</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Consultations</CardTitle>
                            <BarChart3 className="h-5 w-5 text-purple-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats?.activeConsultations || 0}</div>
                            <p className="text-xs text-gray-400 mt-1">Actives</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Occupation</CardTitle>
                            <TrendingUp className="h-5 w-5 text-orange-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats?.occupancyRate || 0}%</div>
                            <p className="text-xs text-gray-400 mt-1">Taux actuel</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Management Tools */}
                <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                    <CardHeader>
                        <CardTitle className="text-2xl">Outils de Gestion</CardTitle>
                        <CardDescription className="text-gray-300">Accès rapide aux fonctionnalités de gestion</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Button className="h-24 text-lg bg-blue-600 hover:bg-blue-700">
                                Rapports Statistiques
                            </Button>
                            <Button className="h-24 text-lg bg-green-600 hover:bg-green-700">
                                Gestion des Ressources
                            </Button>
                            <Button className="h-24 text-lg bg-purple-600 hover:bg-purple-700">
                                Planification
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
