package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.entity.InventoryLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryLogRepository extends JpaRepository<InventoryLog, Long> {
    Page<InventoryLog> findByBookIdOrderByCreatedAtDesc(Long bookId, Pageable pageable);
    Page<InventoryLog> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
