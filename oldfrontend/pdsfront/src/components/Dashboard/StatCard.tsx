import { ReactNode } from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    bgColor: string;
    iconColor: string;
    trend?: {
        value: string;
        isPositive: boolean;
    };
}

export default function StatCard({ title, value, icon, bgColor, iconColor, trend }: StatCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                    {trend && (
                        <div className="flex items-center mt-2">
                            <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {trend.isPositive ? '↑' : '↓'} {trend.value}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">vs mois dernier</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 ${bgColor} rounded-full`}>
                    <div className={iconColor}>
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    );
}
