package com.fit.monolithic.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private LocalDate createAt;
    private List<AddressResponse> addresses;
    private List<OrderResponse> orders;

}
