"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"

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
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/AuthContext"
import { Role } from "@/types"

const formSchema = z.object({
    username: z.string().min(1, {
        message: "Le nom d'utilisateur est requis.",
    }),
    password: z.string().min(1, {
        message: "Le mot de passe est requis.",
    }),
})

export default function LoginPage() {
    const router = useRouter()
    const { toast } = useToast()
    const { login } = useAuth()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            await login(values.username, values.password)

            toast({
                title: "Connexion réussie",
                description: "Vous êtes maintenant connecté.",
            })

            // Determine redirect based on role
            const storedUser = localStorage.getItem('medinsight_user');
            let roleName = "PATIENT";
            if (storedUser) {
                try {
                    const u = JSON.parse(storedUser);
                    roleName = u.role || "PATIENT";
                } catch (e) { }
            }

            // Normalize role check
            if (roleName === 'ADMIN' || roleName === Role.ADMIN.toString()) {
                router.push("/admin/dashboard")
            } else if (roleName === 'MEDECIN' || roleName === Role.MEDECIN.toString()) {
                router.push("/medecin/dashboard")
            } else {
                router.push("/patient/dashboard")
            }

        } catch (error: any) {
            console.error("Login Error:", error);
            toast({
                variant: "destructive",
                title: "Erreur de connexion",
                description: error.message || "Identifiants invalides.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex flex-col space-y-2 text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-white">Connexion</h1>
                <p className="text-sm text-gray-400">
                    Entrez vos identifiants pour accéder à votre compte
                </p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Nom d'utilisateur</FormLabel>
                                <FormControl>
                                    <Input placeholder="jeandupont" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
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
                                <FormLabel className="text-white">Mot de passe</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Connexion...
                            </>
                        ) : (
                            "Se connecter"
                        )}
                    </Button>
                </form>
            </Form>
            <div className="mt-6 text-center text-sm">
                <p className="text-gray-400">
                    Pas encore de compte ?{" "}
                    <Link href="/auth/register" className="font-semibold text-white hover:underline">
                        S'inscrire
                    </Link>
                </p>
            </div>
        </div>
    )
}
