package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.dto.request.AddressRequest;
import com.fit.monolithic.backend.dto.response.AddressResponse;
import com.fit.monolithic.backend.entity.Address;
import com.fit.monolithic.backend.entity.User;
import com.fit.monolithic.backend.enums.AddressType;
import com.fit.monolithic.backend.repository.AddressRepository;
import com.fit.monolithic.backend.repository.UserRepository;
import com.fit.monolithic.backend.security.CustomUserDetails;
import com.fit.monolithic.backend.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private AddressResponse mapToResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .street(address.getStreet())
                .city(address.getCity())
                .state(address.getState())
                .zip(address.getZip())
                .country(address.getCountry())
                .build();
    }
    @Override
    public AddressResponse addAddress(AddressRequest request, CustomUserDetails userDetails) {

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = new Address();
        address.setStreet(request.getStreet());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setZip(request.getZip());
        address.setCountry(request.getCountry());
        address.setType(AddressType.SHIPPING);
        address.setDefault(true);
        address.setUser(user);

        Address saved = addressRepository.save(address);

        return mapToResponse(saved);
    }
}
