package com.fit.monolithic.backend.controller;

import com.fit.monolithic.backend.service.ExportService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Export APIs", description = "Admin operations for exporting data")
@RequestMapping("/api/v1/admin/export")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ExportController {
    private final ExportService exportService;

    @GetMapping("/orders")
    public ResponseEntity<Resource> exportOrders() {
        String filename = "orders.xlsx";
        InputStreamResource file = new InputStreamResource(exportService.exportOrdersToExcel());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(file);
    }

    @GetMapping("/inventory")
    public ResponseEntity<Resource> exportInventory() {
        String filename = "inventory.xlsx";
        InputStreamResource file = new InputStreamResource(exportService.exportInventoryToExcel());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(file);
    }
}
