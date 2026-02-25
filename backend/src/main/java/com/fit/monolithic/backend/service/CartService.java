package com.fit.monolithic.backend.service;

import com.fit.monolithic.backend.dto.request.AddToCartRequest;
import com.fit.monolithic.backend.dto.request.UpdateCartItemRequest;
import com.fit.monolithic.backend.dto.response.CartResponse;

public interface CartService {
    CartResponse addToCart(Long userId, AddToCartRequest request);
    CartResponse getCart(Long userId);
    CartResponse updateQuantity(Long userId, UpdateCartItemRequest request);
    CartResponse removeItem(Long userId, Long bookId);
}
