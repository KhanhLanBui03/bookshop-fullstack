package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.dto.request.LoginRequest;
import com.fit.monolithic.backend.dto.request.RefreshTokenRequest;
import com.fit.monolithic.backend.dto.request.RegisterRequest;
import com.fit.monolithic.backend.dto.response.LoginResponse;
import com.fit.monolithic.backend.dto.response.RegisterResponse;
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
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        RegisterResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/refresh-token")
    public LoginResponse refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return authService.refreshToken(request.getRefreshToken());
    }

}
