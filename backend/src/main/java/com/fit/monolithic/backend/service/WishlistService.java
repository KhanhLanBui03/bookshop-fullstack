package com.fit.monolithic.backend.service;

import com.fit.monolithic.backend.dto.response.WishlistResponse;

public interface WishlistService {
    void addToWishlist(Long userId, Long bookId);
    void removeFromWishlist(Long userId, Long bookId);
    WishlistResponse getWishlist(Long userId);
    boolean isInWishlist(Long userId, Long bookId);
}
