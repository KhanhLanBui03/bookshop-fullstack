package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.dto.request.LoginRequest;
import com.fit.monolithic.backend.dto.request.RegisterRequest;
import com.fit.monolithic.backend.dto.response.LoginResponse;
import com.fit.monolithic.backend.dto.response.RegisterResponse;
import com.fit.monolithic.backend.entity.PasswordResetToken;
import com.fit.monolithic.backend.entity.RefreshToken;
import com.fit.monolithic.backend.entity.Role;
import com.fit.monolithic.backend.entity.User;
import com.fit.monolithic.backend.enums.AuthProvider;
import com.fit.monolithic.backend.enums.RoleName;
import com.fit.monolithic.backend.repository.PasswordResetTokenRepository;
import com.fit.monolithic.backend.repository.RefreshTokenRepository;
import com.fit.monolithic.backend.repository.RoleRepository;
import com.fit.monolithic.backend.repository.UserRepository;
import com.fit.monolithic.backend.service.EmailService;
import com.fit.monolithic.backend.service.AuthService;
import com.fit.monolithic.backend.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;

import java.util.Collections;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;

    @Value("${spring.security.oauth2.client.registration.google.client-id:}")
    private String googleClientId;
//    @Override
//    public LoginResponse login(LoginRequest request) {
//        User user = userRepository
//                .findByEmail(request.getEmail())
//                .orElseThrow(() ->
//                        new ResponseStatusException(
//                                HttpStatus.UNAUTHORIZED,
//                                "Invalid credentials"
//                        )
//                );
//
//        if (!passwordEncoder.matches(request.getPassword(),user.getPassword())) {
//            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
//        }
//
//        String token = jwtUtil.generateToken(
//                user.getEmail(),
//                Map.of(
//                        "userId", user.getId(),
//                        "roles", user.getRoles()
//                                .stream()
//                                .map(r -> r.getName().name())
//                                .toList()
//                )
//        );
//
//        log.info("Login successful");
//
//        return new LoginResponse(token);
//    }
@Override
@Transactional
public LoginResponse login(LoginRequest request) {

    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid credentials"));

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    }

    refreshTokenRepository.deleteByUser(user);
    refreshTokenRepository.flush();
    String accessToken = jwtUtil.generateAccessToken(user);

    RefreshToken refreshToken = new RefreshToken();
    refreshToken.setToken(jwtUtil.generateRefreshToken());
    refreshToken.setUser(user);
    refreshToken.setExpiryDate(
            LocalDateTime.now().plusDays(30)
    );

    refreshTokenRepository.save(refreshToken);

    return new LoginResponse(accessToken, refreshToken.getToken());
}

    @Override
    public LoginResponse refreshToken(String refreshToken) {

        RefreshToken token = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid refresh token"));

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(token);
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Refresh token expired");
        }

        String newAccessToken = jwtUtil.generateAccessToken(token.getUser());

        return new LoginResponse(newAccessToken, token.getToken());
    }
    @Override
    @Transactional
    public void logout(String refreshToken) {
        refreshTokenRepository.deleteByToken(refreshToken);
    }
    @Override
    @Transactional
    public RegisterResponse register(RegisterRequest registerRequest) {
        User  user = new User();
        user.setFullName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setAuthProvider(AuthProvider.LOCAL);
        Role role = roleRepository.findByName(RoleName.ROLE_USER)
                        .orElseThrow(() -> new RuntimeException("ROLE_USER not found"));
        user.setRoles(Set.of(role));
        userRepository.save(user);
        String token = jwtUtil.generateAccessToken(user);
        log.info("Register successful");
        return new RegisterResponse(token);
    }

    @Override
    @Transactional
    public LoginResponse loginWithGoogle(String token) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(token);
            if (idToken == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Google token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");

            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setFullName(name);
                newUser.setAuthProvider(AuthProvider.GOOGLE);
                newUser.setPassword(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
                
                Role role = roleRepository.findByName(RoleName.ROLE_USER)
                        .orElseThrow(() -> new RuntimeException("ROLE_USER not found"));
                newUser.setRoles(Set.of(role));
                return userRepository.save(newUser);
            });

            refreshTokenRepository.deleteByUser(user);
            refreshTokenRepository.flush();
            
            String accessToken = jwtUtil.generateAccessToken(user);
            String rfToken = jwtUtil.generateRefreshToken();
            
            RefreshToken refreshToken = new RefreshToken();
            refreshToken.setToken(rfToken);
            refreshToken.setUser(user);
            refreshToken.setExpiryDate(LocalDateTime.now().plusDays(30));
            refreshTokenRepository.save(refreshToken);

            return new LoginResponse(accessToken, rfToken);
        } catch (Exception e) {
            log.error("Google login failed", e);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google login failed");
        }
    }

    @Override
    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Email không tồn tại"));

        // Xóa token cũ nếu có
        passwordResetTokenRepository.deleteByUser(user);

        // Tạo token mới
        String token = java.util.UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusMinutes(15))
                .build();

        passwordResetTokenRepository.save(resetToken);

        // Gửi email (link dẫn về frontend)
        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        try {
            emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
        } catch (Exception e) {
            log.error("Failed to send reset email", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Không thể gửi email");
        }
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token không hợp lệ"));

        if (resetToken.isExpired()) {
            passwordResetTokenRepository.delete(resetToken);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token đã hết hạn");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Xóa token sau khi dùng
        passwordResetTokenRepository.delete(resetToken);
    }
}
