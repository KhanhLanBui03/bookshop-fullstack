package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.dto.response.NotificationResponse;
import com.fit.monolithic.backend.entity.Notification;
import com.fit.monolithic.backend.entity.User;
import com.fit.monolithic.backend.repository.NotificationRepository;
import com.fit.monolithic.backend.repository.UserRepository;
import com.fit.monolithic.backend.security.CustomUserDetails;
import com.fit.monolithic.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    public List<NotificationResponse> getMyNotifications(CustomUserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return notificationRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public long countUnread(CustomUserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    @Override
    public void markAsRead(Long id, CustomUserDetails userDetails) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (!notification.getUser().getEmail().equals(userDetails.getUsername())) {
            throw new RuntimeException("Access denied");
        }
        
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    public void markAllAsRead(CustomUserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Notification> unread = notificationRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().filter(n -> !n.isRead()).toList();
        
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    @Override
    public void createNotification(Long userId, String title, String content, String link) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .content(content)
                .link(link)
                .isRead(false)
                .build();
        
        notificationRepository.save(notification);
    }

    @Override
    public void createNotificationToAdmins(String title, String content, String link) {
        List<User> admins = userRepository.findByRoles_Name(com.fit.monolithic.backend.enums.RoleName.ROLE_ADMIN);
        
        List<Notification> notifications = admins.stream()
                .map(admin -> Notification.builder()
                        .user(admin)
                        .title(title)
                        .content(content)
                        .link(link)
                        .isRead(false)
                        .build())
                .toList();
        
        notificationRepository.saveAll(notifications);
    }

    private NotificationResponse mapToResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .title(n.getTitle())
                .content(n.getContent())
                .link(n.getLink())
                .isRead(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
