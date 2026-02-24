package com.fit.monolithic.backend.service;

import com.fit.monolithic.backend.dto.request.AddToCartRequest;
import com.fit.monolithic.backend.dto.response.CartResponse;

public interface CartService {
    CartResponse addToCart(Long userId, AddToCartRequest request);
}
