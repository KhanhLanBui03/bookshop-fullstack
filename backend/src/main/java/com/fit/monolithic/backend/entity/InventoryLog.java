package com.fit.monolithic.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_logs")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InventoryLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    private Integer changeAmount; // Positive for restock, negative for sale/loss

    private Integer stockAfter;

    private String reason; // e.g., "RESTOCK", "SALE", "CANCELLED_ORDER", "DAMAGE"

    @CreationTimestamp
    private LocalDateTime createdAt;
}
