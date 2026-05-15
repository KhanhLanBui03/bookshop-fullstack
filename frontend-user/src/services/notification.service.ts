import { notificationApi } from "@/api/notification.api";
import type { NotificationResponse } from "@/types/Notification";

export const notificationService = {
    async getAll(): Promise<NotificationResponse[]> {
        const res = await notificationApi.getAll();
        return res.data.data;
    },
    async getUnreadCount(): Promise<number> {
        const res = await notificationApi.getUnreadCount();
        return res.data.data;
    },
    async markAsRead(id: number): Promise<void> {
        await notificationApi.markAsRead(id);
    },
    async markAllAsRead(): Promise<void> {
        await notificationApi.markAllAsRead();
    }
}
