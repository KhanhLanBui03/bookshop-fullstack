package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.dto.request.AddToCartRequest;
import com.fit.monolithic.backend.dto.response.CartResponse;
import com.fit.monolithic.backend.security.CustomUserDetails;
import com.fit.monolithic.backend.service.CartService;
import com.fit.monolithic.backend.service.Impl.CustomUserDetailsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping
    public ResponseEntity<CartResponse> addToCart(
            @RequestBody @Valid AddToCartRequest request,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        return ResponseEntity.ok(
                cartService.addToCart(user.getId(), request)
        );
    }
}
