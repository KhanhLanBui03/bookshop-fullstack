package com.fit.monolithic.backend.dto.response;

import com.fit.monolithic.backend.enums.TargetType;
import com.fit.monolithic.backend.enums.ValueType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DiscountResponse {

    private Long id;
    private String name;
    private String code;
    private TargetType discountTargetType;
    private ValueType discountValueType;
    private Double discountValue;
    private Double discountMaxAmount;
    private LocalDate discountStartDate;
    private LocalDate discountEndDate;
    private Long discountQuantityLimit;
    private boolean discountActive;
}
