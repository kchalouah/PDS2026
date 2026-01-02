import { api } from './apiConfig';

export const notificationService = {
    getNotificationsByUser: async (userId: number) => {
        const response = await api.get(`/api/notifications/user/${userId}`);
        return response.data;
    },

    markAsRead: async (notificationId: number) => {
        const response = await api.put(`/api/notifications/${notificationId}/read`);
        return response.data;
    },

    markAllAsRead: async (userId: number) => {
        const response = await api.put(`/api/notifications/user/${userId}/read-all`);
        return response.data;
    },

    deleteNotification: async (notificationId: number) => {
        const response = await api.delete(`/api/notifications/${notificationId}`);
        return response.data;
    },

    sendEmail: async (to: string, subject: string, body: string) => {
        const response = await api.post('/api/notifications/email', { to, subject, body });
        return response.data;
    },
};
