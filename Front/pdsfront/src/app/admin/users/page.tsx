"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, UserPlus, Trash2, Shield } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddUser, setShowAddUser] = useState(false)
    const [newUser, setNewUser] = useState({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        role: "PATIENT"
    })
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
            if (user.role !== 'ADMIN') {
                router.push('/admin/dashboard');
                return false;
            }
            return true;
        };

        if (checkAuth()) {
            fetchUsers();
        }
    }, [router]);

    const fetchUsers = async () => {
        try {
            // In a real implementation, this would fetch from Keycloak Admin API
            // For now, we'll show a placeholder
            setUsers([]);
            toast({
                title: "Info",
                description: "User list from Keycloak will be loaded here"
            });
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async () => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });

            if (response.ok) {
                toast({
                    title: "Succès",
                    description: "Utilisateur créé avec succès"
                });
                setShowAddUser(false);
                setNewUser({
                    username: "",
                    email: "",
                    password: "",
                    firstName: "",
                    lastName: "",
                    role: "PATIENT"
                });
                fetchUsers();
            } else {
                const data = await response.json();
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: data.error || "Échec de création"
                });
            }
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Erreur lors de la création"
            });
        }
    };

    if (loading) return <div className="p-8 text-white">Chargement...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                            <Users className="h-10 w-10" />
                            Gestion des Utilisateurs
                        </h1>
                        <p className="text-gray-300">Créer et gérer les utilisateurs du système</p>
                    </div>
                    <Button onClick={() => setShowAddUser(!showAddUser)} className="gap-2">
                        <UserPlus className="h-5 w-5" />
                        Nouvel Utilisateur
                    </Button>
                </div>

                {showAddUser && (
                    <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                        <CardHeader>
                            <CardTitle>Créer un Utilisateur</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-300 mb-2 block">Nom d'utilisateur</label>
                                    <Input
                                        value={newUser.username}
                                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                        placeholder="johndoe"
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-300 mb-2 block">Email</label>
                                    <Input
                                        type="email"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        placeholder="john@example.com"
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-300 mb-2 block">Prénom</label>
                                    <Input
                                        value={newUser.firstName}
                                        onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                                        placeholder="John"
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-300 mb-2 block">Nom</label>
                                    <Input
                                        value={newUser.lastName}
                                        onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                                        placeholder="Doe"
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-300 mb-2 block">Mot de passe</label>
                                    <Input
                                        type="password"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                        placeholder="••••••••"
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-300 mb-2 block">Rôle</label>
                                    <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PATIENT">Patient</SelectItem>
                                            <SelectItem value="MEDECIN">Médecin</SelectItem>
                                            <SelectItem value="ADMIN">Administrateur</SelectItem>
                                            <SelectItem value="MANAGER">Manager</SelectItem>
                                            <SelectItem value="SECURITY_OFFICER">Responsable Sécurité</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <Button onClick={handleCreateUser} className="flex-1">
                                    Créer l'Utilisateur
                                </Button>
                                <Button onClick={() => setShowAddUser(false)} variant="outline" className="flex-1">
                                    Annuler
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                    <CardHeader>
                        <CardTitle>Liste des Utilisateurs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {users.length === 0 ? (
                            <p className="text-gray-400 italic">Aucun utilisateur trouvé. Créez-en un nouveau ci-dessus.</p>
                        ) : (
                            <div className="space-y-2">
                                {users.map((user, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                                        <div>
                                            <p className="font-semibold">{user.username}</p>
                                            <p className="text-sm text-gray-400">{user.email}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm">
                                                {user.role}
                                            </span>
                                            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
