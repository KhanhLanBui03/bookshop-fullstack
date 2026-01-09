package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.dto.request.DiscountRequest;
import com.fit.monolithic.backend.dto.response.DiscountResponse;
import com.fit.monolithic.backend.dto.response.based.ApiResponse;
import com.fit.monolithic.backend.entity.Discount;
import com.fit.monolithic.backend.service.DiscountService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Tag(name = "Discount API", description = "Operations related to discounts")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/discounts")
public class DiscountController {
    private final DiscountService discountService;
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<List<DiscountResponse>> getAllDiscounts() {
        return new ApiResponse<>(
                200,
                "Success",
                discountService.getAllDiscount()
                );
    }
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<DiscountResponse> getDiscountById(@PathVariable Long id) {
        return new ApiResponse<DiscountResponse>(
                200,
                "Success",
                discountService.getDiscountById(id)
        );
    }
    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<DiscountResponse> saveDiscount(@Valid @RequestBody DiscountRequest discount) {
        return new ApiResponse<DiscountResponse>(
                201,
                "Create new discount success",
                discountService.create(discount)
        );
    }
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<Void> deleteDiscountById(@PathVariable Long id) {
        discountService.deleteDiscountById(id);
        return new ApiResponse<>(
                200,
                "Deleted success",
                null
        );
    }
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<DiscountResponse> update(@PathVariable Long id, @Valid @RequestBody DiscountRequest discount) {
        return new ApiResponse<>(
                200,
                "Updated discount success",
                discountService.updateDiscountById(id, discount)
        );
    }

}
