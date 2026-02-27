package com.fit.monolithic.backend.dto.response;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CheckoutResponse {
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private List<AddressResponse> customerAddresses;
    private List<CheckoutItemResponse> items;
    private BigDecimal totalAmount;


}
