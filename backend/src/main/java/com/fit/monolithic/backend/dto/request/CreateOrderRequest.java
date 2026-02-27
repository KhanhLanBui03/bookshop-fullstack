package com.fit.monolithic.backend.dto.request;

import com.fit.monolithic.backend.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateOrderRequest {
    private Long addressId;
    private PaymentMethod paymentMethod;
    private List<Long> cartItemIds;
}
