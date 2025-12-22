'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { notificationService } from '@/services';
import { toast, Toaster } from 'react-hot-toast';

export default function NotificationsPage() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            const userStr = localStorage.getItem('medinsight_user');
            if (!userStr) {
                router.push('/signin');
                return;
            }
            const user = JSON.parse(userStr);

            const data = await notificationService.getNotificationsByUser(user.id);
            setNotifications(data || []);
        } catch (error) {
            console.error('Error loading notifications:', error);
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: number) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, isRead: true } : n
            ));
            toast.success('Marked as read');
        } catch (error) {
            console.error('Error marking as read:', error);
            toast.error('Failed to mark as read');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const userStr = localStorage.getItem('medinsight_user');
            if (!userStr) return;
            const user = JSON.parse(userStr);

            await notificationService.markAllAsRead(user.id);
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            toast.success('All notifications marked as read');
        } catch (error) {
            console.error('Error marking all as read:', error);
            toast.error('Failed to mark all as read');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this notification?')) return;
        try {
            await notificationService.deleteNotification(id);
            setNotifications(notifications.filter(n => n.id !== id));
            toast.success('Notification deleted');
        } catch (error) {
            console.error('Error deleting notification:', error);
            toast.error('Failed to delete notification');
        }
    };

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.isRead)
        : notifications;

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'APPOINTMENT':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                );
            case 'PRESCRIPTION':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            case 'ALERT':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'APPOINTMENT':
                return 'bg-blue-100 text-blue-600';
            case 'PRESCRIPTION':
                return 'bg-green-100 text-green-600';
            case 'ALERT':
                return 'bg-red-100 text-red-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <section className="pb-12 pt-24 lg:pb-24 lg:pt-32 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4">
                <Toaster />

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-black dark:text-white">Notifications</h1>
                        <p className="text-body-color mt-2">Stay updated with your health activities</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleMarkAllAsRead}
                            className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition"
                        >
                            Mark all as read
                        </button>
                        <Link
                            href="/patient/dashboard"
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                        >
                            ← Back
                        </Link>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="mb-6 border-b border-stroke dark:border-strokedark">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setFilter('all')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${filter === 'all'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-body-color hover:text-black hover:border-gray-300'
                                }`}
                        >
                            All ({notifications.length})
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${filter === 'unread'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-body-color hover:text-black hover:border-gray-300'
                                }`}
                        >
                            Unread ({notifications.filter(n => !n.isRead).length})
                        </button>
                    </nav>
                </div>

                {/* Notifications List */}
                <div className="space-y-4">
                    {filteredNotifications.length === 0 ? (
                        <div className="bg-white dark:bg-boxdark rounded-xl border border-stroke dark:border-strokedark p-12 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium text-black dark:text-white">No notifications</h3>
                            <p className="mt-2 text-sm text-body-color">
                                {filter === 'unread' ? "You're all caught up!" : "You don't have any notifications yet."}
                            </p>
                        </div>
                    ) : (
                        filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`bg-white dark:bg-boxdark rounded-xl border border-stroke dark:border-strokedark p-6 transition-all hover:shadow-md ${!notification.isRead ? 'border-l-4 border-l-primary' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-full ${getNotificationColor(notification.type)}`}>
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-base font-semibold text-black dark:text-white">
                                                    {notification.title}
                                                </h3>
                                                <p className="text-sm text-body-color mt-1">
                                                    {notification.message}
                                                </p>
                                            </div>
                                            {!notification.isRead && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
                                                    New
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between mt-4">
                                            <p className="text-xs text-body-color">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </p>
                                            <div className="flex items-center gap-3">
                                                {!notification.isRead && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                        className="text-sm text-primary hover:text-primary/80 font-medium"
                                                    >
                                                        Mark as read
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(notification.id)}
                                                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
