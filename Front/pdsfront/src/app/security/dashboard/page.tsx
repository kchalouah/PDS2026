"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Shield, AlertTriangle, Activity, Lock, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SecurityDashboard() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchSecurityData = async () => {
            try {
                const token = localStorage.getItem('medinsight_token');
                const userData = localStorage.getItem('medinsight_user');

                if (!token || !userData) {
                    setError("Non authentifié");
                    router.push('/auth/login');
                    return;
                }

                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);

            } catch (err: any) {
                console.error("Error:", err);
                setError("Impossible de charger les données");
            } finally {
                setLoading(false);
            }
        };

        fetchSecurityData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('medinsight_token');
        localStorage.removeItem('medinsight_user');
        router.push('/auth/login');
    };

    if (loading) return <div className="p-8 text-white">Chargement...</div>;
    if (error) return <div className="p-8 text-red-500">Erreur: {error}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Tableau de Bord Sécurité</h1>
                        <p className="text-gray-300">Responsable Sécurité - {user?.username}</p>
                    </div>
                    <Button onClick={handleLogout} variant="outline" className="gap-2">
                        <LogOut className="h-4 w-4" />
                        Déconnexion
                    </Button>
                </div>

                {/* Security Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Système</CardTitle>
                            <Shield className="h-5 w-5 text-green-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-400">Sécurisé</div>
                            <p className="text-xs text-gray-400 mt-1">État du système</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Alertes</CardTitle>
                            <AlertTriangle className="h-5 w-5 text-yellow-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">0</div>
                            <p className="text-xs text-gray-400 mt-1">Alertes actives</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
                            <Activity className="h-5 w-5 text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">-</div>
                            <p className="text-xs text-gray-400 mt-1">Sessions actives</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Accès</CardTitle>
                            <Lock className="h-5 w-5 text-purple-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">-</div>
                            <p className="text-xs text-gray-400 mt-1">Tentatives suspectes</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Security Tools */}
                <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                    <CardHeader>
                        <CardTitle className="text-2xl">Outils de Sécurité</CardTitle>
                        <CardDescription className="text-gray-300">Gestion de la sécurité du système</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Button className="h-24 text-lg bg-red-600 hover:bg-red-700">
                                Audit Logs
                            </Button>
                            <Button className="h-24 text-lg bg-orange-600 hover:bg-orange-700">
                                Gestion des Accès
                            </Button>
                            <Button className="h-24 text-lg bg-yellow-600 hover:bg-yellow-700">
                                Monitoring
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                    <CardHeader>
                        <CardTitle className="text-2xl">Activité Récente</CardTitle>
                        <CardDescription className="text-gray-300">Journal des événements de sécurité</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-400 italic">Aucune activité anormale détectée</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
