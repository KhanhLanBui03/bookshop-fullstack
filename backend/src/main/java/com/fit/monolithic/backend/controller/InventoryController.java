package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.dto.response.InventoryLogResponse;
import com.fit.monolithic.backend.dto.response.based.ApiResponse;
import com.fit.monolithic.backend.service.InventoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Inventory APIs", description = "Admin operations for inventory")
@RequestMapping("/api/v1/admin/inventory")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class InventoryController {
    private final InventoryService inventoryService;

    @PostMapping("/update-stock")
    public ApiResponse<Void> updateStock(
            @RequestParam Long bookId,
            @RequestParam Integer amount,
            @RequestParam String reason
    ) {
        inventoryService.updateStock(bookId, amount, reason);
        return new ApiResponse<>(200, "Stock updated", null);
    }

    @GetMapping("/logs")
    public ApiResponse<Page<InventoryLogResponse>> getAllLogs(@PageableDefault(size = 10) Pageable pageable) {
        return new ApiResponse<>(200, "Success", inventoryService.getAllLogs(pageable));
    }

    @GetMapping("/logs/{bookId}")
    public ApiResponse<Page<InventoryLogResponse>> getLogsByBook(
            @PathVariable Long bookId,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        return new ApiResponse<>(200, "Success", inventoryService.getLogsByBook(bookId, pageable));
    }
}
