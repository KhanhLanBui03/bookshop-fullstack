package com.fit.monolithic.backend.service;

import com.fit.monolithic.backend.dto.request.AddressRequest;
import com.fit.monolithic.backend.dto.response.AddressResponse;
import com.fit.monolithic.backend.security.CustomUserDetails;

public interface AddressService {
    AddressResponse addAddress(AddressRequest addressRequest, CustomUserDetails customUserDetails);
}
