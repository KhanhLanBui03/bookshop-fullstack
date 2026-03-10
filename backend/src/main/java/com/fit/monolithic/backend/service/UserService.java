package com.fit.monolithic.backend.service;

import com.fit.monolithic.backend.dto.response.ProfileResponse;
import com.fit.monolithic.backend.dto.response.UserAdminResponse;
import com.fit.monolithic.backend.dto.response.UserDashboardStats;
import com.fit.monolithic.backend.entity.User;
import com.fit.monolithic.backend.enums.AuthProvider;
import com.fit.monolithic.backend.security.CustomUserDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface UserService {
    ProfileResponse getProfile(CustomUserDetails userDetails);
    UserDashboardStats getDashboardOverview();
    Page<UserAdminResponse> getAdminUser(
            String keyword,
            String role,
            AuthProvider authProvider,
            Pageable pageable
    );
}
