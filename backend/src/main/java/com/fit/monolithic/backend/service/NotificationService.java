package com.fit.monolithic.backend.service;

import com.fit.monolithic.backend.dto.response.NotificationResponse;
import com.fit.monolithic.backend.security.CustomUserDetails;

import java.util.List;

public interface NotificationService {
    List<NotificationResponse> getMyNotifications(CustomUserDetails userDetails);
    long countUnread(CustomUserDetails userDetails);
    void markAsRead(Long id, CustomUserDetails userDetails);
    void markAllAsRead(CustomUserDetails userDetails);
    void createNotification(Long userId, String title, String content, String link);
    void createNotificationToAdmins(String title, String content, String link);
}
