package com.fit.monolithic.backend.service;

import com.fit.monolithic.backend.dto.response.ProfileResponse;
import com.fit.monolithic.backend.entity.User;
import com.fit.monolithic.backend.security.CustomUserDetails;

import java.util.Optional;

public interface UserService {
    ProfileResponse getProfile(CustomUserDetails userDetails);
}
