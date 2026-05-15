package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.dto.request.LoginRequest;
import com.fit.monolithic.backend.dto.request.RefreshTokenRequest;
import com.fit.monolithic.backend.dto.request.RegisterRequest;
import com.fit.monolithic.backend.dto.request.SocialLoginRequest;
import com.fit.monolithic.backend.dto.request.PasswordResetRequest;
import com.fit.monolithic.backend.dto.request.ResetPasswordRequest;
import com.fit.monolithic.backend.dto.response.LoginResponse;
import com.fit.monolithic.backend.dto.response.RegisterResponse;
import com.fit.monolithic.backend.dto.response.based.ApiResponse;
import com.fit.monolithic.backend.security.CustomUserDetails;
import com.fit.monolithic.backend.service.AuthService;
import com.fit.monolithic.backend.utils.JwtUtil;
import io.jsonwebtoken.Claims;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Tag(name = "Authentication API", description = "Operations related to Authentication")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final JwtUtil jwtUtil;
    @PostMapping("/register")
    public ApiResponse<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        return new ApiResponse<>(
                200,
                "Register success",
                authService.register(request)
        );
    }
    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        return new ApiResponse<>(
                200,
                "Login success",
                authService.login(request)
        );
    }
    @DeleteMapping("/logout")
    public void logout(@RequestParam String token) {
        authService.logout(token);
    }
    @GetMapping("/me")
    public ApiResponse<Map<String, Object>> me(
            @AuthenticationPrincipal CustomUserDetails userDetails
            ) {
        if (userDetails == null) {
            return new ApiResponse<>(401, "Unauthorized", null);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("userId", userDetails.getId());
        response.put("email", userDetails.getUsername());
        response.put("fullName", userDetails.getName());
        response.put("roles", userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList());

        return new ApiResponse<>(200, "Success", response);
    }



    @PostMapping("/refresh-token")
    public ApiResponse<LoginResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return new ApiResponse<>(
                200,
                "Refresh success",
                authService.refreshToken(request.getRefreshToken())
        );
    }

    @PostMapping("/google-login")
    public ApiResponse<LoginResponse> googleLogin(@RequestBody SocialLoginRequest request) {
        return new ApiResponse<>(
                200,
                "Google login success",
                authService.loginWithGoogle(request.getToken())
        );
    }

    @PostMapping("/forgot-password")
    public ApiResponse<Void> forgotPassword(@Valid @RequestBody PasswordResetRequest request) {
        authService.forgotPassword(request.getEmail());
        return new ApiResponse<>(200, "Reset link has been sent to your email", null);
    }

    @PostMapping("/reset-password")
    public ApiResponse<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getToken(), request.getNewPassword());
        return new ApiResponse<>(200, "Password has been reset successfully", null);
    }
}
