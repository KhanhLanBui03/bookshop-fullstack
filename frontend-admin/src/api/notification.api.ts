import axiosClient from "./axios";
import type { NotificationResponse } from "@/types/notification.type";

export const notificationApi = {
    getMyNotifications: async (): Promise<NotificationResponse[]> => {
        const res = await axiosClient.get("/notifications");
        return res.data.data;
    },

    getUnreadCount: async (): Promise<number> => {
        const res = await axiosClient.get("/notifications/unread-count");
        return res.data.data;
    },

    markAsRead: async (id: number): Promise<void> => {
        await axiosClient.patch(`/notifications/${id}/read`);
    },

    markAllAsRead: async (): Promise<void> => {
        await axiosClient.patch("/notifications/read-all");
    }
};
