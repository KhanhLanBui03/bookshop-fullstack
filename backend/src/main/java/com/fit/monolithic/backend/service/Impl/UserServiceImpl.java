package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.dto.response.*;
import com.fit.monolithic.backend.entity.Address;
import com.fit.monolithic.backend.entity.Role;
import com.fit.monolithic.backend.entity.User;
import com.fit.monolithic.backend.enums.AuthProvider;
import com.fit.monolithic.backend.enums.RoleName;
import com.fit.monolithic.backend.repository.AddressRepository;
import com.fit.monolithic.backend.repository.OrderRepository;
import com.fit.monolithic.backend.repository.UserRepository;
import com.fit.monolithic.backend.security.CustomUserDetails;
import com.fit.monolithic.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final OrderRepository orderRepository;
    @Override
    public ProfileResponse getProfile(CustomUserDetails userDetails) {
        Long id = userDetails.getId();
        User user = userRepository.findById(id).orElse(null);
        if(user == null){
            throw new RuntimeException("User not found");
        }
        List<AddressResponse> addresses = addressRepository.findAllByUser(user)
                .stream()
                .map(a->new AddressResponse(
                        a.getId(),
                        a.getStreet(),
                        a.getCity(),
                        a.getState(),
                        a.getZip(),
                        a.getCountry()
                ))
                .toList();
        List<OrderResponse> orders = orderRepository.findAllByOrderUser(user)
                .stream()
                .map(o->new OrderResponse(
                        o.getId(),
                        o.getPaymentMethod(),
                        o.getOrderCode(),
                        o.getOrderTotalAmount(),
                        o.getOrderStatus(),
                        o.getOrderDate()
                )).toList();

        return ProfileResponse.builder()
                .id(user.getId())
                .name(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhoneNumber())
                .createAt(user.getCreateAt())
                .addresses(addresses)
                .orders(orders)
                .build();

    }

    @Override
    public UserDashboardStats getDashboardOverview() {
        return userRepository.getDashboardOverview();
    }

    @Override
    public Page<UserAdminResponse> getAdminUser(
            String keyword,
            String role,
            AuthProvider authProvider,
            Pageable pageable
    ) {
        // ✅ Parse String → Enum an toàn
        RoleName roleEnum = null;
        if (role != null && !role.isBlank()) {
            try {
                roleEnum = RoleName.valueOf("ROLE_" + role.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid role: " + role);
            }
        }

        Page<UserAdminResponse> userPage =
                userRepository.getAdmins(keyword, roleEnum, authProvider, pageable);

        // ✅ Load roles riêng để tránh N+1 và tránh duplicate khi JOIN
        List<Long> userIds = userPage.getContent()
                .stream()
                .map(UserAdminResponse::getId)
                .toList();

        if (!userIds.isEmpty()) {
            List<User> users = userRepository.findAllById(userIds);

            Map<Long, List<String>> roleMap = users.stream()
                    .collect(Collectors.toMap(
                            User::getId,
                            user -> user.getRoles()
                                    .stream()
                                    .map(r -> r.getName().name().replace("ROLE_", ""))
                                    .toList()
                    ));

            userPage.getContent().forEach(dto ->
                    dto.setRoles(roleMap.getOrDefault(dto.getId(), List.of()))
            );
        }

        return userPage;
    }
}
