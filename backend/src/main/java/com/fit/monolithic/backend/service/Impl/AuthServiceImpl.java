package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.dto.request.LoginRequest;
import com.fit.monolithic.backend.dto.request.RegisterRequest;
import com.fit.monolithic.backend.dto.response.LoginResponse;
import com.fit.monolithic.backend.dto.response.RegisterResponse;
import com.fit.monolithic.backend.entity.RefreshToken;
import com.fit.monolithic.backend.entity.Role;
import com.fit.monolithic.backend.entity.User;
import com.fit.monolithic.backend.enums.AuthProvider;
import com.fit.monolithic.backend.enums.RoleName;
import com.fit.monolithic.backend.repository.RefreshTokenRepository;
import com.fit.monolithic.backend.repository.RoleRepository;
import com.fit.monolithic.backend.repository.UserRepository;
import com.fit.monolithic.backend.service.AuthService;
import com.fit.monolithic.backend.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

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
    private final JwtUtil jwtUtil;
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
}
