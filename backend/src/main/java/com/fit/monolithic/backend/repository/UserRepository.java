package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @Query("""
                SELECT COUNT(DISTINCT u)
                FROM User u
                JOIN u.roles r
                WHERE r.name = com.fit.monolithic.backend.enums.RoleName.ROLE_USER
            """)
    Long countCustomers();
}
