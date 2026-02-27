package com.fit.monolithic.backend.service;

import com.fit.monolithic.backend.dto.request.CheckoutRequest;
import com.fit.monolithic.backend.dto.response.CheckoutResponse;
import com.fit.monolithic.backend.security.CustomUserDetails;

public interface CheckoutService {

    CheckoutResponse prepareCheckout(
            CustomUserDetails userDetails,
            CheckoutRequest request
    );

}