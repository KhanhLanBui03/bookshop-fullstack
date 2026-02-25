package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.dto.request.AddToCartRequest;
import com.fit.monolithic.backend.dto.request.UpdateCartItemRequest;
import com.fit.monolithic.backend.dto.response.CartResponse;
import com.fit.monolithic.backend.dto.response.based.ApiResponse;
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
    public ApiResponse<CartResponse> addToCart(
            @RequestBody @Valid AddToCartRequest request,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        return new ApiResponse<>(
                200,
                "Success",
                cartService.addToCart(user.getId(), request)
        );
    }
    @GetMapping
    public ApiResponse<CartResponse> getCart(
          @AuthenticationPrincipal CustomUserDetails user
    ){
        return new ApiResponse<>(
                200,
                "Success",
                cartService.getCart(user.getId())
        );
    }
    @PutMapping("/update")
    public ApiResponse<CartResponse> updateQuantity(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody UpdateCartItemRequest request
            ){
        return new ApiResponse<>(
                200,
                "Success",
                cartService.updateQuantity(userDetails.getId(),request)
        );
    }
    @DeleteMapping("/{bookId}")
    public ApiResponse<CartResponse> removeFromCart(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long bookId
    ){
        return new ApiResponse<>(
                200,
                "Success",
                cartService.removeItem(userDetails.getId(), bookId)
        );
    }

}
