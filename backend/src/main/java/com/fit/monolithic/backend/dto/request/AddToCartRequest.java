package com.fit.monolithic.backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class AddToCartRequest {
    @NotNull
    private Long bookId;
    @Min(1)
    private int quantity;
}
