package com.fit.monolithic.backend.service.Impl;

import com.fit.monolithic.backend.dto.response.InventoryLogResponse;
import com.fit.monolithic.backend.entity.Book;
import com.fit.monolithic.backend.entity.InventoryLog;
import com.fit.monolithic.backend.repository.BookRepository;
import com.fit.monolithic.backend.repository.InventoryLogRepository;
import com.fit.monolithic.backend.service.InventoryService;
import com.fit.monolithic.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {
    private final InventoryLogRepository logRepository;
    private final BookRepository bookRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public void updateStock(Long bookId, Integer amount, String reason) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        int newStock = book.getStock() + amount;
        if (newStock < 0) {
            throw new RuntimeException("Insufficient stock");
        }

        book.setStock(newStock);
        bookRepository.save(book);

        InventoryLog log = InventoryLog.builder()
                .book(book)
                .changeAmount(amount)
                .stockAfter(newStock)
                .reason(reason)
                .build();
        logRepository.save(log);

        // 🔥 Gửi thông báo cho Admin nếu sắp hết hàng (< 5)
        if (newStock < 5) {
            notificationService.createNotificationToAdmins(
                    "Cảnh báo hết hàng",
                    "Sách '" + book.getTitle() + "' hiện chỉ còn " + newStock + " cuốn trong kho.",
                    "/inventory"
            );
        }
    }

    @Override
    public Page<InventoryLogResponse> getLogsByBook(Long bookId, Pageable pageable) {
        return logRepository.findByBookIdOrderByCreatedAtDesc(bookId, pageable).map(this::mapToResponse);
    }

    @Override
    public Page<InventoryLogResponse> getAllLogs(Pageable pageable) {
        return logRepository.findAllByOrderByCreatedAtDesc(pageable).map(this::mapToResponse);
    }

    private InventoryLogResponse mapToResponse(InventoryLog log) {
        return InventoryLogResponse.builder()
                .id(log.getId())
                .bookId(log.getBook().getId())
                .bookTitle(log.getBook().getTitle())
                .changeAmount(log.getChangeAmount())
                .stockAfter(log.getStockAfter())
                .reason(log.getReason())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
