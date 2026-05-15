package com.fit.monolithic.backend.service;

import com.fit.monolithic.backend.dto.response.InventoryLogResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface InventoryService {
    void updateStock(Long bookId, Integer amount, String reason);
    Page<InventoryLogResponse> getLogsByBook(Long bookId, Pageable pageable);
    Page<InventoryLogResponse> getAllLogs(Pageable pageable);
}
