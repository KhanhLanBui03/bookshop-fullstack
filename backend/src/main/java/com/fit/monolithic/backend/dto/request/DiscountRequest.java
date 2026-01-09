package com.fit.monolithic.backend.dto.request;

import com.fit.monolithic.backend.enums.TargetType;
import com.fit.monolithic.backend.enums.ValueType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DiscountRequest {

    @NotBlank(message = "Tên khuyến mãi không được để trống")
    @Size(max = 100, message = "Tên khuyến mãi tối đa 100 ký tự")
    private String name;

    @NotBlank(message = "Mã khuyến mãi không được để trống")
    @Size(max = 50, message = "Mã khuyến mãi tối đa 50 ký tự")
    private String code;

    @NotNull(message = "Loại áp dụng khuyến mãi không được để trống")
    private TargetType discountTargetType;

    @NotNull(message = "Loại giá trị khuyến mãi không được để trống")
    private ValueType discountValueType;

    @NotNull(message = "Giá trị khuyến mãi không được để trống")
    @Positive(message = "Giá trị khuyến mãi phải > 0")
    private Double discountValue;

    @Positive(message = "Giá trị giảm tối đa phải > 0")
    private Double discountMaxAmount;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDate discountStartDate;

    @NotNull(message = "Ngày kết thúc không được để trống")
    private LocalDate discountEndDate;

    @Positive(message = "Số lượng giới hạn phải > 0")
    private Long discountQuantityLimit;

    private Boolean discountActive;
}
