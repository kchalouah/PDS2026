import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Activity, ShieldCheck, HeartPulse } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500 selection:text-white overflow-hidden">
      {/* Background Gradient/Mesh */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[150px] opacity-30 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[150px] opacity-30 animate-pulse delay-700" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-500" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              MedInsight
            </span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm text-gray-300">
            <Link href="/" className="hover:text-white transition-colors">Fonctionnalités</Link>
            <Link href="/" className="hover:text-white transition-colors">Services</Link>
            <Link href="/" className="hover:text-white transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                Se connecter
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
                Commencer
              </Button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-6 py-20 md:py-32 flex flex-col items-center text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-300 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Plateforme de Santé Nouvelle Génération
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
            Le Futur de la <span className="text-blue-500">Santé</span> est Ici.
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
            Gestion avancée des patients, diagnostics assistés par IA, et collaboration fluide entre professionnels de santé. Découvrez la différence MedInsight.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="h-12 px-8 text-lg bg-white text-black hover:bg-gray-200 rounded-full w-full sm:w-auto">
                Rejoignez-nous <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-white/20 text-white hover:bg-white/10 hover:text-white rounded-full w-full sm:w-auto bg-transparent">
                Espace Patient
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Preview */}
        <section className="px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="bg-white/5 border-white/10 backdrop-blur-md text-gray-100 hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <ShieldCheck className="h-10 w-10 text-green-400 mb-2" />
                <CardTitle>Sécurisé et Privé</CardTitle>
                <CardDescription className="text-gray-400">Sécurité de niveau entreprise protégeant vos données médicales sensibles.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-white/5 border-white/10 backdrop-blur-md text-gray-100 hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <Activity className="h-10 w-10 text-blue-400 mb-2" />
                <CardTitle>Analytique IA</CardTitle>
                <CardDescription className="text-gray-400">Insights prédictifs pour assister les médecins dans les diagnostics et traitements.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-white/5 border-white/10 backdrop-blur-md text-gray-100 hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <HeartPulse className="h-10 w-10 text-pink-400 mb-2" />
                <CardTitle>Centré Patient</CardTitle>
                <CardDescription className="text-gray-400">Accès facile à votre historique médical, rendez-vous et prescriptions.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
