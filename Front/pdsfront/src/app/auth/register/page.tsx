"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, User, Mail, MapPin, Phone, Calendar, Heart, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"

const formSchema = z.object({
    username: z.string().min(3, "Le nom d'utilisateur doit comporter au moins 3 caractères"),
    nom: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
    prenom: z.string().min(2, "Le prénom doit comporter au moins 2 caractères"),
    email: z.string().email("Adresse email invalide"),
    password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères"),
    dateNaissance: z.string().refine((val) => !isNaN(Date.parse(val)), "Date invalide"),
    gender: z.enum(["M", "F", "OTHER"]),
    telephone: z.string().min(8, "Le numéro de téléphone est requis"),
    emergencyContact: z.string().min(8, "Le contact d'urgence est requis"),
    // Address
    rue: z.string().min(3, "La rue est requise"),
    ville: z.string().min(2, "La ville est requise"),
    codePostal: z.string().min(4, "Le code postal est requis"),
    pays: z.string().min(2, "Le pays est requis"),
})

export default function RegisterPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            nom: "",
            prenom: "",
            email: "",
            password: "",
            dateNaissance: "",
            telephone: "",
            emergencyContact: "",
            rue: "",
            ville: "",
            codePostal: "",
            pays: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            // Transform flat form data to API expected structure
            const payload = {
                username: values.username,
                nom: values.nom,
                prenom: values.prenom,
                email: values.email,
                password: values.password,
                dateNaissance: values.dateNaissance,
                gender: values.gender,
                contactUrgence: values.emergencyContact, // Adjust field name if backend differs, strictly following prompt "match models"
                emergencyContact: values.emergencyContact,
                telephone: values.telephone,
                rue: values.rue,
                ville: values.ville,
                codePostal: values.codePostal,
                pays: values.pays
            }

            const response = await axios.post('/api/auth/register', payload);

            if (response.data.success) {
                toast({
                    title: "Compte créé !",
                    description: "Votre inscription est réussie. Veuillez vous connecter.",
                })
                router.push('/auth/login')
            }

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Échec de l'inscription",
                description: error.response?.data?.error || "Impossible de créer le compte. Veuillez réessayer.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6 py-6">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-white">Créer un compte</h1>
                <p className="text-gray-400">Rejoignez MedInsight en tant que Patient</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="prenom"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Prénom</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Jean" className="bg-white/5 border-white/10 text-white" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="nom"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Nom</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Dupont" className="bg-white/5 border-white/10 text-white" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-300">Nom d'utilisateur</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                                        <Input placeholder="jeandupont" className="pl-10 bg-white/5 border-white/10 text-white" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-300">Email</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                                        <Input placeholder="jean.dupont@exemple.com" className="pl-10 bg-white/5 border-white/10 text-white" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-300">Mot de passe</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                        <Input type="password" placeholder="••••••••" className="pl-10 bg-white/5 border-white/10 text-white" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="dateNaissance"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Date de Naissance</FormLabel>
                                    <FormControl>
                                        <Input type="date" className="bg-white/5 border-white/10 text-white" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Genre</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                                <SelectValue placeholder="Sélectionner" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="M">Homme</SelectItem>
                                            <SelectItem value="F">Femme</SelectItem>
                                            <SelectItem value="OTHER">Autre</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="telephone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Téléphone</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                            <Input placeholder="+33 6 12 34 56 78" className="pl-9 bg-white/5 border-white/10 text-white" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="emergencyContact"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300">Contact d'Urgence</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Heart className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                            <Input placeholder="+33 6 98 76 54 32" className="pl-9 bg-white/5 border-white/10 text-white" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> Adresse
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="rue"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormControl>
                                            <Input placeholder="Rue / Adresse" className="bg-white/5 border-white/10 text-white" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="ville"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Ville" className="bg-white/5 border-white/10 text-white" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="codePostal"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Code Postal" className="bg-white/5 border-white/10 text-white" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="pays"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormControl>
                                            <Input placeholder="Pays" className="bg-white/5 border-white/10 text-white" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4" type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Créer un compte
                    </Button>
                </form>
            </Form>

            <div className="text-center text-sm text-gray-400">
                Vous avez déjà un compte ?{" "}
                <Link href="/auth/login" className="font-semibold text-blue-400 hover:text-blue-300">
                    Se connecter
                </Link>
            </div>
        </div>
    )
}
