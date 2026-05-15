package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.dto.response.WishlistResponse;
import com.fit.monolithic.backend.dto.response.based.ApiResponse;
import com.fit.monolithic.backend.security.CustomUserDetails;
import com.fit.monolithic.backend.service.WishlistService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Wishlist APIs", description = "Operations related to wishlist")
@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping("/add/{bookId}")
    public ApiResponse<String> addToWishlist(
            @PathVariable Long bookId,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        wishlistService.addToWishlist(user.getId(), bookId);
        return new ApiResponse<>(200, "Added to wishlist successfully", null);
    }

    @DeleteMapping("/remove/{bookId}")
    public ApiResponse<String> removeFromWishlist(
            @PathVariable Long bookId,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        wishlistService.removeFromWishlist(user.getId(), bookId);
        return new ApiResponse<>(200, "Removed from wishlist successfully", null);
    }

    @GetMapping
    public ApiResponse<WishlistResponse> getWishlist(
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        return new ApiResponse<>(200, "Success", wishlistService.getWishlist(user.getId()));
    }

    @GetMapping("/check/{bookId}")
    public ApiResponse<Boolean> checkInWishlist(
            @PathVariable Long bookId,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        return new ApiResponse<>(200, "Success", wishlistService.isInWishlist(user.getId(), bookId));
    }
}
