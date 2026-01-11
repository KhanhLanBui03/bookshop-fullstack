package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.entity.RefreshToken;
import com.fit.monolithic.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByUser(User user);
    void deleteByToken(String token);
    void flush();
}
