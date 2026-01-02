import React from 'react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-black text-white">
            {/* Left: Content */}
            <div className="flex items-center justify-center p-8 lg:p-12 relative z-10">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px] [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none" />
                <div className="w-full max-w-[450px]">
                    {children}
                </div>
            </div>

            {/* Right: Visual */}
            <div className="hidden lg:flex relative bg-neutral-900 border-l border-white/10 overflow-hidden flex-col justify-between p-12">
                <div className="absolute inset-0">
                    <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-blue-600 rounded-full blur-[150px] opacity-20" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600 rounded-full blur-[150px] opacity-20" />
                </div>

                <div className="relative z-10">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">MedInsight</h2>
                </div>

                <div className="relative z-10 space-y-6">
                    <blockquote className="text-2xl font-medium leading-snug text-gray-200">
                        "L'intégration de l'IA dans notre flux de travail quotidien a révolutionné la façon dont nous traitons les patients. MedInsight est tout simplement essentiel."
                    </blockquote>
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500"></div>
                        <div>
                            <div className="font-semibold">Dr. Sarah Connors</div>
                            <div className="text-sm text-gray-500">Chef de Cardiologie</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
