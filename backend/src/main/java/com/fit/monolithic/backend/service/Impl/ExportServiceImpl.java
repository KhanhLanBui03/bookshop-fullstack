package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.entity.Order;
import com.fit.monolithic.backend.entity.InventoryLog;
import com.fit.monolithic.backend.repository.OrderRepository;
import com.fit.monolithic.backend.repository.InventoryLogRepository;
import com.fit.monolithic.backend.service.ExportService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExportServiceImpl implements ExportService {
    private final OrderRepository orderRepository;
    private final InventoryLogRepository inventoryLogRepository;

    @Override
    public ByteArrayInputStream exportOrdersToExcel() {
        List<Order> orders = orderRepository.findAll();
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Orders");

            // Header
            Row headerRow = sheet.createRow(0);
            String[] columns = {"ID", "Order Code", "Customer", "Total Amount", "Status", "Date"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
            }

            // Data
            int rowIdx = 1;
            for (Order order : orders) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(order.getId());
                row.createCell(1).setCellValue(order.getOrderCode());
                row.createCell(2).setCellValue(order.getOrderUser().getFullName());
                row.createCell(3).setCellValue(order.getOrderTotalAmount().doubleValue());
                row.createCell(4).setCellValue(order.getOrderStatus().toString());
                row.createCell(5).setCellValue(order.getOrderDate().toString());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Fail to export data to Excel file: " + e.getMessage());
        }
    }

    @Override
    public ByteArrayInputStream exportInventoryToExcel() {
        List<InventoryLog> logs = inventoryLogRepository.findAll();
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Inventory Logs");

            // Header
            Row headerRow = sheet.createRow(0);
            String[] columns = {"ID", "Book", "Change", "Stock After", "Reason", "Date"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
            }

            // Data
            int rowIdx = 1;
            for (InventoryLog log : logs) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(log.getId());
                row.createCell(1).setCellValue(log.getBook().getTitle());
                row.createCell(2).setCellValue(log.getChangeAmount());
                row.createCell(3).setCellValue(log.getStockAfter());
                row.createCell(4).setCellValue(log.getReason());
                row.createCell(5).setCellValue(log.getCreatedAt().toString());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Fail to export inventory to Excel file: " + e.getMessage());
        }
    }
}
