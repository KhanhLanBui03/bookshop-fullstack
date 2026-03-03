package com.fit.monolithic.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class BookDashboardStats {
    private Long totalBooks;
    private Long countActive;
    private Long countLowStock;
    private Long countOutOfStock;
}
