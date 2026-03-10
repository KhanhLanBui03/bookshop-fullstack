package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.dto.response.ProfileResponse;
import com.fit.monolithic.backend.dto.response.UserAdminResponse;
import com.fit.monolithic.backend.dto.response.UserDashboardStats;
import com.fit.monolithic.backend.dto.response.based.ApiResponse;
import com.fit.monolithic.backend.enums.AuthProvider;
import com.fit.monolithic.backend.security.CustomUserDetails;
import com.fit.monolithic.backend.service.UserService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Locale;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    @GetMapping("/profile")
    public ApiResponse<ProfileResponse> getProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return new ApiResponse<>(
                200,
                "Success",
                userService.getProfile(userDetails)
        );
    }
    @GetMapping("/admin/user-stats")
    public ApiResponse<UserDashboardStats> getAdminUserStats() {
        return new ApiResponse<>(
                200,
                "Success",
                userService.getDashboardOverview()
        );
    }
    @GetMapping("/admin/user-admin")
    public ApiResponse<Page<UserAdminResponse>>  getAllUserAdmins(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) AuthProvider authProvider,
            @PageableDefault(size = 10) Pageable pageable
    ){
        return new ApiResponse<>(
                200,
                "Success",
                userService.getAdminUser(
                        keyword,
                        role,
                        authProvider,
                        pageable)
        );
    }
}
