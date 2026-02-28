package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.dto.request.AddressRequest;
import com.fit.monolithic.backend.dto.response.AddressResponse;
import com.fit.monolithic.backend.dto.response.based.ApiResponse;
import com.fit.monolithic.backend.security.CustomUserDetails;
import com.fit.monolithic.backend.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/addresses")
public class AddressController {
    private final AddressService addressService;
    @PostMapping
    public ApiResponse<AddressResponse> addNewAddress(
            @RequestBody AddressRequest addressRequest,
            @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        return new ApiResponse<>(
                201,
                "Success",
                addressService.addAddress(addressRequest, customUserDetails)
        );
    }
}
