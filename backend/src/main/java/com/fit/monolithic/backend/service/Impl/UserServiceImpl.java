package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.dto.response.AddressResponse;
import com.fit.monolithic.backend.dto.response.OrderResponse;
import com.fit.monolithic.backend.dto.response.ProfileResponse;
import com.fit.monolithic.backend.entity.Address;
import com.fit.monolithic.backend.entity.User;
import com.fit.monolithic.backend.repository.AddressRepository;
import com.fit.monolithic.backend.repository.OrderRepository;
import com.fit.monolithic.backend.repository.UserRepository;
import com.fit.monolithic.backend.security.CustomUserDetails;
import com.fit.monolithic.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
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
}
