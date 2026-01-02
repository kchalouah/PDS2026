'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { notificationService } from '@/services';

export default function NotificationBell() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadNotifications = async () => {
        try {
            const userStr = localStorage.getItem('medinsight_user');
            if (!userStr) return;

            const user = JSON.parse(userStr);
            const data = await notificationService.getNotificationsByUser(user.id);

            setNotifications(data || []);
            setUnreadCount(data?.filter((n: any) => !n.isRead).length || 0);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: number) => {
        try {
            await notificationService.markAsRead(id);
            loadNotifications();
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const recentNotifications = notifications.slice(0, 5);

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                aria-label="Notifications"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {showDropdown && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowDropdown(false)}
                    ></div>

                    {/* Dropdown Content */}
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-boxdark rounded-lg shadow-lg border border-stroke dark:border-strokedark z-50">
                        <div className="p-4 border-b border-stroke dark:border-strokedark">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-black dark:text-white">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="px-2 py-1 text-xs font-medium bg-primary text-white rounded-full">
                                        {unreadCount} new
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {loading ? (
                                <div className="p-8 text-center">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : recentNotifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    <p className="mt-2 text-sm text-body-color">No notifications</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-stroke dark:divide-strokedark">
                                    {recentNotifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 hover:bg-gray-50 dark:hover:bg-meta-4 transition-colors cursor-pointer ${!notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                                                }`}
                                            onClick={() => {
                                                if (!notification.isRead) {
                                                    handleMarkAsRead(notification.id);
                                                }
                                                setShowDropdown(false);
                                                router.push('/notifications');
                                            }}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0">
                                                    {!notification.isRead && (
                                                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-black dark:text-white truncate">
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-xs text-body-color mt-1 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-body-color mt-1">
                                                        {new Date(notification.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {recentNotifications.length > 0 && (
                            <div className="p-3 border-t border-stroke dark:border-strokedark">
                                <Link
                                    href="/notifications"
                                    onClick={() => setShowDropdown(false)}
                                    className="block text-center text-sm font-medium text-primary hover:text-primary/80 transition"
                                >
                                    View all notifications →
                                </Link>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
