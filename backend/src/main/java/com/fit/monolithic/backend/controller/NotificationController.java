package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.dto.response.NotificationResponse;
import com.fit.monolithic.backend.dto.response.based.ApiResponse;
import com.fit.monolithic.backend.security.CustomUserDetails;
import com.fit.monolithic.backend.service.NotificationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "Notification APIs", description = "Operations related to notifications")
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ApiResponse<List<NotificationResponse>> getMyNotifications(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return new ApiResponse<>(200, "Success", notificationService.getMyNotifications(userDetails));
    }

    @GetMapping("/unread-count")
    public ApiResponse<Long> countUnread(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return new ApiResponse<>(200, "Success", notificationService.countUnread(userDetails));
    }

    @PatchMapping("/{id}/read")
    public ApiResponse<Void> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        notificationService.markAsRead(id, userDetails);
        return new ApiResponse<>(200, "Success", null);
    }

    @PatchMapping("/read-all")
    public ApiResponse<Void> markAllAsRead(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        notificationService.markAllAsRead(userDetails);
        return new ApiResponse<>(200, "Success", null);
    }
}
