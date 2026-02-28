package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.dto.response.ProfileResponse;
import com.fit.monolithic.backend.dto.response.based.ApiResponse;
import com.fit.monolithic.backend.security.CustomUserDetails;
import com.fit.monolithic.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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
}
