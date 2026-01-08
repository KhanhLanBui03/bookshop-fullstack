package com.fit.monolithic.backend.service;

import com.fit.monolithic.backend.dto.request.LoginRequest;
import com.fit.monolithic.backend.dto.request.RegisterRequest;
import com.fit.monolithic.backend.dto.response.LoginResponse;
import com.fit.monolithic.backend.dto.response.RegisterResponse;

public interface AuthService {
    LoginResponse login(LoginRequest loginRequest);
    LoginResponse refreshToken(String refreshToken);
    RegisterResponse register(RegisterRequest registerRequest);
}
