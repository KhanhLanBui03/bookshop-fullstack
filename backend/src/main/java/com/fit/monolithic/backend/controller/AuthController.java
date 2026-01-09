package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.dto.request.LoginRequest;
import com.fit.monolithic.backend.dto.request.RefreshTokenRequest;
import com.fit.monolithic.backend.dto.request.RegisterRequest;
import com.fit.monolithic.backend.dto.response.LoginResponse;
import com.fit.monolithic.backend.dto.response.RegisterResponse;
import com.fit.monolithic.backend.dto.response.based.ApiResponse;
import com.fit.monolithic.backend.service.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Tag(name = "Authentication API", description = "Operations related to Authentication")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
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
    @PostMapping("/refresh-token")
    public ApiResponse<LoginResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return new ApiResponse<>(
                200,
                "Refresh success",
                authService.refreshToken(request.getRefreshToken())
        );
    }

}
