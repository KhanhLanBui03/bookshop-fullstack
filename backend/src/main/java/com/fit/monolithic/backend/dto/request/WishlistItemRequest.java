package com.fit.monolithic.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class WishlistItemRequest {
    @NotNull(message = "Book id không được để trống")
    private Long bookId;
}
