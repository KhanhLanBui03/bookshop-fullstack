package com.fit.monolithic.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InventoryLogResponse {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private Integer changeAmount;
    private Integer stockAfter;
    private String reason;
    private LocalDateTime createdAt;
}
