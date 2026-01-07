package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
