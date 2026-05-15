import axiosClient from "./axios";

export const notificationApi = {
    getAll() {
        return axiosClient.get("/notifications");
    },
    getUnreadCount() {
        return axiosClient.get("/notifications/unread-count");
    },
    markAsRead(id: number) {
        return axiosClient.patch(`/notifications/${id}/read`);
    },
    markAllAsRead() {
        return axiosClient.patch("/notifications/read-all");
    }
}
