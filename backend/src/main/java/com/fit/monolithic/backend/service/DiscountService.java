package com.fit.monolithic.backend.service;

import com.fit.monolithic.backend.dto.request.DiscountRequest;
import com.fit.monolithic.backend.dto.response.DiscountResponse;
import com.fit.monolithic.backend.entity.Discount;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;

public interface DiscountService {
    List<DiscountResponse> getAllDiscount();
    DiscountResponse getDiscountById(Long id);
    DiscountResponse create(DiscountRequest discountRequest);
    DiscountResponse updateDiscountById( Long id, DiscountRequest discountRequest);
    void deleteDiscountById(Long id);
}
