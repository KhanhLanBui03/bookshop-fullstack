package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.dto.request.CheckoutRequest;
import com.fit.monolithic.backend.dto.response.CheckoutResponse;
import com.fit.monolithic.backend.dto.response.based.ApiResponse;
import com.fit.monolithic.backend.security.CustomUserDetails;
import com.fit.monolithic.backend.service.CheckoutService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/checkout")
@RequiredArgsConstructor
public class CheckoutController {

    private final CheckoutService checkoutService;

    @PostMapping("/prepare")
    public ApiResponse<CheckoutResponse> prepare(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CheckoutRequest request
    ) {

        return new ApiResponse<>(
                201,
                "Success",
                checkoutService.prepareCheckout(userDetails, request)
        );
    }
}
