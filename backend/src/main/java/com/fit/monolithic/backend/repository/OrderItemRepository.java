package com.fit.monolithic.backend.repository;

import com.fit.monolithic.backend.entity.OrderItem;
import com.fit.monolithic.backend.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    boolean existsByBookId(Long bookId);

    @Query("""
            SELECT COUNT(oi) > 0
            FROM OrderItem oi
            WHERE oi.order.orderUser.id = :userId
            AND oi.book.id = :bookId
            AND oi.order.orderStatus = :status
            """)
    boolean hasPurchased(Long userId, Long bookId, OrderStatus status);
}
