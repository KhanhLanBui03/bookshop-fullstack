package com.fit.monolithic.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UpdateCartItemRequest {
    private Long bookId;
    private Integer quantity;
}
