package com.fit.monolithic.backend.dto.request;

import com.fit.monolithic.backend.enums.AddressType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AddressRequest {
    private String street;
    private String city;
    private String state;
    private String zip;
    private AddressType type;
}
