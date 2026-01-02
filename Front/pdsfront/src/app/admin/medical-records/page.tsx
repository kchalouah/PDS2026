"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Search, Plus, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function AdminMedicalRecordsPage() {
    const [dossiers, setDossiers] = useState<any[]>([])
    const [selectedDossier, setSelectedDossier] = useState<any>(null)
    const [diagnostics, setDiagnostics] = useState<any[]>([])
    const [prescriptions, setPrescriptions] = useState<any[]>([])
    const [reports, setReports] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState("")
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
            fetchDossiers();
        }
    }, [router]);

    const fetchDossiers = async () => {
        try {
            const response = await api.get('/dossiers');
            setDossiers(response.data || []);
        } catch (err) {
            console.error("Error fetching dossiers:", err);
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de charger les dossiers"
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchDossierDetails = async (dossierId: number) => {
        try {
            // Fetch diagnostics
            const diagResponse = await api.get(`/medecins/diagnostics/dossier/${dossierId}`);
            setDiagnostics(diagResponse.data || []);

            // Fetch prescriptions
            const prescResponse = await api.get(`/medecins/prescriptions/dossier/${dossierId}`);
            setPrescriptions(prescResponse.data || []);

            // Fetch reports
            const reportResponse = await api.get(`/medecins/reports/dossier/${dossierId}`);
            setReports(reportResponse.data || []);
        } catch (err) {
            console.error("Error fetching dossier details:", err);
        }
    };

    const handleViewDossier = async (dossier: any) => {
        setSelectedDossier(dossier);
        await fetchDossierDetails(dossier.id);
    };

    const filteredDossiers = dossiers.filter(d =>
        d.patientNom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.patientId?.toString().includes(searchQuery)
    );

    if (loading) return <div className="p-8 text-white">Chargement...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                            <FileText className="h-10 w-10" />
                            Dossiers Médicaux
                        </h1>
                        <p className="text-gray-300">Consulter et gérer les dossiers patients</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Dossiers List */}
                    <Card className="lg:col-span-1 bg-white/10 backdrop-blur-md border-white/20 text-white">
                        <CardHeader>
                            <CardTitle>Liste des Dossiers</CardTitle>
                            <div className="relative mt-4">
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Rechercher un patient..."
                                    className="pl-10 bg-white/5 border-white/10 text-white"
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                {filteredDossiers.length === 0 ? (
                                    <p className="text-gray-400 italic text-sm">Aucun dossier trouvé</p>
                                ) : (
                                    filteredDossiers.map((dossier) => (
                                        <div
                                            key={dossier.id}
                                            onClick={() => handleViewDossier(dossier)}
                                            className={`p-4 rounded-lg cursor-pointer transition-all ${selectedDossier?.id === dossier.id
                                                    ? 'bg-purple-600/30 border border-purple-400'
                                                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                                                }`}
                                        >
                                            <p className="font-semibold">Patient #{dossier.patientId}</p>
                                            <p className="text-sm text-gray-400">Dossier #{dossier.id}</p>
                                            {dossier.dateCreation && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(dossier.dateCreation).toLocaleDateString('fr-FR')}
                                                </p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dossier Details */}
                    <Card className="lg:col-span-2 bg-white/10 backdrop-blur-md border-white/20 text-white">
                        <CardHeader>
                            <CardTitle>
                                {selectedDossier ? `Détails du Dossier #${selectedDossier.id}` : 'Sélectionnez un dossier'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {selectedDossier ? (
                                <div className="space-y-6">
                                    {/* Diagnostics */}
                                    <div>
                                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-blue-400" />
                                            Diagnostics ({diagnostics.length})
                                        </h3>
                                        {diagnostics.length === 0 ? (
                                            <p className="text-gray-400 italic text-sm">Aucun diagnostic</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {diagnostics.map((diag, idx) => (
                                                    <div key={idx} className="p-3 bg-white/5 rounded-lg border border-white/10">
                                                        <p className="font-medium">{diag.description}</p>
                                                        <p className="text-sm text-gray-400 mt-1">
                                                            {diag.dateDiagnostic && new Date(diag.dateDiagnostic).toLocaleDateString('fr-FR')}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Prescriptions */}
                                    <div>
                                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-green-400" />
                                            Prescriptions ({prescriptions.length})
                                        </h3>
                                        {prescriptions.length === 0 ? (
                                            <p className="text-gray-400 italic text-sm">Aucune prescription</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {prescriptions.map((presc, idx) => (
                                                    <div key={idx} className="p-3 bg-white/5 rounded-lg border border-white/10">
                                                        <p className="font-medium">{presc.medicament}</p>
                                                        <p className="text-sm text-gray-400">
                                                            Posologie: {presc.posologie}
                                                        </p>
                                                        <p className="text-sm text-gray-400">
                                                            Durée: {presc.duree}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Reports */}
                                    <div>
                                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-purple-400" />
                                            Rapports Médicaux ({reports.length})
                                        </h3>
                                        {reports.length === 0 ? (
                                            <p className="text-gray-400 italic text-sm">Aucun rapport</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {reports.map((report, idx) => (
                                                    <div key={idx} className="p-3 bg-white/5 rounded-lg border border-white/10">
                                                        <p className="font-medium">{report.titre || 'Rapport médical'}</p>
                                                        <p className="text-sm text-gray-300 mt-2">{report.contenu}</p>
                                                        <p className="text-xs text-gray-500 mt-2">
                                                            {report.dateCreation && new Date(report.dateCreation).toLocaleDateString('fr-FR')}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-400 italic text-center py-12">
                                    Sélectionnez un dossier dans la liste pour voir ses détails
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
